module.exports = {

    env: 'development',
    port: this.env === 'production' ? 443 : 3000,
    httpsCert: 'app/certificates/cert.pem', // SP certificate
    httpsKey: 'app/certificates/key.pem', // SP private key
    idPCert: 'app/certificates/idp_cert.pem', // IdP public key
    session: {
        key: 'tracademichub.sess', //what the name that the session cookie is stored as
        secret: 'SomeSecret',
        // secret: 'wqcVwJ6rNgrpEpZBppGt', //DO NOT LEAK - change this!!
        timeout: 2 * 60 * 60 * 1000 // 2 hours timeout
    }

};
