const express = require('express'); // import express module
const app = express(); // instance of express
const port = 5001; // port number; using 5001 instead of 5000 due to mac

app.use(express.json()); // will process data as JSON

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});      