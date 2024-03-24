const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Nekretnina = sequelize.define("Nekretnina",{
        tip_nekretnine:Sequelize.STRING,
        naziv:Sequelize.STRING,
        kvadratura:Sequelize.INTEGER,
        cijena:Sequelize.FLOAT,
        tip_grijanja:Sequelize.STRING,
        lokacija:Sequelize.STRING,
        godina_izgradnje:Sequelize.INTEGER,
        datum_objave: Sequelize.STRING,
        opis:Sequelize.STRING
    })
    return Nekretnina;
};