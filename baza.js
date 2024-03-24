const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt24","root","password",{host:"127.0.0.1",dialect:"mysql",logging:false});
const baza={};

baza.Sequelize = Sequelize;  
baza.sequelize = sequelize;

const Korisnici = require(__dirname + '/korisnik.js');
baza.korisnik = Korisnici(sequelize, Sequelize);
const Nekretnine = require(__dirname + '/nekretnina.js');
baza.nekretnina = Nekretnine(sequelize, Sequelize);
const Upiti = require(__dirname + '/upit.js');
baza.upit = Upiti(sequelize, Sequelize);
const Trecii = require(__dirname + '/treci.js');
baza.treci = Trecii(sequelize, Sequelize);

baza.nekretnina.hasMany(baza.upit,{as:'upitiNekretnina'});
baza.korisnik.hasMany(baza.upit,{as:'korisnikUpiti'});
baza.nekretnina.hasMany(baza.treci,{as:'podaciNekretnina'});

module.exports=baza;
