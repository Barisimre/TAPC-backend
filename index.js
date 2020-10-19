const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const mysql = require('mysql');
const app = express();
const config = require('./config')
const makeEmail = require('./generateEmail')
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

let con = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
});

app.post('/register', (req, res) => {
    let errs = [];

    // Add participants into database
    // First store users into an array to later insert it into the database
    persons = [];
    if (req.body.name1 !== "") {
        persons.push([req.body.name1, req.body.email1, req.body.number1]);
    }
    if (req.body.name2 !== "") {
        persons.push([req.body.name2, req.body.email2, req.body.number2]);
    }
    if (req.body.name3 !== "") {
        persons.push([req.body.name3, req.body.email3, req.body.number3]);
    }

    // Check if data is there. TODO: make better
    if (!validate(persons, req.body.team)) {
        console.log('Not valid')
        res.send('Not valid')
        return
    }

    // Email targets
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
        host: config.email.host,
        port: config.email.port,
    });

    const mailOptions = {
        from: config.email.from,
        to: tos,
        subject: `TAPC participation team: ${req.body.team}`,
        html: makeEmail(req.body.team, [[req.body.name1, req.body.number1, req.body.email1],
        [req.body.name2, req.body.number2, req.body.email2],
        [req.body.name2, req.body.number2, req.body.email2]], req.body.official)
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            errs.push('Email error')
        } else {
            console.log('Mail send')
        }
    });

    // Add people and the team to the database
    con.connect(function (err) {
        if (err) {
            errs.push('database connection error')
            console.log(err)
        }
        for (person of persons) {
            var sql = `INSERT INTO participants_2020 (name, email, snumber) VALUES ('${person[0]}', '${person[1]}', '${person[2]}')`;
            con.query(sql, function (err, result) {
                if (err) {
                    if (err.fatal) {
                        console.log('Fatal error')
                        res.send('Not valid')
                        return
                    }
                    errs.push('database insert error')
                    console.log(err)
                }
                console.log("1 record inserted");
            });
        }
        var sql = `INSERT INTO teams_2020 (name, official_team) VALUES ('${req.body.team}', '${req.body.official ? 1 : 0}')`;
        con.query(sql, function (err, result) {
            if (err) {
                if (err.fatal) {
                    console.log('Fatal error')
                    res.send('Not valid')
                    return
                }
                errs.push('database insert error')
                console.log(err)
            }
            console.log("1 record inserted");
        });

    });
    res.send('good')
});


app.listen(config.port, () => {
    console.log(`Listening at port: ${config.port}`)
})

function validate(persons, t) {
    if (t.length === 0) {
        return false;
    }
    if (persons.length === 0) {
        return false;
    }
    for (person of persons) {
        if (person[1] === "" || person[2] === "") {
            return false;
        }
    }
    return true;
}
