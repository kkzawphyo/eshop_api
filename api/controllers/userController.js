const db = require("../models/db");
const bcrypt = require("bcrypt");
const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");

exports.signin = (req, res) => {
  const email = req.body.usr_email;
  console.log(email);
  const sql = " SELECT * FROM tbl_user WHERE usr_email='" + email + "' ";
  db.query(sql, (err, user) => {
    if (err) {
      return res.status(500).json({
        error: "email validate execute error",
      });
    } else {
      if (user.length < 1) {
        return res.status(200).json({
          message: "Authentication Fail",
        });
      }
      bcrypt.compare(
        req.body.usr_password,
        user[0].usr_password,
        (err, result) => {
          if (err) {
            return res.status(200).json({
              message: "Auth failed ",
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].usr_email,
                userId: user[0].usr_userId,
              },
              config.JWT_KEY,
              {
                expiresIn: "1h",
              }
            );
            return res.status(200).json({
              usr_name:user[0].usr_name,
              message: "Authentication successful",
              token: token,
            });
          }
          return res.status(200).json({
            message: "Auth failed (password)",
          });
        }
      );
    }
  });
};

exports.signup = (req, res) => {
    const email = req.body.usr_email;
    const pw = req.body.usr_password;
    if (validator.validate(email)) {
      //validate email pattern
      if (pw.length > 7) { 
              bcrypt.hash(req.body.usr_password, 10, (err, hash) => {
                //encrypt password
                if (err) {
                  return res.status(500).json({
                    message: "bcrypt error",
                  });
                } else {
                  usr_name = req.body.usr_name;
                  usr_email = req.body.usr_email;
                  usr_password = hash;
                  const sql = "INSERT INTO tbl_user(usr_name,usr_email,usr_password,usr_pendingStatus) VALUES (?,?,?,?)";
                  db.query(sql,[usr_name,usr_email,usr_password,0], (err, result) => {
                    if (err) return res.status(200).json({message: err,});
                    res.status(200).json({message: "Singup success",});
                  });
                }
              });
          } else {
            return res.status(200).json({
              message: "Your password is too short",
            });
      }
    } else {
      return res.status(200).json({
        message: "Your mail is invalid",
      });
    }
};