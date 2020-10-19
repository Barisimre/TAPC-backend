const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const sqlite3 = require('sqlite3');
const app = express();
const config = require('./config')
const makeEmail = require('./generateEmail')
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

app.post('/register', (req, res) => {

    if (!validate(req)) {
        // TODO: be mad
    }

    // Add participants into database
    // First store users into an array to later insert it into the database
    persons = [];
    if (req.body.email1 !== "") {
        persons.push([req.body.name1, req.body.email1, req.body.number1]);
    }
    if (req.body.email2 !== "") {
        persons.push([req.body.name2, req.body.email2, req.body.number2]);
    }
    if (req.body.email3 !== "") {
        persons.push([req.body.name3, req.body.email3, req.body.number3]);
    }
    // Insert data into database, query based on amount of participants in the team
    if (persons.length == 1) {
        db.run("INSERT INTO ParticipantEntries(Name1, Mail1, Number1) VALUES(?,?,?)", [persons[0][0], persons[0][1], persons[0][2]]);
    } else if (persons.length == 2) {
        db.run("INSERT INTO ParticipantEntries(Name1, Mail1, Number1, Name2, Mail2, Number2) VALUES(?,?,?, ?,?,?)", [persons[0][0], persons[0][1], persons[0][2], persons[1][0], persons[1][1], persons[1][2]]);
    } else if (persons.length == 3) {
      db.run("INSERT INTO ParticipantEntries(Name1, Mail1, Number1, Name2, Mail2, Number2, Name3, Mail3, Number3) VALUES(?,?,?, ?,?,?, ?,?,?)", [persons[0][0], persons[0][1], persons[0][2], persons[1][0], persons[1][1], persons[1][2], persons[2][0], persons[2][1], persons[2][2]]);
    }

    const tos = [];

    if (req.body.email1 !== "") {
        tos.push(req.body.email1);
    }
    if (req.body.email2 !== "") {
        tos.push(req.body.email2);
    }
    if (req.body.email3 !== "") {
        tos.push(req.body.email3);
    }

    const transporter = nodeMailer.createTransport({
        host: 'smtp.utwente.nl',
        port: 25,
    });
    console.log(req.body.email1)

    const mailOptions = {
        from: 'ICTSV Inter-Actief <tkp@inter-actief.net>',
        to: tos,
        subject: `TAPC participation team: ${req.body.team}`,
        html: makeEmail(req.body.team, [[req.body.name1, req.body.number1, req.body.email1],
            [req.body.name2, req.body.number2, req.body.email2],
            [req.body.name2, req.body.number2, req.body.email2]], req.body.official)
    };

    console.log([[req.body.name1, req.body.number1, req.body.email1],
        [req.body.name2, req.body.number2, req.body.email2],
        [req.body.name2, req.body.number2, req.body.email2]])
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
});











app.listen(config.port, () => {
    console.log(`Listening at http://localhost:${config.port}`)
})

function validate(req) {
    return true;
}
