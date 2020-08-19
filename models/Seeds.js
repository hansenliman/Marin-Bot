module.exports = (sequelize, DataTypes) => {
	return sequelize.define('seeds', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		cost: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		harvest_age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
		sell_value: {
            type: DataTypes.INTEGER,
            allowNull: false
		},
		generatedItem_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
		season: {
            type: DataTypes.STRING,
            allowNull: false
        },
	}, {
		timestamps: false,
	});
};