/*
    회원 라우팅
*/
var express = require('express');
var router = express.Router();
var schema = require('../schema/commonSchema');
var random = require('../myUtils/randomUtils');
var mail = require('../myUtils/mailUtils');

router.get('/idCheck', function(req, res) {
    var params = req.query;
    schema.find({
        workSection: 'MEMBER',
        "subSchema.mem_id": params.loginId
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        console.log(result);
        if (result.length > 0) {
            res.json({ "returnCode": "02" })
        } else {
            res.json({ "returnCode": '01' });
        }
    });
});

router.post('/login', function(req, res) {
    console.log("/login");
    var params = req.query;

    schema.find({
        workSection: 'MEMBER',
        "subSchema.mem_id": params.loginId,
        "subSchema.mem_pw": params.password
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        if (result.length > 0) {
            res.json({ "returnCode": '01', name: result[0].subSchema.name });
        } else {
            res.json({ "returnCode": "02" })
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
                // mem_email : params.email,
                // mem_address : params.email,
                mem_phone : params.phoneNumber,
                mem_emailYn : 'N',
                mem_smsYn : 'N'       
            }
        });
        console.log(result);
        res.json({
            returnCode: '01',
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
                console.log("★★★ result ★★★ \n",result[0]);
                res.json({ "returnCode": '01', "loginId": result[0].subSchema.mem_id });
            } else {
                res.json({ "returnCode": "02" })
            }
        });
    });

    router.post('/pwSearch',function(req,res){
        var params = req.query;
        var phoneNubmer = params.phoneNumber;
        var loginId = params.loginId;
        var _id;
        schema.find({
            workSection: 'MEMBER',
            "subSchema.mem_id": loginId,
            "subSchema.mem_phone": phoneNubmer
        }, function(err, result) {
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            console.log(result);
            if (result.length > 0) {
                _id = result[0]._id;
                var newPw = random.getRandom();
                console.log('pwSearch || ',newPw);
                
                let emailParam = {
                    toEmail : loginId
                    ,subject  : 'MyRentCar 비밀번호 초기화'
                    ,text : '초기화 된 비밀번호는 '+newPw+' 입니다. 로그인 후 변경하시기 바랍니다.'
                };
                mail.sendGmail(emailParam);
                // 비밀번호 업데이트
                schema.updateOne({
                    "_id" : _id
                }
                , { $set: {'subSchema.mem_pw': newPw } }
                , function(err, result) {
                    if (err) {
                        console.log('error \n', err);
                        return res.status(500).send("select error >> " + err)
                    }
                    if (result.n) {
                        console.log("★★★ result ★★★ \n",result.n);
                        // res.json({ "returnCode": '01', "loginId": result[0].subSchema.mem_id });
                    } else {
                        console.log("★★★ fail ★★★ \n",result.n);
                        // res.json({ "returnCode": "02" })
                    }
                });

                res.json({ "returnCode": '01' });
            } else {
                res.json({ "returnCode": "02" })
            }
        });
    });

    /*
    router.get('/pwChange',function(req,res){
        // let parms = req.query;
        // let loginId = parms.id;
        // let phoneNumber = parms.phoneNumbmer;
        var newPw = random.getRandom();
        console.log('/pwChange');

        schema.updateOne({
            workSection: 'MEMBER'
            ,"subSchema.mem_id": "*"
            ,"subSchema.mem_phone": '*'
        }
        , { $set: {'subSchema.mem_pw': newPw } }
        , function(err, result) {
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            if (result.n) {
                console.log("★★★ result ★★★ \n",result.n);
                // res.json({ "returnCode": '01', "loginId": result[0].subSchema.mem_id });
            } else {
                console.log("★★★ fail ★★★ \n",result.n);
                // res.json({ "returnCode": "02" })
            }
        });
    });
*/

module.exports = router;