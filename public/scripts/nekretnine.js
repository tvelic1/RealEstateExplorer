function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {

    const filtriraneNekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });

    const divElement = divReferenca;
    const html = ` <p class="nazivi">${tip_nekretnine}</p>
        <div  id="lista-nekretnina" class="nekretnine-container">
            ${filtriraneNekretnine.map(nekretnina => `
                <div class="nekretnina" id="${nekretnina.id}">
                    <img id="img-${nekretnina.id}" src="../slike/stan1.jpg" alt="Stan 1">
                    <p class="naziv">${nekretnina.naziv}</p>
                    <p class="kvadratura">${nekretnina.kvadratura}m2</p>
                    <p class="cijena">${nekretnina.cijena}KM</p>
                    <button class="detalji" id="detalji-${nekretnina.id}" onclick="povecaj(${nekretnina.id})">Detalji</button>
                    <div class="x-${nekretnina.id}" id="pretrage-${nekretnina.id}"></div>
                    <div id="klikovi-${nekretnina.id}"></div>  <div id="novipodaci-${nekretnina.id}"></div>               </div>
            `).join("")}
        </div>
    `;

    if (divElement) { divElement.innerHTML = html; }
}
let brojKlikovaDetalji = 0

function povecaj(id) {
    let m = MarketingAjax
    nekretnine.init(listaNekretnina, listaKorisnika);
    const noviPodaciDiv = document.getElementById(`novipodaci-${id}`);
    

    const divNekretnina = document.getElementById(id);
    divNekretnina.style.gridColumn = 'span 2';

    // Provjera da li je neka druga nekretnina već povećana
    const sveNekretnine = document.querySelectorAll('.nekretnina');
    sveNekretnine.forEach(divNekretnina => {
        if (divNekretnina.id !== id) {
            divNekretnina.style.width = "";
            divNekretnina.style.gridColumn = 'span 1';
            document.getElementById(`novipodaci-${divNekretnina.id}`).innerHTML = "";

           
        }
    });

    if (!divNekretnina.style.width || parseFloat(divNekretnina.style.width) < 500) {
        divNekretnina.style.width = "500px";
        divNekretnina.style.gridColumn = 'span 2';
        brojKlikovaDetalji++;
        const nekretnina = listaNekretnina.find(nekretnina => nekretnina.id === id);
        const lokacijaTekst = nekretnina?.lokacija || "Nepoznato";
        const godinaIzgradnjeTekst = nekretnina?.godina_izgradnje || "Nepoznato";
        
        const otvoriButton = document.createElement('button');
        otvoriButton.id = `otv-${id}`;
        otvoriButton.className="detalji"
        otvoriButton.innerText = 'Otvori detalje';
        otvoriButton.addEventListener('click', function() {
            inicijaliziraj(id);
        });

        noviPodaciDiv.innerHTML = `
            Lokacija: ${lokacijaTekst}<br>
            Godina izgradnje: ${godinaIzgradnjeTekst}<br>
        `;
        noviPodaciDiv.appendChild(otvoriButton);
    } else {
        divNekretnina.style.width = "";
        divNekretnina.style.gridColumn = 'span 1';
        brojKlikovaDetalji = 0; 

    }

    m.klikNekretnina(id);
    
}


const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");


const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
},
{
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2",
}]

let listaNekretnina

const nekretnine = SpisakNekretnina();
let a = PoziviAjax
a.getNekretnine(function (error, data) {
    if (error) console.log(error)
    else {
        listaNekretnina = data;
        nekretnine.init(data, listaKorisnika); 
        spojiNekretnine(divStan, nekretnine, "Stan");
        spojiNekretnine(divKuca, nekretnine, "Kuća");
        spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
    }
})

document.getElementById("filtriranje").addEventListener("click", function () {
    const minCijena = document.getElementById("min_cijena").value;
    const maxCijena = document.getElementById("max_cijena").value;
    const minKvadratura = document.getElementById("min_kvadratura").value;
    const maxKvadratura = document.getElementById("max_kvadratura").value;

    const kriterij = {};

    if (minCijena) kriterij['min_cijena'] = parseFloat(minCijena);
    if (maxCijena) kriterij['max_cijena'] = parseFloat(maxCijena);
    if (minKvadratura) kriterij['min_kvadratura'] = parseFloat(minKvadratura);
    if (maxKvadratura) kriterij['max_kvadratura'] = parseFloat(maxKvadratura);
    nekretnine.init(listaNekretnina, listaKorisnika)
    let m = MarketingAjax
    const filtriraneNekretnine = nekretnine.filtrirajNekretnine(kriterij)
    m.novoFiltriranje(filtriraneNekretnine)

    nekretnine.init(filtriraneNekretnine, listaKorisnika)
    // Poziv metode za filtriranje
    spojiNekretnine(divStan, nekretnine, "Stan");
    spojiNekretnine(divKuca, nekretnine, "Kuća");
    spojiNekretnine(divPp, nekretnine, "Poslovni prostor");

});
window.onload = async function () {
    PoziviAjax.getNekretnine(async function(error, data){
        if(error) { console.log("error u get nekretnine", error)
        }
        else {
          //listaNekretnina = data;
          nekretnine.init(data, listaKorisnika);
          //pozivanje funkcije
          spojiNekretnine(divStan, nekretnine, "Stan");
          spojiNekretnine(divKuca, nekretnine, "Kuća");
          spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
          MarketingAjax.novoFiltriranje(listaNekretnina)
          const divNekretnina = document.getElementById("kontejner");
          MarketingAjax.osvjeziKlikove(divNekretnina);
          MarketingAjax.osvjeziPretrage(divNekretnina);
        }
      });

    }


