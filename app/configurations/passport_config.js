var fs = require('fs');

module.exports = {

    production: {
        samlData: {
            // URL that goes from the Service Provider -> Identity Provider
            entryPoint: "https://idp.utorauth.utoronto.ca/idp/profile/SAML2/Redirect/SSO",
            // URL that goes from the Identity Provider -> Service Provider
            // callbackUrl: 'https://localhost:3000/', // possibly not needed as we already set in shibboleth API
            // Usually specified as `/shibboleth` from site root. Note: this must be identical with entity ID in shibboleth server configuration
            issuer: 'https://tracademic.utsc.utoronto.ca/shibboleth',
            // Service Provider private key
            // decryptionPvk: fs.readFileSync('PATH-TO/saml-decrypt.pem', 'utf8'), //The private key used to decrypt SAML responses.
            // Identity Provider's public key
            // cert: fs.readFileSync('PATH-TO/saml-verify.crt', 'utf8'), //The certificate used to verify SAML responses. Omitting this will allow user spoofing!
            identifierFormat: null,
            disableRequestedAuthnContext: true,
            // validateInResponseTo: true,
            acceptedClockSkewMs: 5000
        }
    },

    development: {
        samlData: {
            // URL that goes from the Service Provider -> Identity Provider
            entryPoint: "https://idp.utorauth.utoronto.ca/idp/profile/SAML2/Redirect/SSO",
            // URL that goes from the Identity Provider -> Service Provider
            // callbackUrl: 'https://localhost:3000/', // possibly not needed as we already set in shibboleth API
            // Usually specified as `/shibboleth` from site root. Note: this must be identical with entity ID in shibboleth server configuration
            issuer: 'https://tracademic.utsc.utoronto.ca/shibboleth',
            // Service Provider private key
            decryptionPvk: fs.readFileSync('app/certificates/saml-decrypt.pem', 'utf8'), //The private key used to decrypt SAML responses.
            // Identity Provider's public key
            cert: fs.readFileSync('app/certificates/saml-verify.crt', 'utf8'), //The certificate used to verify SAML responses. Omitting this will allow user spoofing!
            identifierFormat: null,
            disableRequestedAuthnContext: true,
            // validateInResponseTo: true,
            acceptedClockSkewMs: 5000
        }
    }

};
