const express = require('express');
const router = express.Router();
const db = require('../models/db');

//add new product category into tbl_productCategory
router.post('/createNewProductCategory', function (req, res) {
    const postData = req.body;
    const sql = 'INSERT INTO tbl_productCategory SET ?';
    db.query(sql, postData, (err, result) => {
        if (err) throw err;
        res.send('New product category is added');
    });
});

//update product category in tbl_productCategory
router.post('/updateProductCategory/:categoryId', function (req, res) {
    const postData = req.body;
    const catId = req.params.categoryId;
    const sql = " UPDATE tbl_productCategory SET ? WHERE cat_categoryId='" + catId + "' ";
    db.query(sql, postData, (err, result) => {
        if (err) throw err;
        res.send('Category is updated');
    });
});

//delete product category form tbl_productCategory
router.post('/deleteProductCategory/:categoryId', function (req, res) {
    const catId = req.params.categoryId;
    const sql = " DELETE FROM tbl_productCategory  WHERE cat_categoryId='" + catId + "' ";
    db.query(sql, (err, result) => {
        if (err) res.send('error');
        res.send('Category is deleted');
    });
});

//get product category with it's subcategory from tbl_prductCategory
router.get('/getProductCategory', (req, res) => {
    const sql1 = "SELECT cat_categoryId,cat_categoryName FROM tbl_productCategory WHERE cat_parentCategory IS NULL";
    db.query(sql1, (err, result1) => {
        if (err) throw err;
        else {
            const sql = "SELECT cat_parentCategory,cat_categoryName FROM tbl_productCategory WHERE cat_parentCategory IS NOT NULL";
            db.query(sql, (err, results) => {
                if (err) throw err;
                else {
                    const length1 = result1.length;
                    const length = results.length;
                    for (var i = 0; i < length1; i++) {
                        var subCategory = [];
                        var k = 0;
                        for (var j = 0; j < length; j++) {
                            if (result1[i].cat_categoryId === results[j].cat_parentCategory) {
                                subCategory[k] = results[j].cat_categoryName;
                                k++;
                            }
                        }
                        result1[i].sub_category = subCategory;
                        //subCategory = "";
                    }
                    res.send(result1);
                }
            })
        }
    })
})






module.exports = router;