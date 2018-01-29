//建立数据库链接，选用sequelize作为orm框架   by qzy
var Sequelize = require("sequelize");
var dbConf = require('../config').dbConf;
var fs        = require("fs");
var path      = require("path");

var sequelize = new Sequelize(dbConf.database, dbConf.user, dbConf.password, {
    host: dbConf.host,
    dialect: 'mysql',
  
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
  });

sequelize.authenticate().then(function() {
    console.log("数据库连接成功");
}).catch(function(err) {
    //数据库连接失败时打印输出
    console.error(err);
    throw err;
});

var db={};
//将module文件夹下的表映射文件引入
fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});


exports.sequelize = sequelize;
exports.Sequelize = Sequelize;

module.exports=db;