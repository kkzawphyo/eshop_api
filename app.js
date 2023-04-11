const express = require('express');
const app = express();
const morgan = require('morgan');        //http req and res middleware
const cors = require('cors');
const bodyParser = require('body-parser');//middleware controll user in/output
const productCategoryRoute = require('./api/routes/productCategory');
const userRoute = require('./api/routes/user');
const productRoute = require('./api/routes/product');

//const schemaRoutes=require('./api/models/schema');//dbms schema with code

app.use(cors());
app.use(morgan('dev'));
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/productCategory', productCategoryRoute);
app.use('/user', userRoute);
app.use('/product',productRoute);
app.get('*',function(req,res){
    res.send('define detailed route???',404);
});



module.exports = app;