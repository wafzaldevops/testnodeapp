const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 80;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  } else {
    console.log('Connected to the MySQL server');
    db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
      if (err) throw err;
      console.log(`Database ${process.env.DB_NAME} created or already exists`);
      db.query(`USE ${process.env.DB_NAME}`, (err) => {
        if (err) throw err;
        console.log(`Connected to the MySQL database`);
        db.query(`CREATE TABLE IF NOT EXISTS dummy_table (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))`, (err) => {
          if (err) throw err;
          console.log('Table created or already exists');
        });
      });
    });
  }
});

// Route to fetch and display email column values
app.get('/emails', (req, res) => {
  const query = 'SELECT email FROM users';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL:', err);
      res.status(500).send('Error fetching data');
      return;
    }

    // Display the email values
    const emails = results.map(row => row.email);
    res.send(emails);
  });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const gracefulShutdown = () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    db.end(() => {
      console.log('MySQL connection closed');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
