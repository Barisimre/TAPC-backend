function makeEmail(team, users, official) {
    let email = '';
    const o = '<body>'
    const c = '</body>'
    const d = '<div>'
    const cd = '</div>'

    const h2 = '<h2> Thank you for registering to TAPC 2020</h2>'
    const t = `<h3> You are registered as ${team}, and your official team status is: ${official}</h3>`
    const rp = '<h4> You have registered with the following participants</h4>'
    email = o + h2 + t + rp;

    for (user of users) {
        if (user[0] !== "") {
            email += d + `<p> name: ${user[0]} student number: ${user[1]} email: ${user[2]}</p>` + cd
        }
    }
    email += '<p>For more information about the event please check the updates at https://tapc.ia.utwente.nl/</p>'
    email += '<p>We hope you have a great experience</p>'
    email += c
    return email;
}

module.exports = makeEmail