const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://upbeat-button-327904-default-rtdb.asia-southeast1.firebasedatabase.app/",
  databaseAuthVariableOverride: null
});

module.exports = {
  firebaseAdmin :admin
}