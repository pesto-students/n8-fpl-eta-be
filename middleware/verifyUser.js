const admin = require('../firebase').firebaseAdmin;
const sessionCookie = req.cookies.session || "";
admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => { })
    .catch((error) => {
        res.status(401).send(JSON.stringify({ status: "UNAUTHORIZED" }));
    });
