const express = require('express');
const router = express.Router();
const db = require('../models/db');
const multer = require('multer');
const uuidv4 = require('uuidv4');//for unique name
//get ip of server
// const ip = require('ip');
// console.log(ip.address());

//upload photo to diskstorage
const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        //cb(null,new Date().getTime()+uuidv4()+file.originalname );
        cb(null, uuidv4() + file.originalname);

    }
})
const upload = multer({
    storage: Storage
});

// upload product photo(insert photoName into tbl_productPhoto)
router.post('/uploadPhoto', upload.any(), (req, res, next) => {
    const no = req.files.length;
    for (var i = 0; i < no; i++) {
        const sql = "INSERT INTO tbl_productPhoto (pho_productId, pho_photo) VALUES ('" + req.body.pho_productId + "', '" + req.files[i].filename + "')";
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log('New product photo is added');
            }

        });

    }
    res.send("New product photos are added")

});

//upload product(insert new product into tbl_product)
router.post('/addNewProduct', function (req, res) {
    const data = req.body;
    const sql = 'INSERT INTO tbl_product SET ?';
    db.query(sql, data, (err, result) => {
        if (err) res.send("insert query err")
        res.send('New product is added');
    })
});

//delete product from tbl_product
router.post('/deleteProduct/:productId', function (req, res) {
    const prodtId = req.params.productId;
    const sql = " DELETE FROM tbl_product  WHERE pro_productId='" + prodtId + "' ";
    db.query(sql, (err, result) => {
        if (err) res.send('error');
        res.send('Product is deleted');
    });
});

//delete photo from tbl_productPhoto
router.post('/deleteProductPhoto/:photoName', function (req, res) {
    const photoName = req.params.photoName;
    const sql = " DELETE FROM tbl_productPhoto  WHERE pho_photo='" + photoName + "' ";
    db.query(sql, (err, result) => {
        if (err) res.send('error');
        res.send('Photo is deleted');
    });
});

//update product  in tbl_product
router.post('/updateProduct/:productId', function (req, res) {
    const postData = req.body;
    const prodtId = req.params.productId;
    const sql = " UPDATE tbl_product SET ? WHERE pro_productId='" + prodtId + "' ";
    db.query(sql, postData, (err, result) => {
        if (err) throw err;
        res.send('Product is updated');
    });
});
/*
//get product detail  from tbl_product
router.get('/getProductDetail/:productId', function (req, res) {
    const postData = req.body;
    const prodtId = req.params.productId;
    const sql = " SELECT * FROM tbl_product WHERE pro_productId='" + prodtId + "' ";
    db.query(sql,  (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
*/

//get all new product details from tbl_product and tbl_productPhoto
router.get('/getNewProduct', (req, res) => {
    const sql1 = 'SELECT pro_productId,pro_Name,pro_description,pro_price,pro_stockStatus,protyp_producttype,usr_name,pro_uploadDate FROM ((tbl_product INNER JOIN tbl_user ON usr_userId=pro_supplierId)INNER JOIN tbl_productType ON pro_producttypeId=protyp_producttypeId) WHERE pro_producttypeId="1"';
    db.query(sql1, (err, result1) => {
        if (err) res.send(err);
        else {
            const sql = "SELECT pho_productId,pho_photo FROM tbl_productPhoto ";
            db.query(sql, (err, results) => {
                if (err) throw err;
                else {
                    const length1 = result1.length;
                    const length = results.length;
                    for (var i = 0; i < length1; i++) {
                        var photoArr = [];
                        var k = 0;
                        for (var j = 0; j < length; j++) {
                            if (result1[i].pro_productId === results[j].pho_productId) {
                                photoArr[k] = results[j].pho_photo;
                                photoArr.id = results[j].pho_photoId;
                                k++;
                            }
                        }
                        result1[i].photo = photoArr;
                        //photoArr = "";
                    }
                    res.send(result1);
                }
            })
        }
    })
})


//get all second product details from tbl_product and tbl_productPhoto
router.get('/getSecondProduct', (req, res) => {
    // const sql1 = 'SELECT pro_productId,pro_Name,pro_description,pro_price,pro_stockStatus,protyp_producttype,usr_name,pro_uploadDate FROM tbl_product,tbl_user,tbl_producttype WHERE pro_producttypeId=protyp_producttypeId AND usr_userId=pro_supplierId AND pro_producttypeId="2"';
    const sql1 = 'SELECT pro_productId,pro_Name,pro_description,pro_price,pro_stockStatus,protyp_producttype,usr_name,pro_uploadDate FROM ((tbl_product INNER JOIN tbl_user ON usr_userId=pro_supplierId)INNER JOIN tbl_productType ON pro_producttypeId=protyp_producttypeId) WHERE pro_producttypeId="2"';
    db.query(sql1, (err, result1) => {
        if (err) res.send(err);
        else {
            const sql = "SELECT pho_productId,pho_photo FROM tbl_productPhoto ";
            db.query(sql, (err, results) => {
                if (err) throw err;
                else {
                    const length1 = result1.length;
                    const length = results.length;
                    for (var i = 0; i < length1; i++) {
                        var photoArr = [];
                        var k = 0;
                        for (var j = 0; j < length; j++) {
                            if (result1[i].pro_productId === results[j].pho_productId) {
                                photoArr[k] = results[j].pho_photo;
                                k++;
                            }
                        }
                        result1[i].photo = photoArr;
                        //photoArr = "";
                    }
                    res.send(result1);
                }
            })
        }
    })
})

//get all second product details from tbl_product and tbl_productPhoto
router.get('/getProductDetail/:productId', (req, res) => {
    const prodtId = req.params.productId;
    const sql1 = "SELECT pro_productId,pro_Name,pro_description,pro_price,pro_stockStatus,protyp_producttype,usr_name,pro_uploadDate "+
                "FROM ((tbl_product INNER JOIN tbl_user ON usr_userId=pro_supplierId)INNER JOIN tbl_productType ON pro_producttypeId=protyp_producttypeId)"+
                " WHERE pro_productId='" + prodtId + "'";
    db.query(sql1, (err, result1) => {
        if (err) res.send(err);
        else {
            const sql = "SELECT pho_productId,pho_photo FROM tbl_productPhoto ";
            db.query(sql, (err, results) => {
                if (err) throw err;
                else {
                    const length1 = result1.length;
                    const length = results.length;
                    for (var i = 0; i < length1; i++) {
                        var photoArr = [];
                        var k = 0;
                        for (var j = 0; j < length; j++) {
                            if (result1[i].pro_productId === results[j].pho_productId) {
                                photoArr[k] = results[j].pho_photo;
                                k++;
                            }
                        }
                        result1[i].photo = photoArr;
                        //photoArr = "";
                    }
                    res.send(result1);
                }
            })
        }
    })
})

module.exports = router;