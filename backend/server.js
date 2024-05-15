const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));
console.log(__dirname);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

class studentInfo {
    constructor() {
        this.ID = 0;
        this.name = '';
        this.lastName = '';
        this.birthday = Date;
        this.major = '';
        this.uni = '';
    }
}

let students = [
    { name: "Bahar", lastName: "Khouban", ID: 32912023, birthday: "2000-08-19", major: "CS", uni: "Behesthi" },
    { name: "Rojin", lastName: "LN", ID: 2931, birthday: "1380-08-13", major: "CS", uni: "Behesthi" }
];

function sendStudents(res) {
    res.render('index.html', { students: students });
}

app.get("/", (req, res) => {
    const html = fs.readFileSync(path.join(__dirname, 'frontend', 'index.html'), 'utf8');
    res.send(html);
});

app.post("/delete", (req, res) => {
    const index = parseInt(req.body.index);
    students.splice(index, 1);
    sendStudents(res);
});

/* error : cannot POST /edit 
app.post("/edit", (req, res) => {
    const index = parseInt(req.body.index);

    if (index >= 0 && index < students.length) {
        const student = students[index];
        res.json(student); 
        res.send(student , index)
    } else {
        // no console.
        console.error("Invalid student index received in edit request");
    }
  });
  */

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
    sendStudents(res);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
