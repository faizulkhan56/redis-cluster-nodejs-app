const express = require('express');
const Redis = require('ioredis');

const app = express();
const port = 3000;

// Redis Cluster configuration
const cluster = new Redis.Cluster([
{ host: '10.0.2.11', port: 6379 },
{ host: '10.0.2.166', port: 6379 },
{ host: '10.0.2.85', port: 6379 },
{ host: '10.0.3.18', port: 6379 },
{ host: '10.0.3.141', port: 6379 },
{ host: '10.0.3.231', port: 6379 }
]);

app.use(express.json());

// Root route to confirm server is running
app.get('/', (req, res) => {
res.send('Node.js server is running!');
});

app.post('/set', async (req, res) => {
const { key, value } = req.body;
try {
    await cluster.set(key, value);
    res.json({ message: 'Value set successfully' });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

app.get('/get/:key', async (req, res) => {
const { key } = req.params;
try {
    const value = await cluster.get(key);
    if (value === null) {
    res.status(404).json({ message: 'Key not found' });
    } else {
    res.json({ [key]: value });
    }
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

app.listen(port, () => {
console.log(`Server running on http://localhost:${port}`);
});

