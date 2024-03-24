let SpisakNekretnina = function () {
    //privatni atributi modula
    let listaNekretnina = [];
    let listaKorisnika = [];


    //implementacija metoda
    let init = function (nlistaNekretnina, nlistaKorisnika) {

        listaNekretnina = nlistaNekretnina || [];
        listaKorisnika = nlistaKorisnika || [];
    }

    let filtrirajNekretnine = function (kriterij) {
        return listaNekretnina.filter(nekretnina => {
            return Object.entries(kriterij).every(([kriterijKey, kriterijValue]) => {
                if (kriterijKey === 'tip_nekretnine') {
                    return nekretnina.tip_nekretnine === kriterijValue;
                } else if (kriterijKey === 'min_kvadratura') {
                    return nekretnina.kvadratura >= kriterijValue;
                } else if (kriterijKey === 'max_kvadratura') {
                    return nekretnina.kvadratura <= kriterijValue;
                } else if (kriterijKey === 'min_cijena') {
                    return nekretnina.cijena >= kriterijValue;
                } else if (kriterijKey === 'max_cijena') {
                    return nekretnina.cijena <= kriterijValue;
                } else {
                    return true; // Ako kriterij nije prepoznat, preskoči ga
                }
            });
        });
    }


    let ucitajDetaljeNekretnine = function (id) {
        const nekretnina = listaNekretnina.find(nek => nek.id === id);
        return nekretnina || null;
    }



    return {
        init: init,
        filtrirajNekretnine: filtrirajNekretnine,
        ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    }

};


