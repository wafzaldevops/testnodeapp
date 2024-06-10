const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const db = require('./db');

app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).send('Database query failed');
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
