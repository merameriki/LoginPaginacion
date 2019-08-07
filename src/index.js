const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const morgan = require('morgan');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/expresspaginacion', { useNewUrlParser: true }).then(() => console.log('db is connect'))
.catch(err => console.log(err));

//routes
const indexRoutes = require('./routes/index'); 

//setting

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

//middlewarers
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//routers

app.use(indexRoutes);

//static files


app.listen(3000, () => {
	console.log('server on port', 3000);
});