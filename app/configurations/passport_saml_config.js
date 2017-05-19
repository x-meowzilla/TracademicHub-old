var fs = require('fs');

module.exports = {

    saml_data: {
        // URL that goes from the Service Provider -> Identity Provider
        entryPoint: 'https://idp.utorauth.utoronto.ca/idp/profile/SAML2/Redirect/SSO',
        // URL that goes from the Identity Provider -> Service Provider
        callbackUrl: '',
        // Usually specified as `/shibboleth` from site root
        issuer: '',
        // Service Provider private key
        decryptionPvk: fs.readFileSync('', 'utf8'),
        // Service Provider Certificate
        privateCert: fs.readFileSync('', 'utf8'),
        // Identity Provider's public key
        cert: fs.readFileSync('', 'utf8'),
        identifierFormat: null,
        validateInResponseTo: false,
        disableRequestedAuthnContext: true,
        acceptedClockSkewMs: 5000
    }

};
