module.exports = (sequelize, DataTypes) => {
	return sequelize.define('items', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		sell_value: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
	}, {
		timestamps: false,
	});
};