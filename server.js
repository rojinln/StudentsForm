const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const port = 8080;

app.set('view engine' , 'ejs');

app.use(express.static(path.resolve(__dirname, 'public')));

app.use( bodyParser.json() );      
    app.use(bodyParser.urlencoded({    
        extended: true
    })
)

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

app.get("/", (req, res) => {
    let tableRows = '';
    students.forEach(student => {
        tableRows += `
            <tr>
                <td>${student.ID}</td>
                <td>${student.name}</td>
                <td>${student.lastName}</td>
                <td>${student.birthday}</td>
                <td>${student.major}</td>
                <td>${student.uni}</td>
                <td><button>Edit</button><button>Delete</button></td>
            </tr>
        `;
    });

    const htmlContent = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    const modifiedHtml = htmlContent.replace('<!-- table rows -->', tableRows);
    res.send(modifiedHtml);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
