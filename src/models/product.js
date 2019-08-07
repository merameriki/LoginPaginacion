const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	categoria: String,
	nombre: String,
	precio: Number,
	cover: String
});

module.exports = mongoose.model('Product', ProductSchema);