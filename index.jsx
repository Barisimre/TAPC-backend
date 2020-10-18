const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const app = express();
const config = require('./config')
const makeEmail = require('./generateEmail')
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/register', (req, res) => {

    if (!validate(req)) {
        // TODO: be mad
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