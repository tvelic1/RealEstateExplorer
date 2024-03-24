function posaljiUpitClick() {
    var tekstUpita = document.getElementById('tekstUpita').value;
    let korisnik
    PoziviAjax.getKorisnik(function(error, data) {
        if(data) korisnik = data.username
    })
    PoziviAjax.postUpit(localStorage.ucitanaNekretnina, tekstUpita, function(error, data) {
        if(data) {
            const upitiList = document.getElementById('upitiList');

            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p><strong>${korisnik}</strong></p>
                <p class="upit">${tekstUpita}</p>
            `;
            upitiList.appendChild(listItem);

            document.getElementById('tekstUpita').value = '';
        }
        else console.log("ne valja")
    })
}

document.getElementById('posaljiUpit').addEventListener('click', posaljiUpitClick);
