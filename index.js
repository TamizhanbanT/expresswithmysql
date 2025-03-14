const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hornet@sql#123',  
    database: 'ta_maths'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

// Get all students (READ)
app.get('/', (req, res) => {
    const query = 'SELECT * FROM students';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

//post a new student

// Add a new student (CREATE)
app.post('/', (req, res) => {
    const { studId,studName,parentName,parentPhone,studClass } = req.body;
    const query = 'INSERT INTO students (studId,studName,parentName,parentPhone,studClass) VALUES (?, ?, ?,?,?)';
    db.query(query, [studId,studName,parentName,parentPhone,studClass], (err, result) => {
        if (err) {
            console.error('Error adding student:', err);
            res.status(500).json({ message: 'Failed to add student' });
            return;
        }
        res.status(201).json({ message: 'Student added successfully'});
    });
});


//updating students
// Update a student (UPDATE)

app.put('/:studId', (req, res) => {
    const { studId } = req.params;
    const { studName, parentName, parentPhone, studClass } = req.body;
    const query = 'UPDATE students SET studName = ?, parentName = ?, parentPhone = ?, studClass = ? WHERE studId = ?';
    db.query(query, [studName, parentName, parentPhone, studClass, studId], (err, result) => {
        if (err) {
            console.error('Error updating student:', err);
            res.status(500).json({ message: 'Failed to update student' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.json({ message: 'Student updated successfully' });
    });
});



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



