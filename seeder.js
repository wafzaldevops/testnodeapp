const mysql = require('mysql2');

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
    seedData();
  }
});

const seedData = () => {
  // Define your seed data and SQL queries here
  const users = [
    { email: 'user1@example.com' },
    { email: 'user2@example.com' },
    // Add more users as needed
  ];

  // Example SQL query to insert users
  const insertQuery = `
    INSERT INTO users (email)
    VALUES ?
    ON DUPLICATE KEY UPDATE email = VALUES(email)
  `;

  db.query(insertQuery, [users.map(user => [user.email])], (err, result) => {
    if (err) {
      console.error('Error seeding data:', err);
    } else {
      console.log('Seed data inserted successfully');
    }
    db.end();
  });
};
