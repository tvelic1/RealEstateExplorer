const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Korisnik = sequelize.define("Korisnik",{
        ime:Sequelize.STRING,
        prezime:Sequelize.STRING,
        username:Sequelize.STRING,
        password:Sequelize.STRING
    })
    return Korisnik;
};
