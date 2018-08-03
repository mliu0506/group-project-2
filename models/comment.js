module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    comment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    fromuserName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fromImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    touserName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    toImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    taskName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Comment;
};
