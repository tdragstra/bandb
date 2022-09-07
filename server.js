const express = require("express");
const PORT = 4000;
const app = express();
const productRouter = require("./routers/products");
const userRouter = require("./routers/auth");
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use("/products", productRouter);
app.use("/account", userRouter);

app.listen(PORT, console.log(`listening on ${PORT}`));

// app.get("/products", async (req, res, next) => {
// 	// should return a list of all the teams
// 	const products = await Product.findAll();
// 	res.send(products);
// });

// app.get("/", async (req, res, next) => {
// 	const greeting = "HELLO WORLD";
// 	res.send(greeting);
// });
