# Diplomat Line, sajt

Sajt agencije Diplomat Line (registracija vozila, Novi Beograd) na adresi https://diplomatline.rs.
Ovaj folder je ceo sajt: šta je ovde, to je i na internetu, sa istim rasporedom foldera.
Nema pripreme ni instalacije, fajlovi se kače takvi kakvi jesu. Nema ni servera ni baze:
forma na početnoj samo otvara WhatsApp sa već napisanom porukom.
Sve što strane koriste je u ovom folderu, i fontovi i biblioteka za animacije (GSAP), pa se ništa
ne učitava sa drugih sajtova. Jedini izuzetak je Google mapa na strani Kontakt, koja se učitava tek
kad posetilac klikne „Prikaži mapu”.

## Strane

| Strana | Adresa | Fajl |
|---|---|---|
| Početna | `/` | `index.html` |
| Registracija vozila | `/registracija-vozila/` | `registracija-vozila/index.html` |
| Prenos vlasništva vozila | `/prenos-vlasnistva-vozila/` | `prenos-vlasnistva-vozila/index.html` |
| Naplata štete od osiguranja | `/naplata-stete-od-osiguranja/` | `naplata-stete-od-osiguranja/index.html` |
| Rent a car | `/rent-a-car/` | `rent-a-car/index.html` |
| Kontakt i kako do nas | `/kontakt/` | `kontakt/index.html` |
| Politika privatnosti | `/politika-privatnosti.html` | `politika-privatnosti.html` |
| Stranica nije pronađena | svaka adresa koja ne postoji | `404.html` |

Ostalo: `css/style.css` (izgled), `css/fonts.css` (fontovi), `js/main.js` (jezik, meni, animacije,
WhatsApp poruka, kolačići, mapa), `js/gsap/` (biblioteka za animacije GSAP 3.12.5, ne menja se),
`assets/` (logo, slike i fontovi), ikonice u korenu (`favicon.ico`, `icon-192.png`, `icon-512.png`,
`apple-touch-icon.png`, `site.webmanifest`), `robots.txt` i `sitemap.xml` (za Google).
Kad dodaš stranu ili promeniš adresu, upiši to i u `sitemap.xml`.

## Tekst i prevodi

- **Srpski** je direktno u HTML-u svake strane. Naslov i opis za Google su u `<head>`.
- **Engleski** je u atributu `data-en` istog elementa: `<h3 data-en="Rent a car">Rent a car</h3>`.
- **Ruski** je u `js/main.js`, u rečniku `ruDict()`, na primer `'Kako radimo': 'Как мы работаем',`.
  Ključ (levo) je srpski tekst elementa i mora da se poklapa tačno, slovo po slovo, sa istim
  znakovima i navodnicima. Kad promeniš srpski tekst, promeni i ključ i ruski prevod,
  inače na ruskom ostaje srpski.
- Prevodi se samo element koji ima `data-en`. Dugmad SR / EN / RU postoje samo na početnoj;
  podstrane, 404 i politika privatnosti su samo na srpskom.
- Probne recenzije su sklonjene u HTML komentar (traži `RECENZIJE SKRIVENE` u `index.html` i na
  stranama registracije, naplate štete i rent a car-a). Kako se vraćaju, piše u samom komentaru.

## Boje i fontovi

Na vrhu `css/style.css`, u `:root`:

    --black              #0A0A0A         pozadina
    --ink                #F5F3EF         tekst
    --accent             #C8C6C0         zlatno-siva: linije, dugmad, naglasci
    --accent-light       #E9E7E1         svetlija varijanta
    --font-display       Space Grotesk   naslovi
    --font-body          Manrope         običan tekst
    --font-display-cyr   Golos Text      naslovi na ruskom (Space Grotesk nema ćirilicu)

Uz svaku boju stoji i `-rgb` varijanta (npr. `--accent-rgb: 200,198,192`) za providnost; menja se
zajedno sa bojom. Iste vrednosti su na par mesta upisane i direktno: odmah ispod `:root` u
`css/style.css`, u `js/main.js` (dugmad za jezik, izbor usluge u formi, traka sa menijem) i u `<style>`
delu `404.html` i `politika-privatnosti.html`. Posle izmene boje potraži staru vrednost u celom folderu.
Fontovi su u `assets/fonts/` (fajlovi `.woff2` i licence), a opisani su u `css/fonts.css`, koji je
povezan u `<head>` svake strane. Podeljeni su na delove: osnovna latinica, proširena latinica (č, ć,
š, ž, đ) i ćirilica za ruski (Space Grotesk nema ćirilicu). Pregledač preuzme samo delove čija slova
strana koristi. Za nov font ubaci njegove `.woff2` fajlove i licencu u `assets/fonts/`, opiši ih u
`css/fonts.css`, pa staro ime fonta potraži u celom folderu, kao i kod boja.

## Telefon

