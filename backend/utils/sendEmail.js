const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, payload) => {
  try {
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

    let text = "";
    let html = "";


    // ✅ Password reset email
    if (payload && typeof payload === "object" && payload.type === "reset") {
      const resetLink = payload.resetLink || "";
      const username = payload.username || "there";

      text = `Hi ${username},

We received a request to reset your BookNest password.

Use the link below to reset your password:
${resetLink}

This link will expire soon.

If you did not request a password reset, you can safely ignore this email.

Best regards,
BookNest Team`;

      html = `
        <div style="font-family: Arial, sans-serif; background-color: #F8F4EC; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #5C3B1E; padding: 24px; text-align: center;">
              <h1 style="color: #FFF8F0;">BookNest</h1>
            </div>

            <div style="padding: 32px;">
              <h2>Reset Your Password</h2>
              <p>Hi ${username},</p>
              <p>We received a request to reset your password.</p>

              <div style="text-align:center; margin:30px 0;">
                <a href="${resetLink}" style="background:#C9A24E; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none;">
                  Reset Password
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // ✅ Delivered email
    else if (payload && typeof payload === "object" && payload.type === "delivered") {
      const username = payload.username || "Customer";
      const estimatedDeliveryDate = payload.estimatedDeliveryDate || "";
      const deliveryNote = payload.deliveryNote || "";
      const bookTitle = payload.bookTitle || "";
      const viewOrdersLink = payload.viewOrdersLink || "";
      const bookImage = payload.bookImage || "";

      text = `Hi ${username},

Your BookNest order has been delivered successfully 📚

${
  bookTitle ? `Book: ${bookTitle}\n` : ""
}${
  estimatedDeliveryDate ? `Delivered on: ${estimatedDeliveryDate}\n` : ""
}${
  deliveryNote ? `Delivery note: ${deliveryNote}\n` : ""
}
${
  viewOrdersLink ? `View your order details: ${viewOrdersLink}\n` : ""
}

We hope you enjoy your book.

Enjoy your reading 📖

Thank you for shopping with BookNest!

Best regards,
BookNest Team`;

      html = `
        <div style="font-family: Arial, sans-serif; background-color: #F8F4EC; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden;">
            
            <div style="background-color: #5C3B1E; padding: 24px; text-align: center;">
              <h1 style="color: #FFF8F0;">BookNest</h1>
            </div>

            <div style="padding: 32px;">
              <h2 style="color:#5C3B1E;">Order Delivered</h2>

              <p>Hi ${username},</p>

              <p>Your BookNest order has been delivered successfully 📚</p>

              ${
                bookImage
                  ? `<div style="text-align:center; margin: 20px 0;">
                       <img
                         src="${bookImage}"
                         alt="${bookTitle}"
                         style="max-width: 160px; width: 100%; height: auto; border-radius: 10px; border: 1px solid #E7DCCD;"
                       />
                     </div>`
                  : ""
              }

              ${
                bookTitle
                  ? `<p><strong>Book:</strong> ${bookTitle}</p>`
                  : ""
              }

              ${
                estimatedDeliveryDate
                  ? `<p><strong>Delivered on:</strong> ${estimatedDeliveryDate}</p>`
                  : ""
              }

              ${
                deliveryNote
                  ? `<p><strong>Delivery note:</strong> ${deliveryNote}</p>`
                  : ""
              }

              ${
                viewOrdersLink
                  ? `<div style="text-align:center; margin:30px 0;">
                      <a href="${viewOrdersLink}" style="background:#C9A24E; color:#fff; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:bold;">
                        View Order Details
                      </a>
                    </div>`
                  : ""
              }

              <p style="margin-top:20px;">
                We hope you enjoy your book.
              </p>

              <p style="margin-top:10px;">
                Enjoy your reading 📖
              </p>

              <p style="margin-top:20px;">
                Thank you for shopping with BookNest!
              </p>
            </div>
          </div>
        </div>
      `;
    }

    // ✅ Cancelled email
else if (payload && typeof payload === "object" && payload.type === "cancelled") {
  const username = payload.username || "Customer";
  const bookTitle = payload.bookTitle || "";
  const bookImage = payload.bookImage || "";
  const cancellationDate = payload.cancellationDate || "";
  const deliveryNote = payload.deliveryNote || "";
  const viewOrdersLink = payload.viewOrdersLink || "";

  text = `Hi ${username},

Your BookNest order has been cancelled ❌

${
  bookTitle ? `Book: ${bookTitle}\n` : ""
}${
  cancellationDate ? `Cancelled on: ${cancellationDate}\n` : ""
}${
  deliveryNote ? `Note: ${deliveryNote}\n` : ""
}
${
  viewOrdersLink ? `View your orders: ${viewOrdersLink}\n` : ""
}

If you have already made a payment, please contact support for refund details.

We’re here if you need help.

Best regards,
BookNest Team`;

  html = `
    <div style="font-family: Arial, sans-serif; background-color: #F8F4EC; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden;">
        
        <div style="background-color: #5C3B1E; padding: 24px; text-align: center;">
          <h1 style="color: #FFF8F0;">BookNest</h1>
        </div>

        <div style="padding: 32px;">
          <h2 style="color:#5C3B1E;">Order Cancelled</h2>

          <p>Hi ${username},</p>

          <p>Your BookNest order has been cancelled ❌</p>

          ${
            bookImage
              ? `<div style="text-align:center; margin: 20px 0;">
                   <img
                     src="${bookImage}"
                     alt="${bookTitle}"
                     style="max-width: 160px; width: 100%; height: auto; border-radius: 10px; border: 1px solid #E7DCCD;"
                   />
                 </div>`
              : ""
          }

          ${
            bookTitle
              ? `<p><strong>Book:</strong> ${bookTitle}</p>`
              : ""
          }

          ${
            cancellationDate
              ? `<p><strong>Cancelled on:</strong> ${cancellationDate}</p>`
              : ""
          }

          ${
            deliveryNote
              ? `<p><strong>Note:</strong> ${deliveryNote}</p>`
              : ""
          }

          ${
            viewOrdersLink
              ? `<div style="text-align:center; margin:30px 0;">
                  <a href="${viewOrdersLink}" style="background:#C9A24E; color:#fff; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:bold;">
                    View Orders
                  </a>
                </div>`
              : ""
          }

          <p style="margin-top:20px;">
            If you have already made a payment, please contact support for refund details.
          </p>

          <p style="margin-top:20px;">
            We’re here if you need help.
          </p>

          <p style="margin-top:20px;">
            Thank you for choosing BookNest.
          </p>
        </div>
      </div>
    </div>
  `;
}

  // ✅ Availability alert email
else if (payload && typeof payload === "object" && payload.type === "availability") {
  const username = payload.username || "Reader";
  const bookTitle = payload.bookTitle || "";
  const bookImage = payload.bookImage || "";

  text = `Hi ${username},

Good news 📚

The book you wanted is now back in stock.

${bookTitle ? `Book: ${bookTitle}\n` : ""}

You can visit BookNest now and place your order before it sells out again.

Happy reading!

Best regards,
BookNest Team`;

  html = `
    <div style="font-family: Arial, sans-serif; background-color: #F8F4EC; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden;">
        
        <div style="background-color: #5C3B1E; padding: 24px; text-align: center;">
          <h1 style="color: #FFF8F0;">BookNest</h1>
        </div>

        <div style="padding: 32px;">
          <h2 style="color:#5C3B1E;">Back in Stock</h2>

          <p>Hi ${username},</p>

          <p>Good news 📚</p>

          <p>The book you wanted is now back in stock.</p>

          ${
            bookImage
              ? `<div style="text-align:center; margin: 20px 0;">
                   <img
                     src="${bookImage}"
                     alt="${bookTitle}"
                     style="max-width: 160px; width: 100%; height: auto; border-radius: 10px; border: 1px solid #E7DCCD;"
                   />
                 </div>`
              : ""
          }

          ${
            bookTitle
              ? `<p><strong>Book:</strong> ${bookTitle}</p>`
              : ""
          }

          <p style="margin-top:20px;">
            You can visit BookNest now and place your order before it sells out again.
          </p>

          <p style="margin-top:20px;">
            Happy reading!
          </p>
        </div>
      </div>
    </div>
  `;
}

else if (payload && typeof payload === "object" && payload.type === "orderConfirmation") {
  const username = payload.username || "Customer";
  const bookTitle = payload.bookTitle || "";
  const quantity = payload.quantity || 1;
  const total = payload.total || "";
  const orderId = payload.orderId || "";
  const bookImage = payload.bookImage || "";

  text = `Hi ${username},

Your order has been placed successfully 📚

Order ID: ${orderId}
Book: ${bookTitle}
Quantity: ${quantity}
Total: ${total}

Thank you for shopping with BookNest!`;

  html = `
<div style="font-family:Arial; background:#F8F4EC; padding:30px;">
 <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">
   
   <div style="background:#5C3B1E;padding:24px;text-align:center;">
      <h1 style="color:#FFF8F0;">BookNest</h1>
   </div>

   <div style="padding:32px;">
      <h2 style="color:#5C3B1E;">Order Confirmed 🎉</h2>

      <p>Hi ${username},</p>
      <p>Your order has been placed successfully.</p>

      ${
        bookImage ? `
        <div style="text-align:center;margin:20px 0;">
          <img src="${bookImage}"
               style="max-width:160px;border-radius:10px;">
        </div>` : ""
      }

      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Book:</strong> ${bookTitle}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Total:</strong> ${total}</p>

      <p style="margin-top:25px;">
        Thank you for shopping with BookNest!
      </p>
   </div>
 </div>
</div>
`;
}

    // ✅ Subscription email
    else if (payload && typeof payload === "object" && payload.type === "subscription") {
      const username = payload.username || "Reader";
      const unsubscribeLink = payload.unsubscribeLink || "";

      text = `Hi ${username},

Welcome to BookNest 📚

You have successfully subscribed to our updates.

You will now receive:
• New book arrivals
• Special offers
• Reading recommendations

${
  unsubscribeLink
    ? `If you want to unsubscribe, use this link:\n${unsubscribeLink}\n`
    : ""
}

We’re excited to have you with us!

Best regards,
BookNest Team`;

      html = `
        <div style="font-family: Arial, sans-serif; background-color: #F8F4EC; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden;">
            
            <div style="background-color: #5C3B1E; padding: 24px; text-align: center;">
              <h1 style="color: #FFF8F0;">BookNest</h1>
            </div>

            <div style="padding: 32px;">
              <h2 style="color:#5C3B1E;">Subscription Confirmed</h2>

              <p>Hi ${username},</p>

              <p>Welcome to BookNest 📚</p>

              <p>You have successfully subscribed to our updates.</p>

              <p>You will now receive:</p>
              <ul>
                <li>New book arrivals</li>
                <li>Special offers</li>
                <li>Reading recommendations</li>
              </ul>

              ${
                unsubscribeLink
                  ? `<div style="text-align:center; margin:30px 0;">
                      <a href="${unsubscribeLink}" style="background:#C9A24E; color:#fff; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:bold;">
                        Unsubscribe
                      </a>
                    </div>
                    <p style="font-size:14px; color:#7A6A58; text-align:center;">
                      If you no longer want to receive these emails, you can unsubscribe anytime.
                    </p>`
                  : ""
              }

              <p style="margin-top:20px;">
                We’re excited to have you with us!
              </p>

              <p style="margin-top:20px;">
                Thank you for choosing BookNest.
              </p>
            </div>
          </div>
        </div>
      `;
    }
    // ✅ Unsubscribed email
    else if (payload && typeof payload === "object" && payload.type === "unsubscribed") {
      const username = payload.username || "Reader";

      text = `Hi ${username},

You have successfully unsubscribed from BookNest updates.

You will no longer receive:
• New book arrivals
• Special offers
• Reading recommendations

We're sorry to see you go.

If you change your mind, you're always welcome back.

Best regards,
BookNest Team`;

      html = `
        <div style="font-family: Arial, sans-serif; background-color: #F8F4EC; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden;">
            
            <div style="background-color: #5C3B1E; padding: 24px; text-align: center;">
              <h1 style="color: #FFF8F0;">BookNest</h1>
            </div>

            <div style="padding: 32px;">
              <h2 style="color:#5C3B1E;">Unsubscribed</h2>

              <p>Hi ${username},</p>

              <p>You have successfully unsubscribed from BookNest updates.</p>

              <p>You will no longer receive:</p>
              <ul>
                <li>New book arrivals</li>
                <li>Special offers</li>
                <li>Reading recommendations</li>
              </ul>

              <p style="margin-top:20px;">
                We're sorry to see you go.
              </p>

              <p style="margin-top:20px;">
                If you change your mind, you're always welcome back.
              </p>

              <p style="margin-top:20px;">
                Thank you for being part of BookNest.
              </p>
            </div>
          </div>
        </div>
      `;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email error:", error);
    throw error;
  }
};

module.exports = sendEmail;