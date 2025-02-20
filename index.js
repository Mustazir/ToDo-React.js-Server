import express from 'express';
import cors from 'cors';
import AuthRoute from './Routers/auth.js';
import TodoRoute from './Routers/todo.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON request bodies

// Routes
app.use('/api/user', AuthRoute);
app.use('/api/todos', TodoRoute);

app.get("/", (req, res) => {
    res.send('Todo');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
