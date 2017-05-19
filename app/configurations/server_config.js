module.exports = {
    env: "development",
    port: this.env === "production" ? 443 : 3000
    // db: "mongodb://MongoLab-n:VH.2CWjgZIBA32.rOJq5pDO4kkisCTIjedb019r5vPA-@ds060977.mongolab.com:60977/MongoLab-n",
    // //db: "mongodb://192.168.78.129/trackpoint",
    // httpsCert: "cert.pem",
    // httpsKey: "key.pem",
    // session: {
    //     key: "tracademichub.sess", //what the name that the session cookie is stored as
    //     secret: "wqcVwJ6rNgrpEpZBppGt", //DO NOT LEAK
    //     timeout: 12 * 60 * 60 * 1000
    // },
    // saml: {
    //     entryPoint: "https://idp.utorauth.utoronto.ca/idp/profile/SAML2/Redirect/SSO",
    //     issuer: 'https://tracademic.utsc.utoronto.ca/shibboleth',
    //     identifierFormat: null,
    //     disableRequestedAuthnContext: true,
    //     acceptedClockSkewMs: 5000,
    //     decryptionPvk: "saml-decrypt.pem", //The private key used to decrypt SAML responses.
    //     cert: "saml-verify.crt"//The certificate used to verify SAML responses. Omitting this will allow user spoofing!
    // }
};
