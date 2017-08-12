module.exports = {

    port: process.env.PORT || 8000,

    httpsCert: 'app/certificates/cert.pem',             // dev use
    httpsKey: 'app/certificates/key.pem',               // dev use
    // httpsCert: '/etc/ssl/certs/tracademic.crt',
    // httpsKey: '/etc/ssl/private/tracademic.key',
    // httpsCa: '/etc/ssl/certs/tracademic.ca-bundle',

    session: {
        key: 'tracademichub.sess', // what the name that the session cookie is stored as
        secret: 'mwx2NOvSeJ4MJEyGfs5d', // DO NOT LEAK
        duration: 2 * 60 * 60 * 1000 // 2 hours timeout
        // timeout: new Date(Date.now() + 1 * 3 * 60 * 1000) // 2 hours timeout
    }

};
