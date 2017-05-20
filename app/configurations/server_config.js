module.exports = {

    env: 'development',
    port: this.env === 'production' ? 443 : 3000,
    httpsCert: './certificates/cert.pem',
    httpsKey: './certificates/key.pem',
    session: {
        key: 'tracademichub.sess', //what the name that the session cookie is stored as
        secret: 'SomeSecret',
        // secret: 'wqcVwJ6rNgrpEpZBppGt', //DO NOT LEAK - change this!!
        timeout: 2 * 60 * 60 * 1000 // 2 hours timeout
    }

};
