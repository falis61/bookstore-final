const router = require("express").Router();
const User = require("../models/user");
const Bundle = require("../models/bundle");
const { authenticateToken } = require("./userAuth");

// add book to cart
router.put("/add-book-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    const userData = await User.findById(id);

    const existingBookIndex = userData.cart.findIndex(
      (item) =>
        item.itemType === "book" && String(item.book) === String(bookid)
    );

    if (existingBookIndex !== -1) {
      userData.cart[existingBookIndex].quantity += 1;
    } else {
      userData.cart.push({
        itemType: "book",
        book: bookid,
        quantity: 1,
      });
    }

    await userData.save();

    return res.status(200).json({ message: "Book added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// add bundle to cart
router.put("/add-bundle-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bundleid, id } = req.headers;

    const userData = await User.findById(id);

    const bundleData = await Bundle.findById(bundleid).populate("books");

    if (!bundleData) {
      return res.status(404).json({ message: "Bundle not found" });
    }

    if (!bundleData.books || bundleData.books.length === 0) {
      return res.status(400).json({
        message: "This bundle has no books yet",
      });
    }

    const outOfStockBook = bundleData.books.find(
  (book) => Number(book.stock || 0) <= 0
);

if (outOfStockBook) {
  return res.status(400).json({
    message: `${outOfStockBook.title} is out of stock, so this bundle cannot be added to cart`,
  });
}

    const bundleOriginalPrice = bundleData.books.reduce(
      (sum, book) => sum + Number(book.price || 0),
      0
    );

    const bundleDiscountPercent = Number(bundleData.discountPercent || 0);

    const bundlePrice =
      bundleOriginalPrice -
      (bundleOriginalPrice * bundleDiscountPercent) / 100;

    const existingBundleIndex = userData.cart.findIndex(
      (item) =>
        item.itemType === "bundle" &&
        String(item.bundle) === String(bundleid)
    );

    if (existingBundleIndex !== -1) {
      userData.cart[existingBundleIndex].quantity += 1;
    } else {
      userData.cart.push({
        itemType: "bundle",
        bundle: bundleid,
        quantity: 1,
        bundleOriginalPrice,
        bundlePrice,
        bundleDiscountPercent,
      });
    }

    await userData.save();

    return res.status(200).json({ message: "Bundle added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// decrease book quantity from cart
router.put("/decrease-book-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;

    const userData = await User.findById(id);

    const existingBookIndex = userData.cart.findIndex(
      (item) =>
        item.itemType === "book" && String(item.book) === String(bookid)
    );

    if (existingBookIndex === -1) {
      return res.status(404).json({ message: "Book not found in cart" });
    }

    if (userData.cart[existingBookIndex].quantity > 1) {
      userData.cart[existingBookIndex].quantity -= 1;
    } else {
      userData.cart = userData.cart.filter(
        (item) =>
          !(item.itemType === "book" && String(item.book) === String(bookid))
      );
    }

    await userData.save();

    return res.status(200).json({
      status: "success",
      message: "Book quantity updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred" });
  }
});

// decrease bundle quantity from cart
router.put("/decrease-bundle-from-cart/:bundleid", authenticateToken, async (req, res) => {
  try {
    const { bundleid } = req.params;
    const { id } = req.headers;

    const userData = await User.findById(id);

    const existingBundleIndex = userData.cart.findIndex(
      (item) =>
        item.itemType === "bundle" && String(item.bundle) === String(bundleid)
    );

    if (existingBundleIndex === -1) {
      return res.status(404).json({ message: "Bundle not found in cart" });
    }

    if (userData.cart[existingBundleIndex].quantity > 1) {
      userData.cart[existingBundleIndex].quantity -= 1;
    } else {
      userData.cart = userData.cart.filter(
        (item) =>
          !(
            item.itemType === "bundle" &&
            String(item.bundle) === String(bundleid)
          )
      );
    }

    await userData.save();

    return res.status(200).json({
      status: "success",
      message: "Bundle quantity updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred" });
  }
});

// remove book from cart
router.put("/remove-book-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;

    await User.findByIdAndUpdate(id, {
      $pull: {
        cart: {
          itemType: "book",
          book: bookid,
        },
      },
    });

    return res.json({
      status: "success",
      message: "book removed from cart",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred" });
  }
});

// remove bundle from cart
router.put("/remove-bundle-from-cart/:bundleid", authenticateToken, async (req, res) => {
  try {
    const { bundleid } = req.params;
    const { id } = req.headers;

    await User.findByIdAndUpdate(id, {
      $pull: {
        cart: {
          itemType: "bundle",
          bundle: bundleid,
        },
      },
    });

    return res.json({
      status: "success",
      message: "bundle removed from cart",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred" });
  }
});

// get cart from a particular user
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const userData = await User.findById(id)
      .populate("cart.book")
      .populate({
        path: "cart.bundle",
        populate: {
          path: "books",
        },
      });

    const cart = userData.cart;

    return res.json({
      status: "success",
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred" });
  }
});

module.exports = router;