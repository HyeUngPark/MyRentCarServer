/*
    회원 라우팅
*/
var express = require('express');
var router = express.Router();
var schema = require('../schema/commonSchema');

router.get('/idCheck', function(req, res) {
    var params = req.query;
    schema.find({
        workSection: 'MEMBER',
        "subSchema.id": params.loginId
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        console.log(result);
        if (result.length > 0) {
            res.json({ "idCode": "02" })
        } else {
            res.json({ "idCode": '01' });
        }
    });
});

    router.post('/login', function(req, res) {
        console.log("/login");
        var params = req.query;

        schema.find({
            workSection: 'MEMBER',
            "subSchema.id": params.loginId,
            "subSchema.pw": params.password
        }, function(err, result) {
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            if (result.length > 0) {
                res.json({ "loginCode": '01', name: result.name });
            } else {
                res.json({ "loginCode": "02" })
            }
        });
    });
    router.post('/join', function(req, res) {
        var params = req.query;
        console.log('/join() \n',params);
        var result = schema.create({
            workSection: 'MEMBER' // 업무 구분 PRODUCT(상품) ORDER(주문) MEMBER(회원)
            ,firstWriteDate: new Date() // 최초작성일
            ,subSchema: { // 업무별 하위 스키마
                mem_id: params.loginId,
                mem_pw: params.password,
                mem_name: params.name,
                mem_email : params.email,
                mem_phone : params.phoneNumber,
                mem_emailYn : 'N',
                mem_smsYn : 'N'       
            }
        });
        console.log(result);
        res.json({
            login: 'success',
            name: params.name
        });
    });

    router.post('/idSearch',function(req,res){
        var params = req.query;
        console.log('/idSearch() \n',params);
        
        schema.find({
            workSection: 'MEMBER',
            "subSchema.mem_phone": params.phoneNumber,
            "subSchema.mem_name": params.name
        }, function(err, result) {
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            if (result.length > 0) {
                res.json({ "loginCode": '01', "loginId": result.mem_id });
            } else {
                res.json({ "loginCode": "02" })
            }
        });
    });

module.exports = router;