module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		number_of_fields: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false,
		},
		next_field_cost: {
			type: DataTypes.INTEGER,
			defaultValue: 5,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};