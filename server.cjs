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
     connectionLimit: 3, // reduced from 10
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
     const { draw_no, first, second, third, draw_date } = req.body;
     try {
          const query = 'INSERT INTO results (draw_no, first_prize, second_prize, third_prize, draw_date) VALUES (?, ?, ?, ?, ?)';
          const values = [draw_no, first, second, third, draw_date];
          await db.query(query, values);
          res.status(201).json({ message: 'Data inserted successfully' });
     } catch (error) {
          console.error('Error inserting data:', error);
          res.status(500).json({ error: 'Failed to insert data' });
     }
});

// GET endpoint to fetch data
app.get('/data', async (req, res) => {
     try {
          const query = 'SELECT * FROM results ORDER BY draw_date DESC, draw_no DESC;';
          const [rows] = await db.query(query);
          res.status(200).json(rows);
     } catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).json({ error: 'Failed to fetch data' });
     }
});

app.get("/getall", async (req, res) => {
     try {
          const query = 'SELECT * FROM results ORDER BY draw_date DESC';
          const [rows] = await db.query(query);
          res.status(200).json(rows);
     } catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).json({ error: 'Failed to fetch data' });
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
app.get("/delete",async (req,res)=>{
     try{
          const query = "truncate table results;"
          await db.query(query)
          res.status(200).send({mes:'sucess'})
     }
     catch(e){
          console.log(e)
          res.status(500).send({mes:'err'})
     }
})
app.get("/ta",async (req,res)=>{
     try{
          const query = "ALTER TABLE results MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT;"
          await db.query(query);
          res.send({message:"success"})
     }
     catch(e){
          console.error('Error updating data:', e);
          res.status(500).json({ error: 'Failed to update data' });
     }
})

// PUT endpoint to update data
app.put('/data/:id', async (req, res) => {
     const { id } = req.params;
     const { draw_no, first, second, third, draw_date } = req.body;
     try {
          const query = 'UPDATE results SET draw_no = ?, first_prize = ?, second_prize = ?, third_prize = ?, draw_date = ? WHERE id = ?';
          const values = [draw_no, first, second, third, draw_date, id];
          await db.query(query, values);
          res.status(200).json({ message: 'Data updated successfully' });
     } catch (error) {
          console.error('Error updating data:', error);
          res.status(500).json({ error: 'Failed to update data' });
     }
});

// DELETE endpoint to delete data
app.delete('/data/:id', async (req, res) => {
     const { id } = req.params;
     try {
          const query = 'DELETE FROM results WHERE id = ?';
          await db.query(query, [id]);
          res.status(200).json({ message: 'Data deleted successfully' });
     } catch (error) {
          console.error('Error deleting data:', error);
          res.status(500).json({ error: 'Failed to delete data' });
     }
});

// GET endpoint to fetch data by draw
app.get('/data/by-draw', async (req, res) => {
    const { draw_date, draw_no } = req.query;
    try {
        const query = 'SELECT * FROM results WHERE draw_date = ? AND draw_no = ? LIMIT 1';
        const [rows] = await db.query(query, [draw_date, draw_no]);
        res.status(200).json(rows[0] || null);
    } catch (error) {
        console.error('Error fetching draw:', error);
        res.status(500).json({ error: 'Failed to fetch draw' });
    }
});

// Start the server
app.listen(port, () => {
     console.log(`Server is running on http://localhost:${port}`);  console.log(`Server is running on http://localhost:${port}`);

});
