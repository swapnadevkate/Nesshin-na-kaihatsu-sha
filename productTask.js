const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


async function connectDB() {
    await client.connect();  
    const db = client.db('Test');
    const collection = db.collection('products');  
    return collection;  // Get collection
}

// Route to display all products
app.get('/', async (req, res) => {
    const productCollection = await connectDB(); // Get the collection each time
    const products = await productCollection.find({}).toArray(); // Await the result of toArray()
    res.render('pages/show', { products });
});

// Route to show form to add new product
app.get('/add-product', (req, res) => {
    res.render('pages/product');
});

// Route to handle product addition
app.post('/add-product', async (req, res) => {
    const { productId, productName, productCategory, productPrice, productStock } = req.body;
    const newProduct = {
        productId: parseInt(productId),
        productName,
        productCategory,
        productPrice: parseFloat(productPrice),
        productStock: parseInt(productStock),
    };
    
    const productCollection = await connectDB(); // Get the collection each time
    await productCollection.insertOne(newProduct);  // Insert the new product
    res.redirect('/');  // Redirect to the home page after inserting
});

// Start the server
app.listen(5000, () => {
    console.log("Server is running on port number 5000");
});
