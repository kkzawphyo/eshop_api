const db = require("../models/db");
const { Validator } = require('node-input-validator');


checkValidation = (req, res, next) => {
  const v = new Validator(req.body, {
    usr_name:'required',
    usr_email: 'required|email',
    usr_password: 'required',
  });

  v.check().then((matched) => {
    if (!matched) {
      console.log(v.errors);
      return res.status(400).send(v.errors);
    }
  });
};
checkDuplicate = (req, res, next) => {
  const name = req.body.usr_name;
  const sql_name = " SELECT * FROM tbl_user WHERE usr_name='" + name + "' ";

  db.query(sql_name, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: "name validate execute error",
      });
    } else {
      if (user.length >0) {
        return res.status(400).json({
          message: "Failed! Name is already in use!"
        });
      }
    }
  });

  const email = req.body.usr_email;
  const sql_email = " SELECT * FROM tbl_user WHERE usr_email='" + email + "' ";

  db.query(sql_email, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: "email validate execute error",
      });
    } else {
      if (user.length >0) {
        return res.status(400).json({
          message: "Failed! Email is already in use!"
        });
      }
    }
  });
  next();
};

const verifySignUp = {
  checkDuplicate: checkDuplicate,
  checkValidation:checkValidation,
};

module.exports = verifySignUp;
