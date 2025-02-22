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
    const tasksCollection = database.collection('tasks');

    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const query = { email: newUser.email };

      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'User already exists' });
      }

      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // **Task Routes**
    app.post('/tasks', async (req, res) => {
      const newTask = { 
        ...req.body, 
        status: "Incomplete", // ✅ Default status
        important: false, 
        createdAt: new Date()
      };
    
      const result = await tasksCollection.insertOne(newTask);
      res.send(result);
    });
    

    app.get('/tasks', async (req, res) => {
      const result = await tasksCollection.find().toArray();
      res.send(result);
    });

    app.get('/tasks/pending', async (req, res) => {
      const result = await tasksCollection.find({ status: 'pending' }).toArray();
      res.send(result);
    });

    app.get('/tasks/completed', async (req, res) => {
      const result = await tasksCollection.find({ status: 'completed' }).toArray();
      res.send(result);
    });

    app.get('/tasks/important', async (req, res) => {
      const result = await tasksCollection.find({ important: true }).toArray();
      res.send(result);
    });

    app.put('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const updatedTask = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid task ID' });
      }

      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: updatedTask };
      const result = await tasksCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid task ID' });
      }

      const filter = { _id: new ObjectId(id) };
      const result = await tasksCollection.deleteOne(filter);
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
