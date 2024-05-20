const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const {Client} = require('pg');

const app = express();
const port = 8080;

const client = new Client({
    host: 'localhost',    
    user: "postgres",
    port: 5432,
    password:`12345678`,
    database:'postgres'
  });

client.connect();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend'));

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../frontend')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

async function insertStudent({ name, lastname, id, birthday, major, uni }) {
    try {
        const result = await client.query(`
            insert into students
            (name, lastname, id, birthday, major, uni)
            values
            ($1, $2, $3, $4, $5, $6)
            returning name, lastname, id, birthday, major, uni
        `, [name, lastname, id, birthday, major, uni]);
       return result.rows[0];
    } catch (error) {
        console.error('Error inserting student:', error);
        throw error;
    }
}

async function getStudents() {
    try {
        const result = await client.query('select * from students');
        return result.rows;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.get("/students", async (req, res) => {
    const students = await getStudents();
    res.json(students);
});


async function deleteStudent({ name }) {
    try {
        const result = await client.query(`
            DELETE FROM students WHERE name = $1`, [name]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
}

app.post("/delete", async (req, res) => {
    try {
        await deleteStudent(req.body);
        res.json({ status: "success" });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ status: "error", message: "Failed to delete student" });
    }
});

async function updateStudent({ id, name, lastname, birthday, major, uni }) {
    try {
        const result = await client.query(`
            UPDATE students 
            SET name = $1, lastname = $2, birthday = $3, major = $4, uni = $5 
            WHERE id = $6
            RETURNING name, lastname, id, birthday, major, uni
        `, [name, lastname, birthday, major, uni, id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
}

app.post("/edit", async (req, res) => {
    try {
        const { id, name, lastname, birthday, major, uni } = req.body;
        await updateStudent({ id, name, lastname, birthday, major, uni });
        res.json({ status: "success" });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ status: "error", message: "Failed to update student" });
    }
});

app.post("/", async (req, res) => {
    let input = req.body;
    await insertStudent({
        name: input.name,
        lastname: input.lastname,
        id: parseInt(input.id),
        birthday: input.birthday,
        major: input.major,
        uni: input.uni
    });
    res.json({ status: "success" });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
