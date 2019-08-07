const router = require('express').Router();
const faker = require('faker');

const Product = require('../models/product');

//routes
router.get('/',(req, res) => {
	res.render('index');
});

router.get('/agregar-producto', (req, res) => {
	res.render('products/agregar-producto');
});


router.post('/agregar-producto', (req, res) => {
		const product = new Product();
		product.categoria = req.body.category_name;
		product.nombre = req.body.product_name;
		product.precio = req.body.product_price;
		product.cover = faker.image.image();
		console.log(product);
		product.save(err => {
			if(err) return next(err);
				res.redirect('/agregar-producto');
		});	
	
});

router.get('/products/:page', (req, res, next) => {
	let perPage = 9;
	let page = req.params.page || 1;

	Product
		.find({})
		.skip((perPage * page) - perPage)
		.limit(perPage)
		.exec((err, products) => {
			Product.countDocuments((err, count) => {
				if (err) return next(err);
				res.render('products/productos', {
					products,
					current: page,
					pages: Math.ceil(count / perPage)
				});
			})
		})
});



router.get('/generate-fake-data', (req,res) => {
	for(let i=0; i< 30; i++){
		const product = new Product();
		product.categoria = faker.commerce.department();
		product.nombre = faker.commerce.productName();
		product.precio = faker.commerce.price();
		product.cover = faker.image.image();
		console.log(product);
		product.save(err => {
			if(err) {return next(err); }
		});
	}
	res.redirect('agregar-producto');
});

// paginacion

router.get('/editar/:_id', function(req, res){
	console.log("GET EDITAR" )
	var item = {};
	for(var i=0; i< Products.count; i++){
		console.log("Entro al For" )
		if(Products[i]._id == req.params.id) {
			item = Products[i];
			console.log(Products[i]._id );
			console.log(Products[i].nombre);
			console.log("Entro al IF" );
		}
	}
	res.render("products/formedit", {products: item});
	console.log("No Entro al IF" )
	
})

router.post('/editar/:id', function(req, res){ /*antes del function saque urlencodeParser, */
	console.log("POST EDITAR" );
	var item = {};
		console.log(Products.count);
	
	for(var i=0; i< Products.count; i++){
		console.log("for del post")
		if(Product[i]._id == req.params._id) {
			item = Products[i];
			console.log(Products[i]._id);
			console.log("If del post");
		}
	}

	item.nombre = req.body.nombre;
	item.categoria = req.body.categoria;
	item.precio = req.body.precio;
	res.redirect('/products/:page')
})


module.exports = router;
