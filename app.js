const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

let tasks = [];
let users = [];

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    users.push({ username, password });
    res.status(200).json({ message: 'User created successfully' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }
    res.status(200).json({ message: 'Logged in successfully' });
});

app.post('/tasks', (req, res) => {
    const { title, description, dueDate, category, priority, username } = req.body;
    tasks.push({ title, description, dueDate, category, priority, username, status: 'incomplete' });
    res.status(200).json({ message: 'Task created successfully' });
});

app.put('/tasks/:title', (req, res) => {
    const { title } = req.params;
    const { status } = req.body;
    const task = tasks.find(task => task.title === title);
    if (!task) {
        return res.status(400).json({ message: 'Task not found' });
    }
    task.status = status;
    res.status(200).json({ message: 'Task updated successfully' });
});

app.get('/tasks', (req, res) => {
    const { username, sortBy } = req.query;
    let userTasks = tasks.filter(task => task.username === username);
    if (sortBy === 'dueDate') {
        userTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === 'category') {
        userTasks.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === 'status') {
        userTasks.sort((a, b) => a.status.localeCompare(b.status));
    }
    res.status(200).json(userTasks);
});

app.listen(3000, () => console.log('Server is running on port 3000'));