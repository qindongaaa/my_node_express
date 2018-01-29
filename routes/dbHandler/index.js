var express = require('express');
var router = express.Router();
var dbOperator = require('./dbOperator.js');
var Q = require('q');
var dbConf = require('../../config.js').dbConf;



router.all('*',reqFunc);
function reqFunc(req, res){
    var cmd = req.url;
    switch (cmd) {
        case '/test':
            dbOperator.test().then((json)=>{
                 res.json(json);
            });
        break;
        case '/read':    
            dbOperator.read(req).then((json)=>{
                res.json(json);
            });
        break; 
        case '/write':
            dbOperator.write(req).then((json)=>{
                res.json(json);
            });
        break;
        case '/write_config':
            dbOperator.writeConfig(req).then((json)=>{
                res.json(json);
            });
        break;
        case '/login':
            dbOperator.login(req,res).then((json)=>{
                res.json(json);
            });
        break;
    }
}
 module.exports=router;

//app.js中启用app.post，可用以下代码作为请求中转
// module.exports.reqFunc = function (req, res) {
//     var cmd = "";
//     if (req.body.request) {
//         cmd = req.body.request;
//     } else if (req.params.request) {
//         cmd = req.params.request;
//     } else {
//         cmd = req.query.request;
//     }
//     switch (cmd) {
//         case 'test':
//             dbOperator.test().then((json)=>{
//                 res.json(json);
//             });
//         break;
//         case 'read':    
//             dbOperator.read().then((json)=>{
//                 res.json(json);
//             });
//         break; 
//         case 'write':
//             dbOperator.write().then((json)=>{
//                 res.json(json);
//             });
//         break;
//         case 'write_config':
//             dbOperator.writeConfig().then((json)=>{
//                 res.json(json);
//             });
//         break;
//         case 'login':
//             dbOperator.login().then((json)=>{
//                 res.json(json);
//             });
//         break;
//         }
// } 
