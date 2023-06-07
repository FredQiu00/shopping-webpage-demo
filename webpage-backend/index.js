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
  const { prod_name, price } = req.body;
  const newProduct = { prod_name, price };
  try {
    const collection = client.db(databaseName).collection(collectionName);
    const existingProduct = await collection.findOne({ prod_name });
    if (existingProduct) {
      res.status(400).json({ error: 'A product with this name already exists' });
      return;
    }
    const { insertedId } = await collection.insertOne(newProduct);
    const product = await collection.findOne({ _id: insertedId });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { prod_name: newName, price: newPrice } = req.body;
  try {
    const collection = client.db(databaseName).collection(collectionName);
    const filter = { _id: new ObjectId(id) };
    console.log(filter);
    const update = { $set: { prod_name: newName, price: newPrice } };
    const options = { returnDocument: 'after' };
    const result = await collection.findOneAndUpdate(filter, update, options);
    console.log(result);
    const product = result.value;
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const filter = { _id: new ObjectId(id) };
    const collection = client.db(databaseName).collection(collectionName);
    const result = await collection.findOneAndDelete(filter);
    const product = result.value;
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.listen(8000, () => {
  console.log('Server started on port 8000');
});
