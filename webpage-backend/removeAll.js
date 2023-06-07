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

async function removeAllDataFromCollection() {
  try {
    connectToDatabase();
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

removeAllDataFromCollection();

app.listen(8000, () => {
  console.log('Server started on port 8000');
});