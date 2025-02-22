require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w81iv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB!");

    const database = client.db('To-Do');
    const UserCollection = database.collection('Todo-user');
    const TaskCollection = database.collection('tasks');

    // Get all users
    app.get('/users', async (req, res) => {
      const result = await UserCollection.find().toArray();
      res.send(result);
    });

    // Add a new user
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const query = { email: newUser.email };

      console.log('Creating user:', newUser);

      const existingUser = await UserCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'User already exists' });
      }

      const result = await UserCollection.insertOne(newUser);
      res.send(result);
    });

    // Update user role
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const { role } = req.body;
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid user ID' });
      }

      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { role } };
      const result = await UserCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // CRUD operations for tasks

    // Create a new task
    app.post('/tasks', async (req, res) => {
      const newTask = req.body;
      const result = await TaskCollection.insertOne(newTask);
      res.send(result);
    });

    // Get all tasks
    app.get('/tasks', async (req, res) => {
      const result = await TaskCollection.find().toArray();
      res.send(result);
    });

    // Update a task
    app.put('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const updatedTask = req.body;
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid task ID' });
      }

      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: updatedTask };
      const result = await TaskCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Delete a task
    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid task ID' });
      }

      const filter = { _id: new ObjectId(id) };
      const result = await TaskCollection.deleteOne(filter);
      res.send(result);
    });

  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
}

run();

app.get('/', (req, res) => {
  res.send('✅ To-Do server is running');
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
