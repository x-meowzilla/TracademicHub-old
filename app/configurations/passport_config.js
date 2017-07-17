var fs = require('fs');

module.exports = {

    SPCert: 'app/certificates/sp-cert.pem', // SP certificate
    SPKey: 'app/certificates/sp-key.pem', // SP private key
    samlData: {
        // URL that goes from the Service Provider -> Identity Provider
        entryPoint: 'https://idp.utorauth.utoronto.ca/idp/profile/SAML2/Redirect/SSO',
        // URL that goes from the Identity Provider -> Service Provider
        callbackUrl: 'https://localhost:3000/',
        // Usually specified as `/shibboleth` from site root. Note: this must be identical with entity ID in shibboleth server configuration
        issuer: 'https://sp.tracademic.utsc.utoronto.ca/shibboleth',
        // Service Provider Certificate
        privateCert: fs.readFileSync(this.SPCert, 'utf8'),
        // Service Provider private key
        decryptionPvk: fs.readFileSync(this.SPKey, 'utf8'),
        // Identity Provider's public key
        // cert: fs.readFileSync(serverConfig.idPCert, 'utf8'),
        identifierFormat: null,
        validateInResponseTo: false,
        disableRequestedAuthnContext: true,
        acceptedClockSkewMs: 5000
    }

};
