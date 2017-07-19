module.exports = {

    port: process.env.PORT || 8000,
//    httpsCert: 'app/certificates/cert.pem', // SP certificate
//    httpsKey: 'app/certificates/key.pem', // SP private key
    httpsCert: "/etc/ssl/certs/tracademic.crt",
    httpsKey: "/etc/ssl/private/tracademic.key",
    httpsCa: "/etc/ssl/certs/tracademic.ca-bundle",

    // idPCert: 'certificates/idp_cert.pem', // IdP public key
    session: {
//        key: 'tracademichub.sess', //what the name that the session cookie is stored as
        key: 'points.sess', //what the name that the session cookie is stored as
        secret: 'wqcVwJ6rNgrpEpZBppGt', //DO NOT LEAK
        timeout: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours timeout
    }

};
