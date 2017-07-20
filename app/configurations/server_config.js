module.exports = {

    production: {
        port: process.env.PORT || 8000,
        httpsCert: '/etc/ssl/certs/tracademic.crt',
        httpsKey: '/etc/ssl/private/tracademic.key',
        httpsCa: '/etc/ssl/certs/tracademic.ca-bundle',
        session: {
            key: 'tracademichub.sess', // what the name that the session cookie is stored as
            secret: 'mwx2NOvSeJ4MJEyGfs5d', // DO NOT LEAK
            timeout: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours timeout
        }
    },

    development: {
        port: process.env.PORT || 8000,
        httpsCert: 'app/certificates/cert.pem',
        httpsKey: 'app/certificates/key.pem',
        session: {
            key: 'tracademichub.sess', // what the name that the session cookie is stored as
            secret: 'mwx2NOvSeJ4MJEyGfs5d', // DO NOT LEAK
            timeout: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours timeout
        }
    }

};
