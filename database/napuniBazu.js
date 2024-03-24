const db = require('./baza.js')
db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});
function inicializacija(){
    var korisniciListaPromisea=[];
    var nekretnineListaPromisea=[];
    var upitiListaPromisea=[];

    return new Promise(function(resolve,reject){
    upitiListaPromisea.push(db.upit.create({tekst_upita:'Proba'}));
    
    Promise.all(upitiListaPromisea).then(function(){
        

        korisniciListaPromisea.push(
            db.korisnik.create({
                "ime": "user",
                "prezime": "user",
                "username": "tarik",
                "password": "$2b$10$OBZ0uuuVNb9C1ea6bRb.3umtrzlpegaB4P6Mu4R1sMbTg4WZlMRD2"
            }).then(function(k){
                return new Promise(function(resolve,reject){resolve(k);});
            })
        );
        korisniciListaPromisea.push(
            db.korisnik.create({
                "ime": "user",
                "prezime": "user",
                "username": "nekidrugi",
                "password": "$2b$10$OBZ0uuuVNb9C1ea6bRb.3umtrzlpegaB4P6Mu4R1sMbTg4WZlMRD2"
            }).then(function(k){
                return new Promise(function(resolve,reject){resolve(k);});
            })
        );
        nekretnineListaPromisea.push(
            db.nekretnina.create({
                "tip_nekretnine": "Stan",
                "naziv": "Useljiv stan Sarajevo",
                "kvadratura": 58,
                "cijena": 232000,
                "tip_grijanja": "plin",
                "lokacija": "Novo Sarajevo",
                "godina_izgradnje": 2019,
                "datum_objave": "01.10.2023.",
                "opis": "Sociis natoque penatibus."
            }).then(function(n){
                return new Promise(function(resolve, reject){resolve(n);});
            })
        );
        nekretnineListaPromisea.push(
            db.nekretnina.create({
                "tip_nekretnine": "Poslovni prostor",
                "naziv": "Mali poslovni prostor",
                "kvadratura": 20,
                "cijena": 70000,
                "tip_grijanja": "struja",
                "lokacija": "Centar",
                "godina_izgradnje": 2005,
                "datum_objave": "20.08.2023.",
                "opis": "Magnis dis parturient montes."
            }).then(function(n){
                return new Promise(function(resolve, reject){resolve(n);});
            })
        );
        nekretnineListaPromisea.push(
            db.nekretnina.create({
                "tip_nekretnine": "Kuća",
                "naziv": "Kuca Vratnik",
                "kvadratura": 320,
                "cijena": 700000,
                "tip_grijanja": "drva",
                "lokacija": "Centar",
                "godina_izgradnje": 2005,
                "datum_objave": "28.08.2023.",
                "opis": "Magnis diss parturient montes."
            }).then(function(n){
                return new Promise(function(resolve, reject){resolve(n);});
            })
        );
        nekretnineListaPromisea.push(
            db.nekretnina.create({
                "tip_nekretnine": "Kuća",
                "naziv": "Kuca Stup",
                "kvadratura": 220,
                "cijena": 70000,
                "tip_grijanja": "struja",
                "lokacija": "Stup",
                "godina_izgradnje": 2008,
                "datum_objave": "28.11.2023.",
                "opis": "Magnis diss parturientt montes."
            }).then(function(n){
                return new Promise(function(resolve, reject){resolve(n);});
            })
        );
    }).catch(function(err){console.log("Upiti greska "+err);});   
    });
}
