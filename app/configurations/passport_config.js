var fs = require('fs');

module.exports = {

    SPCert: 'app/certificates/saml-verify.crt', // SP certificate
    SPKey: 'app/certificates/saml-decrypt.pem', // SP private key
    samlData: {
        // URL that goes from the Service Provider -> Identity Provider
        entryPoint: "https://idp.utorauth.utoronto.ca/idp/profile/SAML2/Redirect/SSO",
        // URL that goes from the Identity Provider -> Service Provider
        // callbackUrl: 'https://localhost:3000/', // possibly not needed as we already set in shibboleth API
        // Usually specified as `/shibboleth` from site root. Note: this must be identical with entity ID in shibboleth server configuration
        issuer: 'https://tracademic.utsc.utoronto.ca/shibboleth',
        identifierFormat: null,
        // Service Provider Certificate
	disableRequestedAuthnContext: true,
        acceptedClockSkewMs: 5000,
	decryptionPvk: "saml-decrypt.pem", //The private key used to decrypt SAML responses.
	cert: "saml-verify.crt"//The certificate used to verify SAML responses. Omitting this will allow user spoofing!
	// Service Provider private key
        // Identity Provider's public key
        // cert: fs.readFileSync(serverConfig.idPCert, 'utf8'),
        //validateInResponseTo: false,
        //disableRequestedAuthnContext: true,
        //acceptedClockSkewMs: 5000
    }

};
