const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

const app = express();
app.use(express.json());

const uri = "mongodb+srv://tgaofred:Fred000511@products.6zn77ve.mongodb.net/?retryWrites=true&w=majority";
const databaseName = 'prodList';
const collectionName = 'prod';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let productsCollection; // MongoDB collection reference

async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db('prod');
    productsCollection = db.collection('prod');
    console.log('Connected to the database');
  } catch (err) {
    console.error('Failed to connect to the database:', err);
  }
}

connectToDatabase();

// Demo samples
async function addFieldsToCollection() {
  try {
    const collection = client.db(databaseName).collection(collectionName);

    // Create an array of documents with the desired fields
    const products = [
      { prod_name: 'Product 1', price: 9.99 },
      { prod_name: 'Product 2', price: 19.99 },
      { prod_name: 'Product 3', price: 29.99 },
    ];

    // Insert the documents into the collection
    const result = await collection.insertMany(products);
    console.log('Fields added to the collection:', result.insertedCount);
  } catch (err) {
    console.error('Failed to add fields to the collection:', err);
  }
}

// addFieldsToCollection();

async function removeAllDataFromCollection() {
  try {

    const collection = client.db(databaseName).collection(collectionName);

    const result = await collection.deleteMany();
    console.log('Removed documents:', result.deletedCount);
  } catch (err) {
    console.error('Failed to remove data from collection:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// removeAllDataFromCollection();



app.get('/api/products', async (req, res) => {
  try {
    const collection = client.db(databaseName).collection(collectionName);
    const products = await collection.find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { prod_name, price } = req.body;
    const newProduct = { prod_name, price };
    const collection = client.db(databaseName).collection(collectionName);
    const result = await collection.insertOne(newProduct);
    const product = result.ops[0];
    res.json(product);
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { newName, newPrice } = req.body;
  try {
    const filter = { _id: ObjectId(id) };
    const update = { $set: { prod_name: newName, price: newPrice } };
    const options = { returnOriginal: false };
    const result = await productsCollection.findOneAndUpdate(filter, update, options);
    const product = result.value;
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const filter = { _id: ObjectId(id) };
    const result = await productsCollection.findOneAndDelete(filter);
    const product = result.value;
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.listen(8000, () => {
  console.log('Server started on port 8000');
});
