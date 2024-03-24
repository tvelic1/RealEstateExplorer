const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs').promises;
const baza = require('./baza.js')

const app = express();
app.use(express.static('public'))
app.use(express.static(path.join('public', 'html')))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'nekaTajnaVrijednost',
  resave: false,
  saveUninitialized: true,

}));


async function ucitajKorisnike() {
  try {
    const Korisnici = await baza.korisnik.findAll();

    const noviKorisnici = await Promise.all(
      Array.from(Korisnici, korisnik => ({
        id: korisnik.id,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        username: korisnik.username,
        password: korisnik.password,
      }))
    );

    return noviKorisnici;
  } catch (error) {
    console.error('Greška prilikom dohvaćanja korisnika iz baze:', error);
    throw error;
  }
}


async function azurirajMeniHTML() {
  const meniPath = path.join(__dirname, 'public/html/meni.html');
  let meniHtml = await fs.readFile(meniPath, 'utf-8');
  meniHtml = meniHtml.replace('<li><a href="/prijava.html" target="_blank">Prijava</a></li>', '<li><button onclick="odjavi()">Odjava</button></li>');
  if (!meniHtml.includes('<li><a href="/profil.html" target="_blank">Profil</a></li>')) {
    meniHtml = meniHtml.replace('<ul id="glavniMeni">', '<ul id="glavniMeni"><li><a href="/profil.html" target="_blank">Profil</a></li>');
  }
  await fs.writeFile(meniPath, meniHtml, 'utf-8');
  const detaljiPath = path.join(__dirname, 'public/html/detalji.html');
  let detaljiHtml = await fs.readFile(detaljiPath, 'utf-8');
  detaljiHtml = detaljiHtml.replace('<div id="unesiUpit"></div>', '<div id="unesiUpit">  <input type="text" id="tekstUpita" placeholder="Unesite upit">  <button id="posaljiUpit">Pošalji upit</button></div>');

  await fs.writeFile(detaljiPath, detaljiHtml, 'utf-8');

}

async function azurirajMeniHTML2() {
  const meniPath = path.join(__dirname, 'public/html/meni.html');
  let meniHtml = await fs.readFile(meniPath, 'utf-8');
  if (meniHtml.includes('<li><a href="/profil.html" target="_blank">Profil</a></li>'))
    meniHtml = meniHtml.replace('<li><a href="/profil.html" target="_blank">Profil</a></li>', '');
  if (meniHtml.includes('<li><button onclick="odjavi()">Odjava</button></li>'))
    meniHtml = meniHtml.replace('<li><button onclick="odjavi()">Odjava</button></li>', '<li><a href="/prijava.html" target="_blank">Prijava</a></li>');
  await fs.writeFile(meniPath, meniHtml, 'utf-8');
  const detaljiPath = path.join(__dirname, 'public/html/detalji.html');
  let detaljiHtml = await fs.readFile(detaljiPath, 'utf-8');
  detaljiHtml = detaljiHtml.replace('<div id="unesiUpit">  <input type="text" id="tekstUpita" placeholder="Unesite upit">  <button id="posaljiUpit">Pošalji upit</button></div>', '<div id="unesiUpit"></div>');

  await fs.writeFile(detaljiPath, detaljiHtml, 'utf-8');

}

app.get('/nekretnine.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/html/nekretnine.html'));
});

app.get('/meni.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/html/meni.html'));
});

app.get('/detalji.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/html/detalji.html'));
});

app.get('/prijava.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/html/prijava.html'));
});

app.get('/profil.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/html/profil.html'));
});

async function ucitajNekretnine() {
  try {
    const Nekretnine = await baza.nekretnina.findAll();

    const noveNekretnine = await Promise.all(Nekretnine.map(async nekretnina => {
      const getupiti = await nekretnina.getUpitiNekretnina();

      const noviUpiti = [];
      getupiti.forEach(upit => {
        noviUpiti.push({
          korisnik_id: upit.KorisnikId,
          tekst_upita: upit.tekst_upita
        });
      });

      return {
        id: nekretnina.id,
        tip_nekretnine: nekretnina.tip_nekretnine,
        naziv: nekretnina.naziv,
        kvadratura: nekretnina.kvadratura,
        cijena: nekretnina.cijena,
        tip_grijanja: nekretnina.tip_grijanja,
        lokacija: nekretnina.lokacija,
        godina_izgradnje: nekretnina.godina_izgradnje,
        datum_objave: nekretnina.datum_objave,
        opis: nekretnina.opis,
        upiti: noviUpiti
      };
    }));

    return noveNekretnine;
  } catch (error) {
    throw new Error('Greška prilikom dohvata nekretnina');
  }
}


