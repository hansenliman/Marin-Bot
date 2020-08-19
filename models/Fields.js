module.exports = (sequelize, DataTypes) => {
	return sequelize.define('fields', {
        user_id: DataTypes.STRING,
        field_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        plant: {
			type: DataTypes.STRING,
		},
		age: {
			type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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
        generatedSeed_id: {
            type: DataTypes.INTEGER,
            defaultValue: -1,
            allowNull: false
        },
        is_empty: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        level: {
			type: DataTypes.INTEGER,
			allowNull: false,
        },
        is_withered: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
	}, {
		timestamps: false,
	});
};