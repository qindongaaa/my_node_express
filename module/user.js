
function userModel(sequelize, DataTypes) {
    var User = sequelize.define('user', {
    userid: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false 
    },
    username: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  }, 
  {
    freezeTableName: true, // Model 对应的表名将与model名相同
    'createdAt': false,
    'updatedAt': false,
    tableName: 'user'
  });
  
  return User;
}

module.exports = userModel;