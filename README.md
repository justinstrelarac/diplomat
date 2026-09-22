# Diplomat Line

Statični sajt. Nema build koraka, nema zavisnosti za instalaciju.
Otvori `index.html` u pregledaču ili postavi ceo folder na hosting.

## Struktura

    index.html              sav sadržaj (tekst, sekcije, SEO)
    css/style.css           boje, fontovi, responzivnost
    js/main.js              animacije, jezik, forma, meni
    assets/
      diplomat-line-logo-white.png
      og-image.jpg          slika za deljenje na mrežama
      photos/               fotografije + README sa opisom
    robots.txt, sitemap.xml
    .nojekyll               potrebno za GitHub Pages

## Gde se šta menja

**Tekst na sajtu** je u `index.html`. Svaki element ima i prevode:
`data-en="..."` je engleski, ruski je u `js/main.js` u rečniku `RU`.
Ako menjaš srpski tekst, promeni ga na sva tri mesta ili prevod neće raditi.

**Boje** su u `css/style.css`, na samom vrhu, u `:root`:

    --black         pozadina
    --ink           tekst
    --accent        zlatno-siva, linije i naglasci
    --accent-light  svetlija varijanta

Uz svaku boju stoji i `-rgb` varijanta (npr. `--accent-rgb: 200,198,192`)
koja se koristi za providnost. Ako menjaš boju, promeni i nju.

**Fontovi** su odmah ispod boja: `--font-display` (naslovi),
`--font-body` (telo), `--font-display-cyr` (ruska verzija).
Učitavaju se sa Google Fonts, link je u `<head>`.

**Telefon** se menja pretragom `062 350 950` i `38162350950`
u `index.html` i `js/main.js`.

## Fotografije

Zameni fajlove u `assets/photos/` istim imenima. Opis šta ide gde je u
`assets/photos/README.txt`. `kontakt-osoba.jpg` je i dalje placeholder.

Za video u heroju: dodaj `assets/video/hero.mp4` i pustiće se sam preko
fotografije. Ako ga nema, ostaje fotografija.

## Podešavanja

Na vrhu `js/main.js`:

    defaultLang     'sr' | 'en' | 'ru'
    grain           filmsko zrno preko crne
    customCursor    svetli kurzor na desktopu

## Pre objave

U `index.html` zameni `https://diplomatline.rs/` pravim domenom
(pojavljuje se u canonical, og:url, og:image i JSON-LD bloku),
i isto u `sitemap.xml` i `robots.txt`.

## Prelomne tačke

1200 / 1100 / 992 / 768 / 540 / 480 / 380 px.
Hamburger meni se uključuje na 992px.
