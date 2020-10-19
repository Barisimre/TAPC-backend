const config = {};

config.port = 5000;

// Database

config.database = {
    host: "mysql.ia.utwente.nl",
    user: "tkp2011",
    password: "R2U5rnVmLSNq9NW8",
    database: "tkp2011"
}

// Email

config.email = {
    host: 'smtp.utwente.nl',
    port: 25,
    from: 'ICTSV Inter-Actief <tkp@inter-actief.net>'
}



module.exports = config;