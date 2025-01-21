module.exports = (sequelize, DataTypes) => {
  const UserInfo = sequelize.define(
    "UserInfo",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      phoneNumber: { type: DataTypes.STRING, allowNull: false },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      source: {
        type: DataTypes.ENUM("form", "brochure"),
        allowNull: true,
        defaultValue: "form",
      },
      investments: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );
  return UserInfo;
};
