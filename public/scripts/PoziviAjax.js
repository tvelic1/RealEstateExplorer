const PoziviAjax = (() => {

    // fnCallback se u svim metodama poziva kada stigne
    // odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data,
    // error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška, poruka se prosljeđuje u error parametru
    /* callback-a, a data je tada null*/

    // vraća korisnika koji je trenutno prijavljen na sistem
    function impl_getKorisnik(fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
              
                    var jsonRez = JSON.parse(ajax.responseText);
                    fnCallback(null, jsonRez);
                } else {
                    fnCallback(ajax.statusText, null);
                }
            
        }

        ajax.open("GET", "http://localhost:3000/korisnik", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }

    function impl_getNekretninaById(nekretnina_id, fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    var jsonRez = JSON.parse(ajax.responseText);
                    fnCallback(null, jsonRez);
                } else if (ajax.status == 400) {
                    var jsonRez = JSON.parse(ajax.responseText);
                    fnCallback({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` }, null);
                } else {
                    fnCallback(ajax.statusText, null);
                }
            }
        };
    
        ajax.open("GET", `http://localhost:3000/nekretnina/${nekretnina_id}`, true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }
    
    function impl_putKorisnik(noviPodaci, fnCallback) {
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                const status = ajax.status;
                const responseText = ajax.responseText;
                if (status == 200) {
                    fnCallback(null, JSON.parse(responseText));
                } else {
                    fnCallback({ error: `Status: ${status}, Poruka: ${responseText}` }, null);
                }
            }
        };

        ajax.open('PUT', 'http://localhost:3000/korisnik', true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        const data = JSON.stringify(noviPodaci);
        ajax.send(data);
    }


    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    var jsonRez = JSON.parse(ajax.responseText);
                    fnCallback(null, jsonRez);
                } else {
                    fnCallback(ajax.statusText, null);
                }
            }
        };

        ajax.open("POST", "http://localhost:3000/upit", true);
        ajax.setRequestHeader("Content-Type", "application/json");

        let data = {
            nekretnina_id: nekretnina_id,
            tekst_upita: tekst_upita
        };

        let jsonData = JSON.stringify(data);
        ajax.send(jsonData);
    }


    function impl_getNekretnine(fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    var jsonRez = JSON.parse(ajax.responseText);
                    fnCallback(null, jsonRez);
                } else {
                    fnCallback(ajax.statusText, null);
                }
            }
        }
        ajax.open("GET", "http://localhost:3000/nekretnine", true);
        //ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }


    function impl_postLogin(username, password, fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var jsonRez = JSON.parse(ajax.responseText);
                fnCallback(null, jsonRez);
                window.location.href = '/nekretnine.html';
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText, null);
        }
        ajax.open("POST", "http://localhost:3000/login", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({ username: username, password: password }));
    }

    function impl_postLogout(fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var jsonRez = JSON.parse(ajax.responseText);
                window.top.location.assign('http://localhost:3000/prijava.html')
                location.reload(true);
                fnCallback(null, jsonRez);
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText, null);
        }

        ajax.open("POST", "http://localhost:3000/logout", true);
        //ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();

    }


    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine,
        getNekretninaById: impl_getNekretninaById
    };
})();

