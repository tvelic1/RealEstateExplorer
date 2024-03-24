const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Treci = sequelize.define("Treci",{
        brojPretraga:Sequelize.INTEGER,
        brojKlikova:Sequelize.INTEGER
    })
    return Treci;
};
