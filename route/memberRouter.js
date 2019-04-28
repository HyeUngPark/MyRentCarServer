/*
    회원 라우팅
*/
var express = require('express');
var router = express.Router();
var schema = require('../schema/commonSchema');

router.post('/login', function (req, res) {    
    console.log("/login");
    var params = req.query;
    console.log("id = ",params.id, " pw = ",params.pw);

    schema.find({
        workSection : 'MEMBER'
        ,subSchema:{
            id : params.id
            ,pw : params.pw
        }
    },function(err, result) {
        if (err) 
            return res.status(500).send("select error >> "+err)
        if(result.length>0){
            res.json({"loginCode":'01'});
        }else{
            res.json({"loginCode":"02"})
        }
    });
});
router.post('/join', function (req, res) {    
    console.log("/join ");
    var params = req.query;
    console.log("id = ",params.id, " pw = ",params.pw);
    var result = schema.create({
        workSection: 'MEMBER' // 업무 구분 PRODUCT(상품) ORDER(주문) MEMBER(회원)
        ,firstWriteDate: new Date() // 최초작성일
        ,subSchema:{ // 업무별 하위 스키마
            id : params.id
            ,pw : params.pw
        }
    });
    console.log(result);
    res.json({
            login :'success'
        });
});
module.exports = router;