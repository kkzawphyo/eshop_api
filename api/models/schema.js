const con = require('./db');

const tbl_message = "CREATE TABLE IF NOT EXISTS tbl_message(msg_messageId INT(10) NOT NULL,msg_messageBody VARCHAR(255) NOT NULL,msg_senderId INT(10) NOT NULL,msg_receiverId INT(10) NOT NULL,msg_createDate DATE NOT NULL,PRIMARY KEY (msg_messageId))";
const tbl_product="CREATE TABLE IF NOT EXISTS tbl_product(pro_productId INT(10) NOT NULL,pro_Name VARCHAR(45) ,pro_description VARCHAR(255) NOT NULL,pro_price INT(8) NOT NULL,pro_stockStatus VARCHAR(50) NOT NULL,pro_supplierId INT(10) NOT NULL,pro_productTypeId INT(2) NOT NULL,pro_subcategoryId INT(4) NOT NULL,pro_uploadDate DATE NOT NULL,pro_updateDate DATE NOT NULL,PRIMERY KEY(pro_productId))";


con.query(tbl_message, function (err, result) {
  if (err) throw err;
  console.log("tbl create");
});
