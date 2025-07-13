'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Subscription.init({
    userId: DataTypes.INTEGER,
    stripeCustomerId: DataTypes.STRING,
    stripeSubscriptionId: DataTypes.STRING,
    tier: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Subscription',
  });
  return Subscription;
};