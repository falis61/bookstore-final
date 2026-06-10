const router = require("express").Router();
const book = require("../models/book");
const Bundle = require("../models/bundle");
const Order = require("../models/order");
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");
const sendEmail = require("../utils/sendEmail");


// place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const {
      order,
      shippingAddress,
      billingAddress,
      paymentMethod,
      cardLast4,
    } = req.body;

    if (!order || order.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    if (!shippingAddress || !billingAddress || !paymentMethod) {
      return res.status(400).json({
        message:
          "Shipping address, billing address, and payment method are required",
      });
    }

    // FIRST: check stock for all books and bundle books before placing any order
    for (const orderData of order) {
      const quantity = orderData.quantity || 1;

      if (orderData.itemType === "bundle") {
        const bundleId = orderData.bundle?._id || orderData.bundle;
        const foundBundle = await Bundle.findById(bundleId).populate("books");

        if (!foundBundle) {
          return res.status(404).json({ message: "Bundle not found" });
        }

        if (!foundBundle.books || foundBundle.books.length === 0) {
          return res.status(400).json({
            message: `${foundBundle.title} has no books`,
          });
        }

        for (const bundleBook of foundBundle.books) {
          if (bundleBook.stock < quantity) {
            return res.status(400).json({
              message: `${bundleBook.title} does not have enough stock for this bundle`,
            });
          }
        }
      } else {
        const bookId = orderData.book?._id || orderData._id;
        const foundBook = await book.findById(bookId);

        if (!foundBook) {
          return res.status(404).json({ message: "Book not found" });
        }

        if (foundBook.stock < quantity) {
          return res.status(400).json({
            message: `${foundBook.title} does not have enough stock`,
          });
        }
      }
    }

    // SECOND: place orders and reduce stock
    for (const orderData of order) {
      const quantity = orderData.quantity || 1;

      if (orderData.itemType === "bundle") {
        const bundleId = orderData.bundle?._id || orderData.bundle;
        const foundBundle = await Bundle.findById(bundleId).populate("books");

        const newOrder = new Order({
          user: id,
          itemType: "bundle",
          bundle: bundleId,
          quantity: quantity,
          bundleOriginalPrice: orderData.bundleOriginalPrice || 0,
          bundlePrice: orderData.bundlePrice || 0,
          bundleDiscountPercent: orderData.bundleDiscountPercent || 0,
          shippingAddress,
          billingAddress,
          paymentMethod,
          cardLast4: cardLast4 || "",
        });

        const orderdatafrom = await newOrder.save();

        await User.findByIdAndUpdate(id, {
          $push: { orders: orderdatafrom._id },
        });

        for (const bundleBook of foundBundle.books) {
          await book.findByIdAndUpdate(bundleBook._id, {
            $inc: { stock: -quantity },
          });
        }

        await User.findByIdAndUpdate(id, {
          $pull: {
            cart: {
              itemType: "bundle",
              bundle: bundleId,
            },
          },
        });
      } else {
        const bookId = orderData.book?._id || orderData._id;

        const newOrder = new Order({
          user: id,
          itemType: "book",
          book: bookId,
          quantity: quantity,
          shippingAddress,
          billingAddress,
          paymentMethod,
          cardLast4: cardLast4 || "",
        });

        const orderdatafrom = await newOrder.save();

        await User.findByIdAndUpdate(id, {
          $push: { orders: orderdatafrom._id },
        });

        await book.findByIdAndUpdate(bookId, {
          $inc: { stock: -quantity },
        });

        await User.findByIdAndUpdate(id, {
          $pull: {
            cart: {
              itemType: "book",
              book: bookId,
            },
          },
        });
      }
    }

    const userData = await User.findById(id);

    if (userData && userData.email) {
      const firstOrderItem = order[0];

      let emailTitle = "";
      let emailImage = "";

      if (firstOrderItem?.itemType === "bundle") {
        const firstBundleId = firstOrderItem.bundle?._id || firstOrderItem.bundle;
        const firstBundle = firstBundleId
          ? await Bundle.findById(firstBundleId)
          : null;

        emailTitle = firstBundle?.title || "";
        emailImage = firstBundle?.image || "";
      } else {
        const firstBookId =
          firstOrderItem?.book?._id || firstOrderItem?._id || null;
        const firstBook = firstBookId ? await book.findById(firstBookId) : null;

        emailTitle = firstBook?.title || "";
        emailImage = firstBook?.url || "";
      }

      const totalPrice = order.reduce((total, item) => {
        const itemQuantity = Number(item.quantity || 1);

        if (item.itemType === "bundle") {
          return total + Number(item.bundlePrice || 0) * itemQuantity;
        }

        const itemPrice = Number(item.book?.price || item.price || 0);
        return total + itemPrice * itemQuantity;
      }, 0);
      
      try {
  await sendEmail(userData.email, "BookNest Order Confirmation", {
    type: "orderConfirmation",
    username: userData.username,
    bookTitle: emailTitle,
    bookImage: emailImage,
    quantity: firstOrderItem?.quantity || 1,
    total: totalPrice,
    paymentMethod: paymentMethod,
    shippingAddress: shippingAddress,
    viewOrdersLink: "http://localhost:5173/profile/orderHistory",
  });
} catch (emailError) {
  console.log("Order placed, but confirmation email failed:", emailError.message);
}
      
    } 

    return res.json({
      status: "success",
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred" });
  }
});

