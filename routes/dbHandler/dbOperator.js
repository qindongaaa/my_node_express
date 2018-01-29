
var fs = require('fs');
var PATH = './public/data/';
var models = require("../../module/index");
var dbOperator = require('./dbOperator.js');
var Q = require('q');


function  test() {
    var deferred=Q.defer();
    models.user.findAll({
    
    }).then(function(result) {
        deferred.resolve({
            status: 1,
            data: result});
    });
    return deferred.promise;
}
function read(req){
    var deferred=Q.defer();
    var type = req.param('type') || "";
    fs.readFile(PATH + type + '.json', function (err, data){
        if(err){
            deferred.resolve({
                status:0,
                info:'读取文件异常'
            })
        }
        var COUNT = 50;
        // TODO: try{}catch(){}
        var obj =[];
        try{
             obj = JSON.parse(data.toString());
        }catch(e){
             obj = [];
        }
        if(obj.length > COUNT){
              obj = obj.slice(0, COUNT);
        }
        deferred.resolve({
            status:1,
            data:obj
        })
    });
    return deferred.promise;
}
function write(req){
    var deferred = Q.defer();
    if(!req.cookies.user){
        return res.render('login',{});
    }
    // 文件名
    var type = req.param('type') || "";
    // 关键字段
    var url = req.param('url') || '';
    var title = req.param('title') || '';
    var img = req.param('img') || '';
    if(!type || !url || !title || !img){
        deferred.resolve({
            status:0,
            info:'提交的字段不全'
        });
    }
    //1)读取文件
    var filePath = PATH + type + '.json';
    fs.readFile(filePath, function(err, data){
        if(err){
            deferred.resolve({
                status:0,
                info:'读取数据失败'
            });
        }
        var arr = JSON.parse(data.toString());
        //代表每一条记录
        var obj = {
            img: img,
            url: url,
            title: title,
            id: guidGenerate(),
            time: new Date()
        };
        arr.splice(0, 0, obj);
        //2)写入文件
        var newData = JSON.stringify(arr);
        fs.writeFile(filePath, newData, function(err){
            if(err){
                deferred.resolve({
                    status:0,
                    info:'写入文件失败'
                });
            }
            deferred.resolve({
                status:1,
                info: obj
            });
        });
    });
    return deferred.promise;
}
function writeConfig(req){
    var deferred = Q.defer();
    if(!req.cookies.user){
        return res.render('login',{});
    }
    //TODO:后期进行提交数据的验证
    //防xss攻击 xss
    // npm install xss
    // require('xss')
    // var str = xss(name);
    var data = req.body.data;
    //TODO ： try catch
    var obj = JSON.parse(data);
    var newData = JSON.stringify(obj);

    // 写入
    fs.writeFile(PATH + 'config.json',newData, function(err, data){
        if(err){
            deferred.resolve({
                status: 0,
                info: '写入数据失败'
            });
        }
        deferred.resolve({
            status:1,
            info:'数据写入成功',
            data:newData
        });
    })
    return deferred.promise;
}
function login(req,res){
    var deferred=Q.defer();
       //用户名、密码、验证码
       var username = req.body.username;
       var password = req.body.password;
   
       //TODO ：对用户名、密码进行校验
       //xss处理、判空
   
       //密码加密 md5(md5(password + '随机字符串'))
       //密码需要加密－> 可以写入JSON文件
       if(username === 'admin' && password === '123456'){
           res.cookie('user',username);
           deferred.resolve({
                status: 1
           })
       } 
       deferred.resolve({
            status: 0,
            info: '登录失败'
        })
       return deferred.promise;
}

 //guid
    function guidGenerate() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    }
module.exports={
    // init:init,
    test:test,
    read:read,
    write:write,
    writeConfig:writeConfig,
    login:login,
}