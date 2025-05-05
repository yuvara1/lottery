const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Use promise-based API
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 3000;

// Create a MySQL connection pool
const db = mysql.createPool({
     host: 'bmrhdw79ikmzwlbdhchj-mysql.services.clever-cloud.com',
     user: 'ubftpmlqlklihtf6',
     password: 'Kt8UlGfV8vqkrchH7wRO',
     port: 3306,
     database: 'bmrhdw79ikmzwlbdhchj',
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0
});

const app = express();

// Enable middleware
app.use(cors());
app.use(express.json());

// Check database connection
(async () => {
     try {
          const connection = await db.getConnection();
          console.log('Database connected successfully');
          connection.release();
     } catch (err) {
          console.error('Database connection failed:', err);
     }
})();

// POST endpoint to insert data
app.post('/values', async (req, res) => {
     const { id, draw_no, first, second, third } = req.body;
     let connection;
     try {
          connection = await db.getConnection();
          const query = 'INSERT INTO results (id, draw_no, first, second, third) VALUES (?, ?, ?, ?, ?)';
          const values = [id, draw_no, first, second, third];
          await connection.query(query, values);
          res.status(201).json({ message: 'Data inserted successfully' });
     } catch (error) {
          console.error('Error inserting data:', error);
          res.status(500).json({ error: 'Failed to insert data' });
     } finally {
          if (connection) connection.release();
     }
});

// GET endpoint to fetch data
app.get('/data', async (req, res) => {
     let connection;
     try {
          connection = await db.getConnection();
          const query = 'SELECT * FROM results;';
          const [rows] = await connection.query(query);
          console.log('Fetched data:', rows); // Debugging log
          res.status(200).json(rows);
     } catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).json({ error: 'Failed to fetch data' });
     } finally {
          if (connection) connection.release();
     }
});

// POST endpoint for admin login
app.post('/login', async (req, res) => {
     const { username, password } = req.body;
     if (username === 'admin' && password === 'admin123') {
          res.status(200).json({ success: true });
     } else {
          res.status(401).json({ success: false, message: 'Invalid credentials' });
     }
});

// PUT endpoint to update data
app.put('/data/:id', async (req, res) => {
     console.log('Received PUT request:', req.body); // Debugging log
     console.log('Received ID:', req.params.id); // Debugging log
     const { id } = req.params;
     const { draw_no, first, second, third } = req.body;
     let connection;
     try {
          connection = await db.getConnection();
          const query = 'UPDATE results SET draw_no = ?,  first_prize = ?, second_prize = ?, third_prize = ? WHERE id = ?';
          const values = [draw_no, first, second, third, id];
          await connection.query(query, values);
          res.status(200).json({ message: 'Data updated successfully' });
     } catch (error) {
          console.error('Error updating data:', error);
          res.status(500).json({ error: 'Failed to update data' });
     } finally {
          if (connection) connection.release();
     }
});

// DELETE endpoint to delete data
app.delete('/data/:id', async (req, res) => {
     const { id } = req.params;
     let connection;
     try {
          connection = await db.getConnection();
          const query = 'DELETE FROM results WHERE id = ?';
          const values = [id];
          await connection.query(query, values);
          res.status(200).json({ message: 'Data deleted successfully' });
     } catch (error) {
          console.error('Error deleting data:', error);
          res.status(500).json({ error: 'Failed to delete data' });
     } finally {
          if (connection) connection.release();
     }
});

// Start the server
app.listen(port, () => {
     console.log(`Server is running on http://localhost:${port}`);
});
