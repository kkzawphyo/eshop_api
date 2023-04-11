const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_KEY = "secret";
const validator = require("email-validator");
const multer = require('multer');
const uuidv4 = require('uuidv4');//for unique name


//upload photo to diskstorage
const Storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./userPhoto');
    },
    filename:function(req,file,cb){
       // cb(null,new Date().getTime()+uuidv4()+file.originalname );
       cb(null,uuidv4()+file.originalname );

    }
})
const upload = multer({
    storage: Storage
});

//sing up user into tbl_user
router.post("/singup",upload.any(), (req, res, next) => {
    const email = req.body.usr_email;
    const pw = req.body.usr_password;
    if (validator.validate(email)) { //validate email pattern
        if (pw.length > 7) {           // validate pw length
           
            const sql = " SELECT * FROM tbl_user WHERE usr_email='" + email + "' ";
            db.query(sql, (err, result) => {                    //validate does email exit
                if (err) {
                    return res.status(500).json({
                        error: 'email validate execute error'
                    });
                } else {
                    if (result.length >= 1) {
                        return res.status(409).json({
                            message: 'Mail exists'
                        });
                    } else {
                        bcrypt.hash(req.body.usr_password, 10, (err, hash) => {   //encrypt password
                            if (err) {
                                return res.status(500).json({
                                    error: 'bcrypt error'
                                });
                            } else {
                                const postData = req.body;
                                postData["usr_password"] = hash;
                                postData["usr_frontEntryCard"]=req.files[0].filename;
                                postData["usr_backEntryCard"]=req.files[1].filename;
                                console.log(postData);
                                const sql = 'INSERT INTO tbl_user SET ?';
                                db.query(sql, postData, (err, result) => {
                                    if (err) res.send(err)
                                    res.send('singup successful');
                                })

                            }

                        });
                    }

                }
            });

        } else {
            res.send("Password length must be at least 8");
        }

    } else {
        res.send("it is not a mail")
    }


});

// login user
router.post("/login", (req, res, next) => {
    const email = req.body.usr_email;
    const sql = " SELECT * FROM tbl_user WHERE usr_email='" + email + "' ";
    db.query(sql, (err, user) => {
        if (err) {
            return res.status(500).json({
                error: 'email validate execute error'
            });
        } else {
            if (user.length < 1) {
                return res.status(200).json({
                    message: 'Auth failed (email)'
                });
            }
            bcrypt.compare(req.body.usr_password, user[0].usr_password, (err, result) => {
                if (err) {
                    return res.status(200).json({
                        message: 'Auth failed '
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].usr_email,
                            userId: user[0].usr_userId
                        },
                        JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Authentication successful',
                        token: token
                    });
                }
                return res.status(200).json({
                    message: 'Auth failed (password)'

                });
            });

        }

    });
});

router.post('/updateUser', (req, res) => {
    const usrId = req.params.usr_userId;
    const data = req.body;
    const query = "UPDATE tbl_user SET ? WHERE usr_userId='" + usrId + "' ";
    db.query(query, data, (err, result) => {
        if (result) throw err;
        else {
            res.send("User is updated");
        }
    })
})



module.exports = router;