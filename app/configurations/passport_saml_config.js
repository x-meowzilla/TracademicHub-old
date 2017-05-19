module.exports = {

    // URL that goes from the Service Provider -> Identity Provider
    entryPoint: 'https://idp.utorauth.utoronto.ca/idp/profile/SAML2/Redirect/SSO',
    // URL that goes from the Identity Provider -> Service Provider
    callbackURL: '',
    // Usually specified as `/shibboleth` from site root
    issuer: '',
    // Service Provider private key
    decryptionPvk: '',
    // Service Provider Certificate
    privateCert: '',
    // Identity Provider's public key
    cert: '',
    identifierFormat: null,
    validateInResponseTo: false,
    disableRequestedAuthnContext: true,
    acceptedClockSkewMs: 5000

};
