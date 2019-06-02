/* 
    공통 라우팅
*/
var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, res) {
    console.log("/호출!!!");
    // console.log("job ===\n",req.job);
    // res.json({login:'success'});
});

router.get('/googlec9bbba10a3ea94c1.html', function(req, res) {
    console.log("/호출!!!");
    fs.readFile('googlec9bbba10a3ea94c1.html',function(err, data){
        res.writeHead(200, {'content-Type':'text/html'});
        res.end(data)
    });
    // console.log("job ===\n",req.job);
    // res.json({login:'success'});
});
router.get('/google6d10baa83fea548d.html', function(req, res) {
    console.log("/호출!!!");
    fs.readFile('google6d10baa83fea548d.html',function(err, data){
        res.writeHead(200, {'content-Type':'text/html'});
        res.end(data)
    });
    // console.log("job ===\n",req.job);
    // res.json({login:'success'});
});





module.exports = router;