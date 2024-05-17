const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend')); 

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../frontend')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

class studentInfo {
    constructor() {
        this.ID = 0;
        this.name = '';
        this.lastName = '';
        this.birthday = '';
        this.major = '';
        this.uni = '';
    }
}

let students = [
    { name: "Bahar", lastName: "Khouban", ID: 32912023, birthday: "2000-08-19", major: "CS", uni: "Behesthi" },
    { name: "Rojin", lastName: "LN", ID: 2931, birthday: "1380-08-13", major: "CS", uni: "Behesthi" }
];

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.get("/students", (req, res) => {
    res.json(students);
});

app.post("/delete", (req, res) => {
    const index = parseInt(req.body.index);
    students.splice(index, 1);
    res.json({ status: "success" });
});

app.post("/edit", (req, res) => {
    const index = parseInt(req.body.index);
    const student = students[index];
    student.ID = parseInt(req.body.ID);
    student.name = req.body.name;
    student.lastName = req.body.lastName;
    student.birthday = req.body.bdayInput;
    student.major = req.body.majorInput;
    student.uni = req.body.uniInput;

    res.status(200).json({ status: "success", student }); 
});

app.post("/", (req, res) => {
    let input = req.body;
    let newStudent = new studentInfo();
    newStudent.ID = parseInt(input.ID);
    newStudent.name = input.name;
    newStudent.lastName = input.lastName;
    newStudent.birthday = input.bdayInput;
    newStudent.major = input.majorInput;
    newStudent.uni = input.uniInput;
    students.push(newStudent);
    res.json({ status: "success" });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