Broj je u svim HTML stranama i u `js/main.js`, u tri oblika. Pretraži ceo folder i zameni sva tri:

    062 350 950        tekst koji se vidi i opisi za Google
    38162350950        linkovi za poziv, WhatsApp i Viber (tel:+381..., wa.me/381..., viber ...%2B381...)
    +381 62 350 950    podaci o firmi za Google, u index.html

## Mejl

Mejl `office@diplomatline.rs` je u kontaktu na početnoj i na strani Kontakt, u futeru strana, u
podacima o firmi za Google (`index.html`) i u politici privatnosti, svuda i kao tekst i kao
`mailto:` link. Kad se menja, pretraži ceo folder i zameni svuda.

## Slike

- `assets/photos/hero.webp`: fotografija na vrhu početne, uspravna, 1600 x 2166 px. Nova ide pod istim
  imenom; ako ima druge dimenzije, upiši ih u `width` i `height` tog `<img>` u `index.html`.
- `assets/og-image.jpg`: slika koja se pojavi kad neko podeli link sajta (WhatsApp, Viber, Facebook),
  tačno 1200 x 630 px.
- `assets/diplomat-line-logo.webp`: logo, koristi se na svim stranama.
- Video na vrhu početne nije uključen, prikazuje se samo fotografija. Samo dodavanje fajla
  `assets/video/hero.mp4` ne bi ništa promenilo.

## Mapa na strani Kontakt

Google mapa se ne učitava sama. Na njenom mestu je dugme „Prikaži mapu”, a mapa se učita tek na
klik (`setupMap()` u `js/main.js`), pa se pregledač posetioca koji ne klikne ne povezuje ni sa
jednim Google-ovim serverom. Klik na dugme se ne pamti.
Dugme i napomena ispod njega pojave se tek kad proradi `js/main.js`. Ako ne proradi (ili je
JavaScript isključen), ostaju adresa i link „Otvori u Google mapama”.

Sama mapa (`<iframe>`) je u `kontakt/index.html`, unutar `<template data-map-frame>`, i odatle se
ne učitava dok je JavaScript ne ubaci u stranu. Na tom `<iframe>` ostaje
`referrerpolicy="strict-origin-when-cross-origin"`, pa Google dobija samo adresu sajta, a ne celu
adresu strane. Kod za ugradnju koji daju Google mape ima `no-referrer-when-downgrade`, pa ako ga
lepiš ponovo, vrati ovu vrednost. Ovakvo učitavanje mape opisano je i u politici privatnosti (deo
„Google mapa na strani Kontakt”), pa ako ga promeniš, promeni i taj deo.

Ako se promeni adresa lokala, kod mape upiši novu u `src` (posle `q=`) i u `title` tog `<iframe>` i
u tekst iznad dugmeta, a link „Otvori u Google mapama” ispod mape zameni novim. Adresa i taj link
(`maps.app.goo.gl/...`) stoje i na drugim mestima na sajtu, pa ih potraži u celom folderu i zameni
svuda. Adresu traži po kućnom broju (`123e`), jer nije svuda napisana isto, a u `src` je kodirana
(npr. Đ je `%C4%90`, razmak `%20`).

## Podešavanja na vrhu `js/main.js`

    defaultLang                   'sr' | 'en' | 'ru', jezik kad se otvori početna
    grain, customCursor, mirno    sami se podese prema klasi mirno

Klasa `mirno` na `<html>` (početna i podstrane) je izabrani miran izgled: bez uvodnog ekrana,
filmskog zrna, kruga umesto kursora, linije za skrol, magnetnih dugmadi i WhatsApp prozora koji sam
iskače, a veliki naslov na vrhu je običnim slovima. Ako se klasa skloni sa strane, na njoj se ti
efekti vraćaju.

## Pregled na računaru

Podstrane koriste putanje od korena sajta (`/css/style.css`, `/js/main.js`, `/assets/...`), pa
otvorene duplim klikom ostaju bez izgleda. Zato se pokreće mali web server u kom je ovaj folder
koren. U folderu `site` otkucaj:

    python -m http.server 8000

pa otvori http://localhost:8000.

## Objavljivanje

- Sajt je na GitHub Pages, na pravom domenu diplomatline.rs. Adrese `https://diplomatline.rs/...`
  u `<head>`, u podacima za Google, u `sitemap.xml` i `robots.txt` su tačne i ne menjaju se.
- U koren GitHub repozitorijuma ide ceo sadržaj ovog foldera, sa svim podfolderima, u istom rasporedu.
  Na sajtu GitHub-a (Add file, pa Upload files) sve se prevlači mišem; preko „choose your files”
  se gube podfolderi.
- Fajl `CNAME` (u njemu piše `diplomatline.rs`) vezuje domen za sajt i mora da ostane u korenu
  repozitorijuma. Ako ga nema u folderu koji kačiš, ne briši onaj na GitHub-u. Ne briši ni `.nojekyll`.
- Sajt se osveži 1 do 2 minuta posle kačenja.
