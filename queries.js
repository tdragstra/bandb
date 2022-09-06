const express = require("express");
const PORT = 4000;
const app = express();
const Product = require("./models").product;

app.use = express.json();

app.get("/products", async (req, res, next) => {
	// should return a list of all the teams
	const products = await Product.findAll();
	res.send(products);
});

app.listen(PORT, console.log(`listening on ${PORT}`));
