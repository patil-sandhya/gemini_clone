'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Message.init({
    userId: DataTypes.INTEGER,
    chatroomId: DataTypes.INTEGER,
    text: DataTypes.STRING,
    response: {
  type: DataTypes.TEXT,
  allowNull: true
}
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};