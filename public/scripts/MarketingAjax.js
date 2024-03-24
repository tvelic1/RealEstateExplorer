const MarketingAjax = (() => {

    let filtriraneNekretnineInfo = null;
    let nekretnineOsvjezavanje = null;
    let filtrirane = false;
    function impl_novoFiltriranje(listaFiltriranihNekretnina) {

        const idNekretninaArray = listaFiltriranihNekretnina.map(nekretnina => nekretnina.id);
        const ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    // Sačuvaj informacije o filtriranim nekretninama
                    filtriraneNekretnineInfo = { nizNekretnina: idNekretninaArray };
                    filtrirane = true

                } else {
                    console.log("greska u filtriranju")
                }
            }
        };

        ajax.open("POST", "http://localhost:3000/marketing/nekretnine", true);
        ajax.setRequestHeader("Content-Type", "application/json");

        const requestBody = { nizNekretnina: idNekretninaArray };
        ajax.send(JSON.stringify(requestBody));
    }

    function impl_osvjeziPretrage(divNekretnine) {
        const ajax = new XMLHttpRequest();

        setInterval(function () {
            ajax.onreadystatechange = function () {
                if (ajax.readyState == 4) {
                    if (ajax.status == 200) {
                        var jsonRez = JSON.parse(ajax.responseText);
                        if (jsonRez.nizNekretnina.length) nekretnineOsvjezavanje = jsonRez.nizNekretnina
                        nekretnineOsvjezavanje.forEach(nekretnina => {
                            const pretrageDiv = divNekretnine.querySelector(`#pretrage-${nekretnina.id}`);
                            if (pretrageDiv) {
                                pretrageDiv.textContent = `Broj pretraga: ${nekretnina.pretrage}`;
                            }
                        });
                    } else {
                        console.log("greska u osvjezi pretrage")
                    }
                }
            };

            ajax.open("POST", "http://localhost:3000/marketing/osvjezi", true);

            if (filtrirane) {
                ajax.setRequestHeader("Content-Type", "application/json");
                ajax.send(JSON.stringify(filtriraneNekretnineInfo));
            } else {
                ajax.send();
            }
            filtrirane = false
        }, 500);
    }

    function impl_osvjeziKlikove(divNekretnine) {
        const ajax = new XMLHttpRequest();

        setInterval(function () {
            ajax.onreadystatechange = function () {
                if (ajax.readyState == 4) {
                    if (ajax.status == 200) {
                        var jsonRez = JSON.parse(ajax.responseText);
                        if (jsonRez.nizNekretnina.length) nekretnineOsvjezavanje = jsonRez.nizNekretnina
                        nekretnineOsvjezavanje.forEach(nekretnina => {
                            const pretrageDiv = divNekretnine.querySelector(`#klikovi-${nekretnina.id}`);
                            if (pretrageDiv) {
                                pretrageDiv.textContent = `Broj klikova: ${nekretnina.klikovi}`;
                            }
                        });

                    } else {
                        console.log("greska u osvjezi klikove")
                    }
                }
            };

            ajax.open("POST", "http://localhost:3000/marketing/osvjezi", true);

            if (filtrirane) { //šalje samo kada je promjena inace salje prazno tijelo
                ajax.setRequestHeader("Content-Type", "application/json");
               // console.log(filtriraneNekretnineInfo)
                ajax.send(JSON.stringify(filtriraneNekretnineInfo));
            }

            else
                ajax.send();

            filtrirane = false;


        }, 500);
    }
    function impl_klikNekretnina(idNekretnine) {
        const ajax = new XMLHttpRequest();
        filtriraneNekretnineInfo = {}
        ajax.onreadystatechange = function () {
            filtriraneNekretnineInfo = { nizNekretnina: [idNekretnine] }; //osvjezi samo za kliknutu
            filtrirane = true;
        }


        ajax.open("POST", `http://localhost:3000/marketing/nekretnina/${idNekretnine}`, true);
        ajax.send();
    }

    return {
        novoFiltriranje: impl_novoFiltriranje,
        osvjeziPretrage: impl_osvjeziPretrage,
        osvjeziKlikove: impl_osvjeziKlikove,
        klikNekretnina: impl_klikNekretnina
    };
})();