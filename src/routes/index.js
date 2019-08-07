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
	let perPage = 9
	let page = req.params.page || 1
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

//Edicion Mongo

router.get('/editar/:id', function(req, res){
	var id = req.params.id
	  Product.findById(id, gotProduct)
		  	function gotProduct (err, producto) {
    			if (err) {
      			console.log(err);
      			return next(err);
    			}
       		   return res.render('formedit', {producto: producto})
  			}
})

//Enviar
router.post('/editar/:id',function(req, res){ /*antes del function saque urlencodeParser, */
	var id = req.params.id
	var categoria 	= req.body.categoria 	|| ''
	var nombre      = req.body.nombre       || ''
  	var precio      = req.body.precio       || ''

  // Validemos que nombre o descripcion no vengan vacíos
  if ((nombre=== '') || (categoria === '')) {
    console.log('ERROR: Campos vacios')
    return res.send('Hay campos vacíos, revisar')
  }

  // Validemos que el precio sea número
  if (isNaN(precio)) {
    console.log('ERROR: Precio no es número')
    return res.send('Precio no es un número !!!!!')
  }

	  Product.findById(id, gotProduct)

	  function gotProduct (err, producto) {
	    if (err) {
	      console.log(err)
	      return next(err)
	    }

	    if (!producto) {
	      console.log('ERROR: ID no existe')
	      return res.send('ID Inválida!')
	    } else {
	      producto.nombre       = nombre
	      producto.categoria    = categoria
	      producto.precio       = precio

	      producto.save(onSaved)
	    }
	  }

	  function onSaved (err) {
	    if (err) {
	      console.log(err)
	      return next(err)
	    }

	    return res.redirect('/products/1')
	  }
})

router.get('/eliminar/:id', function(req, res){
	var id = req.params.id
	  Product.findById(id, gotProduct)
		  	function gotProduct (err, producto) {
    			if (err) {
      			console.log(err);
      			return next(err);
    			}
       		   return res.render('formeliminar', {producto: producto})
  			}
})

router.post('/eliminar/:id',function(req, res){ 
	var id = req.params.id
	console.log(id)
  Product.findById(id, gotProduct)

  function gotProduct (err, producto) {
    if (err) {
      console.log(err)
      return next(err)
    }

    if (!producto) {
      return res.send('Invalid ID. (De algún otro lado la sacaste tú...)')
    }

    // Tenemos el producto, eliminemoslo
    producto.remove(onRemoved)
    
  }

  function onRemoved (err) {
    if (err) {
      console.log(err)
      return next(err)
    }

    return res.redirect('/products/1')
  }
})



module.exports = router;
