/* 
    공통 라우팅
*/
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {    
    console.log("/호출!!!");

    // console.log("job ===\n",req.job);
    res.json({login:'success'});
});
module.exports = router;