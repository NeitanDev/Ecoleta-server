import express, { json } from 'express';

const app = express();

app.use(express.json());

app.get('/users', (req, res) => {
    res.json({ Hello: "Word" });
});

app.listen(3333);