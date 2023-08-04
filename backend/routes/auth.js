const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuse=require('../middleware/fetchuse');

const JWT_secret = 'Harry0987';

// Route 1: Create a user using: Post "/api/auth" , No login required
router.post('/', [
  body('name', 'Enter the valid name').isLength({ min: 3 }),
  body('email', 'Enter the valid email').isEmail(),
  body('password', 'Password mus be atleast 5 charater ').isLength({ min: 5 })

], async (req, res) => {
  let success=false;

  // If there are errors, bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  // Check whether the user with this correct email already exists
  try {


    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, errors: "Sorry a user with this email already exists" })
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })

    // For create a token for the user
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_secret);

    // res.json(user);
    success=true;
    res.json({success, authToken });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
})






// Route 2: Authenticate a user using: Post "/api/auth/login" , No login required
router.post('/login', [
  body('email', 'Enter the valid email').isEmail(),
  body('password', 'Password cannot be empty').exists()

], async (req, res) => {

  let success=false;
  // If there are errors, bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
  let user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({ success, error: "Please try to login with valid credentials" });
  }

  const passwordCompare= await bcrypt.compare(password, user.password);
  if(!passwordCompare){
    return res.status(400).json({ success, error: "Please try to login with valid credentials" });
  }

  const data = {
    user: {
      id: user.id
    }
  }
  const authToken = jwt.sign(data, JWT_secret);
  success=true;

  // res.json(user);
  res.json({success, authToken });


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Route 3: Get Loggedin User details using: Post "/api/auth/getuser" , login required
router.post('/getuser', fetchuse,async (req, res) => {

try {
  userId=req.user.id;
  const user=await User.findById(userId).select("-password");
  res.send(user);
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server error");
}
})

module.exports = router