app.post('/logout', async function (req, res) {
  if (req.session.username) {
    req.session.destroy(async function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ greska: 'Greška prilikom odjave' });
      }
      await azurirajMeniHTML2();
      return res.status(200).json({ poruka: 'Uspješna odjava' });
    });
  }
  else return res.status(401).json({ greska: 'Neautorizovan pristup' });
});

app.get('/korisnik', async function (req, res) {
  if (!req.session || !req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
  else {
    const korisnici = await ucitajKorisnike();
    const korisnik = korisnici.find(user => user.id === req.session.username.id);

    if (!korisnik) {
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const { id, ime, prezime, username, password } = korisnik;
    return res.status(200).json({ id, ime, prezime, username, password });
  }
});


app.put('/korisnik', async function (req, res) {

  if (!req.session || !req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  const { ime, prezime, username, password } = req.body;
  const korisnici = await ucitajKorisnike();
  const trenutniKorisnik = korisnici.find(user => user.id === req.session.username.id);

  if (!trenutniKorisnik) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  if (ime) {
    trenutniKorisnik.ime = ime;
  }
  if (prezime) {
    trenutniKorisnik.prezime = prezime;
  }
  if (username) {
    trenutniKorisnik.username = username;
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    trenutniKorisnik.password = hashedPassword;
  }
  try {
    await baza.korisnik.update({
      ime: trenutniKorisnik.ime,
      prezime: trenutniKorisnik.prezime,
      username: trenutniKorisnik.username,
      password: trenutniKorisnik.password


    }, {
      where: { id: trenutniKorisnik.id }
    }
    )
  } catch (error) {
    console.log(error);
  }
  return res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
});
app.post('/marketing/nekretnina/:id', async function (req, res) {
  try {
    const { id } = req.params;
    try {
      let pretrage = global.treci || [];
      const indeks = pretrage.findIndex((item) => parseInt(item.id) === parseInt(id));

      if (indeks !== -1) {
        pretrage[indeks].brojKlikova++;
        await baza.treci.update({
          brojPretraga: pretrage[indeks].brojPretraga,
          brojKlikova: pretrage[indeks].brojKlikova
        },
          {
            where: { NekretninaId: pretrage[indeks].id }
          })
      } else {
        // Ako ne postoji, dodaj novi unos
        pretrage.push({ id: id, brojPretraga: 0, brojKlikova: 1 });
        const velicina = pretrage.length - 1;
        baza.treci.create({
          brojPretraga: pretrage[velicina].brojPretraga,
          brojKlikova: pretrage[velicina].brojKlikova,
          NekretninaId: pretrage[velicina].id
        })
      }

      global.treci = pretrage;
    } catch (error) {
      console.error('Greška prilikom pristupa globalnim podacima:', error);
    }
    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ greska: 'Greška prilikom ažuriranja broja klikova' });
  }
});


app.post('/upit', async function (req, res) {
  if (!req.session || !req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  const { nekretnina_id, tekst_upita } = req.body;
  const korisnici = await ucitajKorisnike();
  const trenutniKorisnik = korisnici.find(user => user.id === req.session.username.id);
  const korisnik_id = trenutniKorisnik ? trenutniKorisnik.id : null;

  if (!korisnik_id) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
  noveNekretnine=await ucitajNekretnine();
  const trenutnaNek = noveNekretnine.find(n => n.id === parseInt(nekretnina_id));
  const nek_id = trenutnaNek ? trenutnaNek.id : null;

  if (!nek_id) {
    return res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
  }
  await baza.upit.create({
    tekst_upita: tekst_upita,
    NekretninaId: nekretnina_id,
    KorisnikId: req.session.username.id
  })
  res.status(200).json({ poruka: 'Upit je uspješno dodan' });
});

app.get('/PoziviAjax.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'PoziviAjax.js'));
});

app.get('/MarketingAjax.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'MarketingAjax.js'));
});

