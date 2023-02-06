const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
//JSOn web token
const jwt = require("jsonwebtoken");
const db = admin.firestore();
bcrypt = require("bcryptjs");

// //Get all documents JSON
router.get("/", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.params.id);
    const response = await userRef.get();
    res.send(response.data());
  } catch (error) {
    res.send(error);
  }
});

// code to chcek user login by token and return user data if token is valid
router.get("/checktoken", async (req, res) => {
  try {
    const token = req.cookies.token || req.headers["x-access-token"];
    if (!token) {
      res.status(401).send({
        message: "No token provided",
        islogin: false,
      });
    } else {
      jwt.verify(token, "secret", async (err, decoded) => {
        if (err) {
          res.status(401).send({
            message: "Unauthorized",
          });
        } else {
          const userRef = db.collection("users").doc(decoded.id);
          const response = await userRef.get();
          res.status(200).send({
            message: "Authorized",
            islogin: true,
            token: token,
            user: response.data(),
          });
        }
      });
    }
  } catch (error) {
    res.send(error);
  }
});

// router.get("/checktoken", (req, res) => {
//   console.log("hello");
//   const token = req.cookies.token || req.headers["x-access-token"];

//   console.log("token = " + token);

//   if (!token) {
//     res.status(401).send({
//       message: "No token provided",
//       islogin: false,
//     });
//   } else {
//     jwt.verify(token, "secret", (err, decoded) => {
//       if (err) {
//         res.status(401).send({
//           message: "Unauthorized",
//         });
//       } else {
//         res.status(200).send({
//           message: "Authorized",
//           islogin: true,
//           token: token,
//         });
//       }
//     });
//   }
// });
// //Get a document JSON
router.get("/:id", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.params.id);
    const response = await userRef.get();
    res.send(response.data());
  } catch (error) {
    res.send(error);
  }
});

//Login user
router.post("/", async (req, res) => {
  try {
    const userRef = db.collection("users");
    const snapshot = await userRef.where("email", "==", req.body.email).get();
    if (snapshot.empty) {
      res.status(400).send({
        message: "User does not exist",
      });
    }
    snapshot.forEach((doc) => {
      const user = doc.data();
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      console.log(passwordIsValid);
      if (passwordIsValid !== false) {
        //Generate token
        const token = jwt.sign(
          {
            id: user.userId,
            email: user.email,
            username: user.username,
          },
          "secret",
          {
            expiresIn: "1h",
          }
        );

        //Set token in cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

        //Set header
        res.header("x-access-token", token);

        res.status(200).send({
          message: "User logged in successfully",
          token: token,
        });
      } else {
        res.status(400).send({
          message: "Invalid password",
        });
      }
    });
  } catch (error) {
    res.send(error);
  }
});

// code to check if user is logged in or not by checking the token

module.exports = router;
