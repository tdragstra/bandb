const express = require("express");
const { Router } = express;
const Product = require("../models").product;
const Categorie = require("../models").categorie;

const router = new Router();

router.get("/", async (req, res, next) => {
	// should return a list of all the teams
	const products = await Product.findAll({
		include: [Categorie],
	});
	res.send(products);
});

router.get("/:id", async (req, res, next) => {
	// should return a list of products and its categorie

	try {
		const product = await Product.findByPk(req.params.id, {
			include: [Categorie],
		});
		res.send(product);
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
