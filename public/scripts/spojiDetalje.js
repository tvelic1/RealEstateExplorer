let n;
function inicijaliziraj(id) {
  localStorage.ucitanaNekretnina = id;
  window.location.href = "detalji.html";
}
PoziviAjax.getKorisnik(function(error, data) {
  if(data) korisnik = data.username
})

function otvoriDetalje(nekretninaId) {
  return new Promise((resolve, reject) => {
    
      PoziviAjax.getNekretninaById(nekretninaId, function (error, nekretninaData) {
        if (error) {
          console.error('Greška prilikom dohvata podataka o nekretnini:', error);
          reject(error);
        } else {
          n = nekretninaData;
          resolve();
        }
      });
    
  });
}
let korisnik
if (window.location.pathname.includes("detalji.html")) {

    otvoriDetalje(localStorage.ucitanaNekretnina) 
    .then(() => {
     // console.log(n);
      var lijevoElement = document.querySelector('#detalji .lijevo');

      lijevoElement.querySelector('#tipGrijanja').innerText = n.tip_grijanja;
      lijevoElement.querySelector('#lokacija').innerText = n.lokacija;
      document.getElementById('naziv').innerText = n.naziv;
      document.getElementById('kvadratura').innerText = n.kvadratura;
      document.getElementById('cijena').innerText = n.cijena;
      const upitiList = document.getElementById('upitiList');
      n.upiti.forEach((upit, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <p><strong>${upit.korisnik_username}</strong></p>
          <p class="upit">${upit.tekst_upita}</p>
        `;
        upitiList.appendChild(listItem);
      });

      document.getElementById('godinaIzgradnje').innerText = n.godina_izgradnje;
      document.getElementById('opiss').innerText = n.opis;
      document.getElementById('datumObjave').innerText = n.datum_objave;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}