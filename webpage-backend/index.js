const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Change this to increase or decrease the complexity of hash

const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://tgaofred:Fred000511@products.6zn77ve.mongodb.net/?retryWrites=true&w=majority";
const databaseName = 'prodList';
const productsCollectionName = 'prod';
const usersCollectionName = 'users';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let productsCollection, usersCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db(databaseName);
    productsCollection = db.collection(productsCollectionName);
    usersCollection = db.collection(usersCollectionName);
    console.log('Connected to the database');
  } catch (err) {
    console.error('Failed to connect to the database:', err);
  }
}

connectToDatabase();

// Products' info apis
app.get('/api/products', async (req, res) => {
  try {
    const collection = client.db(databaseName).collection(productsCollectionName);
    const products = await collection.find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  const { prod_name, description, price, quantity } = req.body;
  const newProduct = { prod_name, description, price, quantity, sold: 0, record: [] };
  try {
    const collection = client.db(databaseName).collection(productsCollectionName);
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

// Handle manual (admin) update, record does not change
app.put('/api/products/update-inventory/:id', async (req, res) => {
  const { id } = req.params;
  const {
    prod_name: newName,
    description: newDescription,
    price: newPrice,
    quantity: newQuantity,
  } = req.body;
  try {
    const collection = client.db(databaseName).collection(productsCollectionName);
    const filter = { _id: new ObjectId(id) };
    const update = {
      $set: {
        prod_name: newName,
        description: newDescription,
        price: newPrice,
        quantity: newQuantity,
      }
    };
    const options = { returnDocument: 'after' };
    const result = await collection.findOneAndUpdate(filter, update, options);
    const product = result.value;
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Handle cart update
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const {
    quantity: newQuantity,
    sold: newSold,
    record: updatedRecord
  } = req.body;
  try {
    const collection = client.db(databaseName).collection(productsCollectionName);
    const filter = { _id: new ObjectId(id) };
    const update = {
      $set: {
        quantity: newQuantity,
        sold: newSold
      },
      $push: {
        record: updatedRecord,
      }
    };
    const options = { returnDocument: 'after' };
    const result = await collection.findOneAndUpdate(filter, update, options);
    const product = result.value;
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const filter = { _id: new ObjectId(id) };
    const collection = client.db(databaseName).collection(productsCollectionName);
    const result = await collection.findOneAndDelete(filter);
    const product = result.value;
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Users' info apis
app.get('/api/users', async (req, res) => {
  try {
    const collection = client.db(databaseName).collection(usersCollectionName);
    const users = await collection.find().toArray();
    delete users.password;
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users\' info' });
  }
});

// Sign-up
app.post('/api/users', async (req, res) => {
  const { username, password, email, phone } = req.body;

  // Hash password before storing it
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = { username,
    password: hashedPassword,
    email,
    phone,
    bought: [],
    active: true };
  try {
    const collection = client.db(databaseName).collection(usersCollectionName);

    // Check if user with same username, email or phone already exists
    const existingUser = await collection.findOne({ $or: [{ username }, { email }, { phone }] });
    if (existingUser) {
      let errorMessage;
      if (existingUser.username === username) errorMessage = 'A user with this name already exists';
      else if (existingUser.email === email) errorMessage = 'Email already registered';
      else errorMessage = 'Phone number already registered';

      res.status(400).json({ error: errorMessage });
      return;
    }

    // If no existing user, add the new user
    const { insertedId } = await collection.insertOne(newUser);
    const user = await collection.findOne({ _id: insertedId });
    delete user.password;
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to register, please try again later.' });
  }
});

// Login checking
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Both username and password must be provided' });
    return;
  }

  try {
    const collection = client.db(databaseName).collection(usersCollectionName);
    const user = await collection.findOne({ username: username });

    // Compare the hashed password with the plain password
    const validPassword = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !validPassword) {
      res.status(401).json({ error: 'Incorrect username or password' });
    } else {
      // If user is successfully authenticated, update 'active' field to true in database
      await collection.updateOne(
         {username: username },
         { $set: { active: true }}
      );
      // Then fetch the updated user document
      const updatedUser = await collection.findOne({ username: username });
      // Do not send the hashed password back
      delete updatedUser.password;
      res.json(updatedUser);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

// Log out
app.post('/api/logout/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const collection = client.db(databaseName).collection(usersCollectionName);
    // Set the 'active' field to false in database
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { active: false } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log out user' });
  }
});



// Manage user's info
app.put('/api/users/info/:id', async (req, res) => {
  const { id } = req.params;
  const {
    password: newPassword,
    email: newEmail,
    phone: newPhone
  } = req.body;

  try {
    const collection = client.db(databaseName).collection(usersCollectionName);
    const filter = { _id: new ObjectId(id) };

    const update = {
      $set: {
        ...(newPassword && { password: newPassword }),
        ...(newEmail && { email: newEmail }),
        ...(newPhone && { phone: newPhone })
      }
    };

    const options = { returnDocument: 'after' };
    const result = await collection.findOneAndUpdate(filter, update, options);

    const user = result.value;

    // If the user is not found, send a 404 response.
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user\'s info' });
  }
});


// Manage user's purchase history
app.put('/api/users/history/:id', async (req, res) => {
  const { id } =  req.params;
  const { bought: updatedBought } = req.body;
  try {
    const collection = client.db(databaseName).collection(usersCollectionName);
    const filter = { _id: new ObjectId(id) };
    const update = {
      $push: {
        bought: {
          $each: updatedBought
        }
      }
    };
    const options = { returnDocument: 'after' };
    const result = await collection.findOneAndUpdate(filter, update, options);
    const user = result.value;
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user\'s purchase history' });
  }
});

// Search API
app.get('/api/admin/search', async (req, res) => {
  let searchField = req.query.field;
  let searchValue = req.query.value;
  let searchCategory = req.query.category;
  let query = {};
  if (searchField === 'id') {
    query['_id'] = new ObjectId(searchValue);
  } else {
    query[searchField] = searchValue;
  }

  try {
    let targetCollection;
    if (searchCategory === 'user') {
      targetCollection = usersCollectionName;
    } else {
      targetCollection = productsCollectionName;
    }
    const collection = client.db(databaseName).collection(targetCollection);
    const target = await collection.find(query).toArray();
    if (target.password) {
      delete target.password;
    }
    res.status(200).json(target);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch target info.'});
  }
});

app.listen(8000, () => {
  console.log('Server started on port 8000');
});
