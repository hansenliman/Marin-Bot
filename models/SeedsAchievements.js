module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_seed_achievements', {
		user_id: DataTypes.STRING,
		name: {
            type: DataTypes.STRING,
            allowNull: false,
		},
		balance_generated: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		total_harvested: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		total_reaped: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		highest_reaped: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};