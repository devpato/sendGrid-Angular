const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const SENDGRID_API_KEY = "YOUR API KEY";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(SENDGRID_API_KEY);

exports.firestoreEmail = functions.firestore
  .document("users/{userId}/followers/{followerId}")
  .onCreate((event, context) => {
    const userId = context.params.userId;
    const db = admin.firestore();

    return db
      .collection("users")
      .doc(userId)
      .get()
      .then(doc => {
        const user = doc.data();

        const msg = {
          to: user.email,
          from: "hello@angularfirebase.com",
          subject: "New Follower",
          // text: `Hey ${toName}. You have a new follower!!! `,
          // html: `<strong>Hey ${toName}. You have a new follower!!!</strong>`,

          // custom templates
          templateId: "d-c66513d40f0e4b79845f63d598df5e07",
          substitutionWrappers: ["{{", "}}"],
          substitutions: {
            name: user.displayName
            // and other custom properties here
          }
        };

        return sgMail.send(msg);
      })
      .then(() => console.log("email sent!"))
      .catch(err => console.log(err));
  });

//d-c66513d40f0e4b79845f63d598df5e07
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
