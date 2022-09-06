"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("products", "categoryId", {
			type: Sequelize.INTEGER,
			reference: {
				model: "categories",
				key: "id",
			},
			onUpdate: "Cascade",
			onDelete: "set null",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("products", "categoryId");
	},
};
