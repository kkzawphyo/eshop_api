const express = require("express");
const router = express.Router();
const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_KEY = "secret";
const uuidv4 = require("uuidv4"); //for unique name
const controller = require("../controllers/userController");
const { verifySignUp } = require("../middleware");
const { checkValidation } = require("../middleware/user");

// signup user
router.post("/signup",
  [
    verifySignUp.checkValidation,
    verifySignUp.checkDuplicate,    
  ],
  controller.signup
);

// login user
router.post("/login", controller.signin);

router.post("/updateUser/:usrId", function (req, res) {
  const postData = req.body;
  const userId = req.params.usrId;
  console.log(userId, postData);
  const sql = " UPDATE tbl_user SET ? WHERE usr_userId='" + userId + "' ";
  db.query(sql, postData, (err, result) => {
    if (err) throw err;
    res.send("User was updated");
  });
});

module.exports = router;
