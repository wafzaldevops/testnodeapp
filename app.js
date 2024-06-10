const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
require('dotenv').config();
const host = process.env.HOST
const user = process.env.USER
const password = process.env.PASSWORD
const database = process.env.DATABASE

const { getHomePage } = require('./routes/index');
const { addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage } = require('./routes/player');
const port = 5000;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

// connect to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
    console.log('Connected to MySQL database');

    db.query('CREATE DATABASE IF NOT EXISTS socka', (err, result) => {
        if (err) {
            console.error('Error creating database:', err);
            throw err;
        }
        console.log('Database created or already exists');

        // Use the database
        db.query('USE socka', (err, result) => {
            if (err) {
                console.error('Error using database:', err);
                throw err;
            }

            // Create players table
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS players (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    first_name VARCHAR(255) NOT NULL,
                    last_name VARCHAR(255) NOT NULL,
                    position VARCHAR(255) NOT NULL,
                    number INT NOT NULL,
                    image VARCHAR(255) NOT NULL,
                    user_name VARCHAR(255) NOT NULL UNIQUE
                )
            `;
            db.query(createTableQuery, (err, result) => {
                if (err) {
                    console.error('Error creating table:', err);
                    throw err;
                }
                console.log('Table created or already exists');

                // Check if initial data is present
                const checkDataQuery = 'SELECT COUNT(*) AS count FROM players';
                db.query(checkDataQuery, (err, result) => {
                    if (err) {
                        console.error('Error checking data:', err);
                        throw err;
                    }
                    if (result[0].count === 0) {
                        // Insert initial data
                        const insertDataQuery = `
                            INSERT INTO players (first_name, last_name, position, number, image, user_name) VALUES 
                            ('John', 'Doe', 'Midfielder', 10, 'john_doe.png', 'johndoe'),
                            ('Jane', 'Smith', 'Goalkeeper', 1, 'jane_smith.png', 'janesmith')
                        `;
                        db.query(insertDataQuery, (err, result) => {
                            if (err) {
                                console.error('Error inserting initial data:', err);
                                throw err;
                            }
                            console.log('Initial data inserted');
                        });
                    } else {
                        console.log('Initial data already present, skipping insertion');
                    }
                });
            });
        });
    });
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

app.get('/', getHomePage);
app.get('/add', addPlayerPage);
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);
app.post('/add', addPlayer);
app.post('/edit/:id', editPlayer);


// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