// get orders history of a particular user
router.get("/get-user-orders", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: [
        { path: "book" },
        {
          path: "bundle",
          populate: { path: "books" },
        },
      ],
    });

    const ordersData = userData.orders.reverse();

    return res.json({
      status: "success",
      data: ordersData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred" });
  }
});

// get all orders (ONLY visible ones for admin)
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const userData = await Order.find({
      $or: [
        { hiddenFromAdmin: false },
        { hiddenFromAdmin: { $exists: false } },
      ],
    })
      .populate({
        path: "book",
      })
      .populate({
        path: "bundle",
        populate: { path: "books" },
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });

    return res.json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred" });
  }
});

// update order status
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, estimatedDeliveryDate, deliveryNote } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updateData = {
      status: status,
    };

    if (estimatedDeliveryDate) {
      updateData.estimatedDeliveryDate = estimatedDeliveryDate;
    }

    if (deliveryNote !== undefined) {
      updateData.deliveryNote = deliveryNote;
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("user")
      .populate("book")
      .populate({
        path: "bundle",
        populate: { path: "books" },
      });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderTitle =
      updatedOrder.itemType === "bundle"
        ? updatedOrder.bundle?.title || ""
        : updatedOrder.book?.title || "";

    const orderImage =
      updatedOrder.itemType === "bundle"
        ? updatedOrder.bundle?.image || ""
        : updatedOrder.book?.url || "";

    // ✅ send email when delivered
    if (
      updatedOrder.status === "Delivered" &&
      updatedOrder.user &&
      updatedOrder.user.email
    ) {
      await sendEmail(updatedOrder.user.email, "BookNest Order Delivered", {
        type: "delivered",
        username: updatedOrder.user.username,
        bookTitle: orderTitle,
        bookImage: orderImage,
        estimatedDeliveryDate: updatedOrder.estimatedDeliveryDate
          ? new Date(updatedOrder.estimatedDeliveryDate).toLocaleDateString()
          : "",
        deliveryNote: updatedOrder.deliveryNote || "",
        viewOrdersLink: "http://localhost:5173/profile/orderHistory",
      });
    }

    // ✅ send email when cancelled
    if (
      updatedOrder.status === "Cancelled" &&
      updatedOrder.user &&
      updatedOrder.user.email
    ) {
      await sendEmail(updatedOrder.user.email, "BookNest Order Cancelled", {
        type: "cancelled",
        username: updatedOrder.user.username,
        bookTitle: orderTitle,
        bookImage: orderImage,
        cancellationDate: new Date().toLocaleDateString(),
        deliveryNote: updatedOrder.deliveryNote || "",
        viewOrdersLink: "http://localhost:5173/profile/orderHistory",
      });
    }

    return res.json({
      status: "success",
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred" });
  }
});

// remove order from admin view only
router.put("/hide-order/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { hiddenFromAdmin: true },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({
      status: "success",
      message: "Order removed from admin view",
      data: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred" });
  }
});

// restore hidden order to admin view
router.put("/restore-order/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { hiddenFromAdmin: false },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({
      status: "success",
      message: "Order restored to admin view",
      data: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred" });
  }
});

// permanently delete order
router.delete("/delete-order/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const foundOrder = await Order.findById(id);

    if (!foundOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // remove order reference from user.orders if user still exists
    if (foundOrder.user) {
      await User.findByIdAndUpdate(foundOrder.user, {
        $pull: { orders: foundOrder._id },
      });
    }

    // IMPORTANT:
    // we are NOT restoring stock here
    // stock stays unchanged exactly as you wanted

    await Order.findByIdAndDelete(id);

    return res.json({
      status: "success",
      message: "Order deleted permanently",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred" });
  }
});

module.exports = router;