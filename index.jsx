const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/register', (req, res) => {

    if (!validate(req)) {
        // TODO: be mad
    }

    const msgBody = (
        <html>
            <header>
                <h1>Registration for TAPC 2020</h1>
                <h3>Team {req.body.team}</h3>
            </header>
            <body>
                <p>Welcome to TAPC 2020, you are now registered with the team name {req.body.team}.</p>

            </body>
        </html>
    );

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
        text: req.body.name1
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });

});











app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

function validate(req) {
    return true;
}