app.post('/marketing/nekretnine', async function (req, res) {
  try {
    const { nizNekretnina } = req.body;
    await Promise.all(nizNekretnina.map(async (id) => {
      try {
        let pretrage = global.treci || [];
        const indeks = pretrage.findIndex((item) => parseInt(item.id) === parseInt(id));

        if (indeks !== -1) {
          pretrage[indeks].brojPretraga++;
          await baza.treci.update({
            brojPretraga: pretrage[indeks].brojPretraga,
            brojKlikova: pretrage[indeks].brojKlikova
          },
            {
              where: { NekretninaId: pretrage[indeks].id }
            })
        } else {
          pretrage.push({ id: id, brojPretraga: 1, brojKlikova: 0 });
          const velicina = pretrage.length - 1;
          baza.treci.create({
            brojPretraga: pretrage[velicina].brojPretraga,
            brojKlikova: pretrage[velicina].brojKlikova,
            NekretninaId: pretrage[velicina].id
          })
        }
        global.treci = pretrage;
      } catch (error) {
        console.error('Greška prilikom pristupa globalnim podacima:', error);
      }
    }));

    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ greska: 'Greška prilikom spremanja pretraga' });
  }
});
app.get('/nekretnina/:id', async function (req, res) {
  try {
    const { id } = req.params;
    const Nekretnine = await baza.nekretnina.findAll();
    const noveNekretnine = await Promise.all(Nekretnine.map(async nekretnina => {
      const getupiti = await nekretnina.getUpitiNekretnina();

      const noviUpiti = [];
      for (const u of getupiti) {
        let korisnik = await baza.korisnik.findOne({ where: { id: u.KorisnikId } });
        let korisnik_username = korisnik ? korisnik.username : null;
        noviUpiti.push({
          korisnik_username: korisnik_username,
          tekst_upita: u.tekst_upita
        });
      }

      return {
        id: nekretnina.id,
        tip_nekretnine: nekretnina.tip_nekretnine,
        naziv: nekretnina.naziv,
        kvadratura: nekretnina.kvadratura,
        cijena: nekretnina.cijena,
        tip_grijanja: nekretnina.tip_grijanja,
        lokacija: nekretnina.lokacija,
        godina_izgradnje: nekretnina.godina_izgradnje,
        datum_objave: nekretnina.datum_objave,
        opis: nekretnina.opis,
        upiti: noviUpiti
      };
    }));

    const trazenaNekretnina = noveNekretnine.find(n => n.id === parseInt(id));

    if (!trazenaNekretnina) {
      return res.status(400).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
    }

    res.status(200).json(trazenaNekretnina);
  } catch (error) {
    console.error(error);
    res.status(500).json({ greska: 'Greška prilikom dohvata nekretnine' });
  }
});


app.get('/nekretnine', async function (req, res) {
  try {
    const noveNekretnine = await ucitajNekretnine();
    res.status(200).json(noveNekretnine);
  } catch (error) {
    res.status(500).json({ greska: 'Greška prilikom dohvata nekretnina' });
  }
});

app.post('/login', async function (req, res) {
  const { username, password } = req.body;
  const korisnici = await ucitajKorisnike();
  const korisnik = korisnici.find(user => user.username === username);
  if (!korisnik) {
    return res.status(401).json({ greska: 'Neuspješna prijava' });
  }
  let id = korisnik.id;

  bcrypt.compare(password, korisnik.password, async function (err, result) {
    if (result) {
      await azurirajMeniHTML();
      req.session.username = { id, username };
      // console.log(korisnik);
      return res.status(200).json({ poruka: 'Uspješna prijava' });
    } else {
      await azurirajMeniHTML2();
      return res.status(401).json({ greska: 'Neuspješna prijava' });
    }
  });
});

app.post('/marketing/osvjezi', async function (req, res) {
  try {
    let odgovorNiz = []
   // console.log("Body ", req.body)
    if (Object.keys(req.body).length) {
      const { nizNekretnina } = req.body;
      req.session.lista = nizNekretnina;
      let pretrage = global.treci || [];
      odgovorNiz = (req.session.lista).map((id) => {
        // Pronađi pretragu za trenutni ID
        const pretraga = pretrage.find((item) => item.id === id) || { brojPretraga: 0 };
        const klikovi = pretrage.find((item) => item.id === id) || { brojKlikova: 0 };

        return {
          id: id,
          pretrage: pretraga.brojPretraga,
          klikovi: klikovi.brojKlikova
        };
      });
    }
//console.log("Odgovor ", odgovorNiz)
    const odgovorObj = { nizNekretnina: odgovorNiz };

    return res.status(200).json(odgovorObj);
  } catch (error) {
    return res.status(500).json({ greska: 'Greška prilikom dohvata broja pretraga' });
  }
});
async function ucitajTreciData() {
  try {
    const podaci = await baza.treci.findAll()
    const novi = await Promise.all(
      Array.from(podaci, podatak => ({
        idAuto: podatak.id,
        id: podatak.NekretninaId,
        brojPretraga: podatak.brojPretraga,
        brojKlikova: podatak.brojKlikova
      }))
    );

    return novi;

  } catch (error) {
    return {};
  }
}
async function startServer() {
  await azurirajMeniHTML2()
  global.treci = await ucitajTreciData();

}

startServer();


app.listen(3000, () => {
  console.log('Server je pokrenut na http://localhost:3000/');
});
