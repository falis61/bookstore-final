require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
require("./conn/conn");

const user = require("./routes/user");
const Books = require("./routes/book");
const favourite = require("./routes/favourite");
const cart = require("./routes/cart");
const order = require("./routes/order");

app.use(cors());
app.use(express.json());

app.use("/api/v1", user);
app.use("/api/v1", Books);
app.use("/api/v1", favourite);
app.use("/api/v1", cart);
app.use("/api/v1", order);

app.listen(process.env.PORT, () => {
  console.log(`server started at port ${process.env.PORT}`);
});