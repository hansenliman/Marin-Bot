module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_seed', {
		user_id: DataTypes.STRING,
		seed_id: DataTypes.STRING,
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 0,
		},
		level: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};