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
      { prod_name: 'Apple',
      description: 'Crisp, juicy, and delicious: the perfect apple for every bite.',
      price: 1.47, quantity: 999, sold: 0, record: [] },
      { prod_name: 'Banana',
      description: 'Delicious and healthy: the versatile banana for any occasion.',
      price: 0.99, quantity: 999, sold: 0, record: [] },
      { prod_name: 'White Peach',
      description: 'Juicy and flavorful, indulge in the delectable peach.',
      price: 2.49, quantity: 999, sold: 0, record: [] },
      { prod_name: 'Pineapple',
      description: 'Exotic tropical delight: the juicy and tangy pineapple.',
      price: 1.25, quantity: 999, sold: 0, record: [] },
      { prod_name: 'Watermelon',
      description: 'Juicy and refreshing: the summertime delight, watermelon.',
      price: 2.25, quantity: 999, sold: 0, record: [] },
      { prod_name: 'Pear',
      description: 'No pears in stock',
      price: 50, quantity: 0, sold: 0 },
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