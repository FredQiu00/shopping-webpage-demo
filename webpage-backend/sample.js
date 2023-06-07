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

// Demo samples
async function addFieldsToCollection() {
  try {
    connectToDatabase();
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
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

addFieldsToCollection();

app.listen(8000, () => {
  console.log('Server started on port 8000');
});