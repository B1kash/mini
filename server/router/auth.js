const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const authenticate = require("../middleware/authenticate");
const cookieParser = require('cookie-parser');

require("../DB/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send("Hello World from the server router.js");
});

//using promises
// router.post("/register", (req, res) => {
//   const { name, email, phone, work, password, cpassword } = req.body;

//   if (!name || !email || !phone || !work || !password || !cpassword) {
//     return res.status(422).json({ error: "fill the all details" });
//   }

//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error: "email already exist" });
//       }

//       const user = new User({ name, email, phone, work, password, cpassword });

//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: "Resistered Succesfully" });
//         })
//         .catch(() => res.status(500).json({ error: "failed to registered" }));
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

//using async
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "fill the all details" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "email already exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password are not matching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      const userRegister = await user.save();

      res.status(201).json({ message: "Resistered Succesfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

// login route

router.post("/signin", async (req, res) => {
  

  try {
      let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill the data" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatched = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();
      console.log(token);

      if (!isMatched) {
        res.status(400).json({ message: "Invalid credential" });
      } else {
        res.json({ message: "user signin successfully" });
      }
    } else {
      res.status(400).json({ message: "Invalid credential" });
    }
  } catch (err) {
    console.log(err);
  }
});

// about us page
router.get('/about', authenticate ,(req, res) =>{
    console.log(`hello my about`);  
    res.send(req.rootUser);
    });

  // Logout us page
router.get('/logout',(req, res) =>{
  console.log(`hello my logout page`);
  res.clearCookie('jwtoken', {path:"/"});
  res.status(200).send(`user logout`);
  });

module.exports = router;
