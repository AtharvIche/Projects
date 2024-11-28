const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'expenses_db',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error: ' + err);
    return;
  }
  console.log('Connected to the database');
});

// Set up EJS for templating
app.set('view engine', 'ejs');

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (CSS, JS, etc.)
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
  // Display the frontend for adding expenses
  res.render('index');
});

app.post('/addExpense', (req, res) => {
  // Handle the form submission to add an expense to the database
  const { description, amount, date } = req.body;
  const query = 'INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)';
  db.query(query, [description, amount, date], (err, result) => {
    if (err) {
      console.error('Error adding expense: ' + err);
    }
    res.redirect('/expenses');
  });
});

app.get('/expenses', (req, res) => {
  // Retrieve expenses from the database and display them
  const query = 'SELECT * FROM expenses';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching expenses: ' + err);
    }
    res.render('expenses', { expenses: results });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
