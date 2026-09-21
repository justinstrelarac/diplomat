/* ============================================================
   Diplomat Line, main.js
   Zahteva: gsap, ScrollTrigger, Lenis (učitani PRE ovog fajla).
   ============================================================ */
(function () {
  'use strict';

  /* Podešavanja sajta */
  var CONFIG = {
    defaultLang: 'sr',   // 'sr' | 'en' | 'ru', jezik na prvom učitavanju
    grain: true,         // filmsko zrno preko crne
    customCursor: true   // svetli kurzor na desktopu
  };

  class DiplomatLine {
    init() {
      this.root = document.querySelector('[data-header]')?.closest('div') || document;
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.cleanups = [];
      this.triggers = [];
      this.setupLang();
      this.setupGrainAndCursor();
      this.setupHeader();
      this.setupWaFloat();
      this.setupLoader();
      this.setupNav();
      this.setupForm();
      this.setupChips();
      this.setupCookieBar();
      this.setupHeroVideo();
      this.waitFor(() => window.gsap && window.ScrollTrigger, () => this.setupMotion());
    }

    destroy() {
      this.cleanups.forEach(fn => { try { fn(); } catch (e) {} });
      (this.triggers || []).forEach(t => { try { t.kill(); } catch (e) {} });
      if (this.lenis) this.lenis.destroy();
      if (this.raf) cancelAnimationFrame(this.raf);
    }

    waitFor(test, run, tries = 90) {
      if (test()) return run();
      if (tries <= 0) return;
      setTimeout(() => this.waitFor(test, run, tries - 1), 100);
    }

    on(el, ev, fn, opts) {
      el.addEventListener(ev, fn, opts);
      this.cleanups.push(() => el.removeEventListener(ev, fn, opts));
    }

    /* ── SR / EN prekidač: srpski je u markupu, engleski u data-en atributima.
       Menjamo tekst direktno u DOM-u da se sadržaj iscrta odmah, bez čekanja na JS. ── */
    setupLang() {
      const RU = this.ruDict();
      const nodes = Array.from(document.querySelectorAll('[data-en]'));
      nodes.forEach(n => { if (!n.dataset.sr) n.dataset.sr = n.innerHTML; });
      const btns = Array.from(document.querySelectorAll('[data-lang]'));
      const ruFor = (sr) => {
        const key = sr.trim();
        const hit = RU[key];
        if (hit === undefined) return sr;
        const lead = sr.slice(0, sr.indexOf(key[0]));
        const tail = sr.slice(sr.lastIndexOf(key[key.length - 1]) + 1);
        return lead + hit + tail;
      };
      const apply = (lang) => {
        nodes.forEach(n => {
          n.innerHTML = lang === 'en' ? n.dataset.en : (lang === 'ru' ? ruFor(n.dataset.sr) : n.dataset.sr);
        });
        document.documentElement.lang = lang === 'en' ? 'en' : (lang === 'ru' ? 'ru' : 'sr');
        btns.forEach(b => {
          const active = b.dataset.lang === lang;
          b.style.background = active ? '#C8C6C0' : 'transparent';
          b.style.color = active ? '#0A0A0A' : 'rgba(245,243,239,.6)';
          b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        this.paintPreview();
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      };
      btns.forEach(b => this.on(b, 'click', () => apply(b.dataset.lang)));
      const start = ['en', 'ru'].indexOf(CONFIG.defaultLang) > -1 ? CONFIG.defaultLang : 'sr';
      apply(start);
    }

    /* Ruski prevod, ključ je srpski tekst iz markupa. Tekst se menja samo na klik. */
    ruDict() {
      return {
        'Usluge': 'Услуги',
        'Kako radimo': 'Как мы работаем',
        'Zašto mi': 'Почему мы',
        'Kontakt': 'Контакт',
        'Klijenti': 'Клиенты',
        'Problem': 'Проблема',
        'P.S.': 'P.S.',

        'Beograd · auto-administracija': 'Белград · автомобильная администрация',
        'Sve rešavamo': 'Мы решаем всё',
        'umesto vas': 'вместо вас',
        'Registracija, osiguranje, rent a car, naplata štete. Ti predaš ključeve, dalje je naša stvar.': 'Регистрация, страхование, таможня, аренда авто, взыскание ущерба. Вы отдаёте ключи, остальное наша забота.',
        'Pozovi 062 350 950': 'Позвоните 062 350 950',
        'Pošalji upit': 'Отправить запрос',
        'Otvara WhatsApp sa već napisanom porukom. Pročitaj je pre nego što pošalješ.': 'Открывает WhatsApp с уже готовым сообщением. Прочитайте его перед отправкой.',

        'Red pred šalterom se ne pomera.': 'Очередь у окошка не двигается.',
        'Tvoj': 'Ваш',
        'dan se troši': 'день уходит',
        'Registracija ističe u petak. Na tehničkom je red, polisa je negde u fioci, šalter radi do tri, a ti imaš svoj posao. Onda ti kažu da fali jedan papir i sve počinje ispočetka sutra.': 'Регистрация истекает в пятницу. На техосмотре очередь, полис где-то в ящике, окошко работает до трёх, а у вас своя работа. Потом говорят, что не хватает одной бумаги, и завтра всё начинается заново.',
        'Taj dan poznajemo. Trošimo ga mi, umesto tebe.': 'Этот день нам знаком. Мы тратим его вместо вас.',
        '„Mi stojimo u redu i popunjavamo dokumentaciju, kako vi ne biste morali.”': '«Мы стоим в очереди и заполняем документы, чтобы вам не приходилось.»',

        'Četiri stvari koje': 'Четыре вещи, которые',
        'radimo za tebe': 'мы делаем за вас',
        'Ništa više od toga. Ova četiri radimo kako treba.': 'Ничего больше. Эти четыре делаем как надо.',

        'Registracija vozila': 'Регистрация автомобиля',
        'Prva registracija, produženje, prenos na novog vlasnika, probne tablice. Nosimo dokumenta, čekamo u redu, vraćamo saobraćajnu.': 'Первая регистрация, продление, перевод на нового владельца, транзитные номера. Мы берём документы, стоим в очереди, привозим техпаспорт.',
        'Osiguranje i kasko': 'Страхование и каско',
        'Obavezno, kasko, zelena karta. Uporedimo ponude više kuća i kažemo ti šta za tvoj auto ima smisla, a šta ne.': 'ОСАГО, каско, зелёная карта. Сравниваем предложения нескольких компаний и говорим, что для вашего автомобиля имеет смысл, а что нет.',
        'Rent a car': 'Аренда авто',
        'Zamensko vozilo dok tvoj stoji u servisu ili na tehničkom. Dostava na adresu, preuzimanje sa adrese.': 'Подменный автомобиль, пока ваш стоит в сервисе или на таможне. Доставка по адресу, забираем с адреса.',
        'Naplata štete od osiguranja': 'Взыскание ущерба со страховой',
        'Posle udesa u kome nisi kriv. Ti popuniš Evropski izveštaj. Mi preuzimamo ostale korake: procenu, prijavu, isplatu, servis.': 'После ДТП, в котором вы не виноваты. Вы заполняете европротокол. Остальные шаги берём мы, оценка, заявление, выплата, сервис.',

        'Beograd': 'Белград',
        'Registracija': 'Регистрация',
        'Osiguranje i kasko': 'Страхование и каско',
        'Naplata štete': 'Взыскание ущерба',
        'Najviše posla': 'Больше всего работы',
        'Partnerstvo': 'Партнёрство',
        'Piši nam na WhatsApp': 'Напишите нам в WhatsApp',
        'Tu smo na WhatsAppu': 'Мы на связи в WhatsApp',
        'Pošalji registarsku oznaku i rok. Cenu i datum dobijaš isti dan, bez poziva i bez čekanja na šalteru.': 'Пришлите номер и срок. Цену и дату получите в тот же день, без звонков и без ожидания в окошке.',
        'Otvori prepisku': 'Открыть переписку',
        'Preskoči na sadržaj': 'Перейти к содержанию',
        'Piši nam': 'Напишите нам',
        'odgovaramo isti dan': 'отвечаем в тот же день',
        'Šta ti treba?': 'Что вам нужно?',
        'Koji auto i do kada': 'Какой автомобиль и до какого срока',
        'Ovako izgleda poruka:': 'Так выглядит сообщение:',
        'Otvori WhatsApp': 'Открыть WhatsApp',
        'Poruka se otvara u WhatsAppu sa već napisanim tekstom. Ti je pošalješ.': 'Сообщение откроется в WhatsApp с готовым текстом. Отправляете его сами.',
        'Koristimo samo kolačiće koji su potrebni da sajt radi.': 'Мы используем только те файлы cookie, которые нужны для работы сайта.',
        'Odbij': 'Отклонить',
        'Prihvati': 'Принять',
        '„Dok mi je auto bio u servisu, dobio sam zamensko na adresu za dva sata. Nisam ni tražio, sami su ponudili.”': '«Пока мой автомобиль был в сервисе, подменный привезли по адресу за два часа. Я даже не просил, предложили сами.»',
        'Registracija i tehnički pregled': 'Регистрация и техосмотр',
        'Registracija ističe?': 'Регистрация истекает?',
        'To je': 'Это',
        'jedan poziv': 'один звонок',
        'Ovo je najveći deo našeg posla. Produženje, prva registracija, prenos na novog vlasnika, sa tehničkim pregledom i polisom istog dana, bez da ti izlaziš iz kancelarije.': 'Это большая часть нашей работы. Продление, первая регистрация, перевод на нового владельца, с техосмотром и полисом в тот же день, без того чтобы вы выходили из офиса.',
        'Ako ti rok ističe ove nedelje, javi se danas. Ne mora da bude gotovo sutra. Može danas.': 'Если срок истекает на этой неделе, позвоните сегодня. Не обязательно готово завтра, может быть готово сегодня.',
        'Mi sređujemo:': 'Мы улаживаем:',
        'Tehnički pregled': 'Техосмотр',
        'Osiguranje i polisu': 'Страхование и полис',
        'Šaltere i takse': 'Окошки и сборы',
        'Saobraćajnu u ruke': 'Техпаспорт в руки',
        'Ti predaš ključeve i staru saobraćajnu. Ništa više.': 'Вы отдаёте ключи и старый техпаспорт. Больше ничего.',
        'Registracija': 'Регистрация',
        'Registrovanog': 'Зарегистрированным',
        'Osiguranog': 'Застрахованным',
        'Spremnog za vožnju': 'Готовым к поездке',
        'Ti dolaziš po ključeve.': 'Вы приезжаете за ключами.',

        'Četiri koraka. Tri su': 'Четыре шага. Три из них',
        'naša': 'наши',
        'Javiš se': 'Вы связываетесь с нами',
        'Jedan poziv ili jedna poruka na Instagramu. Kažeš koji je auto i šta mu treba. Cenu i rok saznaješ odmah.': 'Один звонок или одно сообщение в Instagram. Говорите, какой автомобиль и что ему нужно. Цену и срок узнаёте сразу.',
        'Predaš ključeve i dokumenta': 'Отдаёте ключи и документы',
        'U Beogradu, gde ti je zgodnije. Možemo i da preuzmemo na tvojoj adresi. Od tog trenutka nemaš više šta da radiš.': 'В Белграде, где вам удобнее. Можем забрать и по вашему адресу. С этого момента вам больше нечего делать.',
        'Mi stojimo u redovima i sređujemo sve': 'Мы стоим в очередях и всё улаживаем',
        'Tehnički, osiguranje, šalteri, pečati. Ako nešto fali, rešavamo sami i javljamo ti kad je rešeno.': 'Техосмотр, страхование, окошки, печати. Если чего-то не хватает, решаем сами и сообщаем, когда готово.',
        'Dobiješ gotovo': 'Получаете готовое',
        'Ključevi, saobraćajna, polisa, računi. U ruke, bez čekanja. To je cela tvoja obaveza.': 'Ключи, техпаспорт, полис, счета. В руки, без ожидания. Это вся ваша обязанность.',

        'Zašto nam ljudi daju': 'Почему люди отдают нам',
        'svoje ključeve': 'свои ключи',
        'usluga': 'услуг',
        'poziv': 'звонок',
        'Čovek, a ne šalter': 'Человек, а не окошко',
        'Imaš jedan broj i jednog čoveka koji zna gde je tvoj slučaj. Bez brojeva pod kojima si zaveden i bez „javite se sutra”.': 'У вас один номер и один человек, который знает, где ваше дело. Без номеров в системе и без «позвоните завтра».',
        'Uz BG Diplomat': 'Вместе с BG Diplomat',
        'Isti tim koji u BG Diplomatu vozi klijente radi i tvoju administraciju. Same team, same standards.': 'Та же команда, которая в BG Diplomat возит клиентов, ведёт и вашу администрацию. Same team, same standards.',
        'bgdiplomat.com': 'bgdiplomat.com',
        'Rutina, ne improvizacija': 'Рутина, а не импровизация',
        'Znamo koji red se kad kreće, koji papir gde treba i šta se gleda pre tehničkog. Zato nam treba dan, a tebi bi nedelja.': 'Знаем, какая очередь когда двигается, какая бумага где нужна и что смотрят перед техосмотром. Поэтому нам нужен день, а вам понадобилась бы неделя.',
        'Cenu dogovaramo pre, ne posle.': 'Цену согласовываем до, а не после.',
        'Bez skrivenih troškova i bez „iskrslo je još nešto”.': 'Без скрытых расходов и без «появилось ещё кое-что».',

        'Zovi nas': 'Звоните нам',
        'kada': 'когда',
        'Registracija ističe ove nedelje, a ne znaš gde ti je stara polisa.': 'Регистрация истекает на этой неделе, а вы не знаете, где старый полис.',
        'Kupio si auto i treba prenos na tvoje ime.': 'Купили автомобиль, и нужен перевод на ваше имя.',
        'Auto ti je pao na tehničkom, pa treba popravka i ponovni izlazak.': 'Автомобиль не прошёл техосмотр, нужен ремонт и повторный визит.',
        'Neko te je udario, ti nisi kriv, i sad te šalju od šaltera do šaltera.': 'Вас ударили, вы не виноваты, и теперь вас отправляют от окошка к окошку.',
        'Treba ti zamensko vozilo za nedelju dana.': 'Нужен подменный автомобиль на неделю.',
        'Nemaš vremena. To je dovoljan razlog.': 'У вас нет времени. Это достаточная причина.',

        'Placeholder izjave, zameniti pravim rečima klijenata.': 'Placeholder-отзывы, заменить реальными словами клиентов.',
        '„Registracija mi je istekla u petak popodne. U ponedeljak sam imao saobraćajnu u ruci, a nisam izašao iz kancelarije.”': '«Регистрация истекла в пятницу днём. В понедельник техпаспорт был у меня в руках, и я не выходил из офиса.»',
        '„Auto mi je pao na tehničkom. Oni su odradili popravku i ponovni izlazak. Ja sam samo došao po ključeve.”': '«Автомобиль купил в Мюнхене. Не ездил ни на таможню, ни в МВД. Привезли зарегистрированным.»',
        '„Posle udesa sam samo popunio Evropski. Ostalo su oni naplatili. Osiguranje nisam zvao ni jednom.”': '«После ДТП я только заполнил европротокол. Остальное они взыскали. В страховую не звонил ни разу.»',

        'Registracija ne čeka. Vožnja sa isteklim tablicama je prekršaj i naplaćuje se, ali najviše te košta dan koji posle izgubiš da to središ. Ako ti rok pada ovog meseca, jedan poziv danas rešava stvar.': 'Регистрация не ждёт. Езда с истекшими номерами, нарушение, и за него штрафуют, но дороже всего вам обойдётся день, потерянный потом на оформление. Если срок приходится на этот месяц, один звонок сегодня решает дело.',
        'Predaj': 'Отдайте',
        'ključeve': 'ключи',
        'Pozovi, ili nam piši na WhatsApp i reci šta autu treba. Odgovaramo isti dan i kažemo cenu i rok.': 'Позвоните или напишите нам в WhatsApp, скажите, что нужно автомобилю. Отвечаем в тот же день и говорим цену и срок.',
        'Usluga': 'Услуга',


        '„Mi rešavamo sve, umesto vas.”': '«Мы решаем всё, вместо вас.»',
        'Auto-administracija · Beograd': 'Автомобильная администрация · Белград'
      };
    }

    setupGrainAndCursor() {
      const grain = document.querySelector('[data-grain]');
      if (grain && CONFIG.grain === false) grain.style.display = 'none';
      if (grain && this.reduced) grain.style.animation = 'none';

      const cur = document.querySelector('[data-cursor]');
      if (!cur) return;
      const fine = window.matchMedia('(pointer: fine)').matches;
      if (!fine || CONFIG.customCursor === false) { cur.style.display = 'none'; return; }
      let x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y;
      this.on(window, 'mousemove', (e) => {
        tx = e.clientX; ty = e.clientY;
        cur.style.opacity = '1';
        const hot = e.target.closest('a,button,[data-card],input,textarea,select,image-slot');
        cur.style.width = hot ? '58px' : '34px';
        cur.style.height = hot ? '58px' : '34px';
        cur.style.margin = hot ? '-29px 0 0 -29px' : '-17px 0 0 -17px';
        cur.style.backgroundColor = hot ? 'rgba(200,198,192,.12)' : 'transparent';
      });
      this.on(document, 'mouseleave', () => { cur.style.opacity = '0'; });
      const loop = () => {
        x += (tx - x) * 0.18; y += (ty - y) * 0.18;
        cur.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
        this.raf = requestAnimationFrame(loop);
      };
      loop();
    }

    /* Kad hero prođe: prvo prozor sa pozivom (5s, sa otkucavanjem), pa plutajuće dugme.
       X u prozoru preskače odmah na dugme. */
    setupWaFloat() {
      const wa = document.querySelector('[data-wa-float]');
      const card = document.querySelector('[data-wa-card]');
      const bar = document.querySelector('[data-wa-bar]');
      const hero = document.querySelector('#top');
      if (!wa || !hero) return;

      const vis = (el, on, y) => {
        if (!el) return;
        el.style.opacity = on ? '1' : '0';
        el.style.visibility = on ? 'visible' : 'hidden';
        el.style.transform = on ? 'translateY(0)' : 'translateY(' + y + 'px)';
        el.setAttribute('aria-hidden', on ? 'false' : 'true');
        el.querySelectorAll('a,button').forEach(f => f.setAttribute('tabindex', on ? '0' : '-1'));
        if (el === wa) el.setAttribute('tabindex', on ? '0' : '-1');
      };

      vis(wa, false, 14);
      vis(card, false, 16);
      let phase = 'pre';   // pre → card → float
      let timer = null;

      const toFloat = () => {
        if (timer) { clearTimeout(timer); timer = null; }
        phase = 'float';
        vis(card, false, 16);
        vis(wa, true, 14);
      };

      const openCard = () => {
        phase = 'card';
        vis(card, true, 16);
        if (bar) {
          bar.style.transition = 'none';
          bar.style.width = '100%';
          requestAnimationFrame(() => {
            bar.style.transition = 'width 15s linear';
            bar.style.width = '0%';
          });
        }
        timer = setTimeout(toFloat, 15000);
      };

      const closeBtn = card && card.querySelector('[data-wa-close]');
      if (closeBtn) this.on(closeBtn, 'click', toFloat);
      // klik na "Otvori prepisku" takođe prelazi na dugme
      const cardLink = card && card.querySelector('a');
      if (cardLink) this.on(cardLink, 'click', toFloat);

      const onScroll = () => {
        const passed = window.scrollY > hero.offsetHeight * 0.75;
        if (passed && phase === 'pre') { if (this.reduced) toFloat(); else openCard(); }
        if (!passed && phase === 'float') { vis(wa, false, 14); phase = 'pre'; }
      };
      this.on(window, 'scroll', onScroll, { passive: true });
      onScroll();
    }

    setupHeader() {
      const header = document.querySelector('[data-header]');
      if (!header) return;
      const onScroll = () => {
        const past = window.scrollY > 40;
        header.style.backgroundColor = past ? 'rgba(10,10,10,.82)' : 'transparent';
        header.style.backdropFilter = past ? 'blur(14px)' : 'none';
        header.style.webkitBackdropFilter = past ? 'blur(14px)' : 'none';
        header.style.borderBottomColor = past ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,0)';
        header.style.paddingTop = past ? '10px' : '16px';
        header.style.paddingBottom = past ? '10px' : '16px';
      };
      this.on(window, 'scroll', onScroll, { passive: true });
      onScroll();
    }

    /* Čipovi za izbor usluge, vrednost ide u skriveni input, pa i u WhatsApp poruku */
    setupChips() {
      const chips = Array.from(document.querySelectorAll('[data-chip]'));
      const field = document.querySelector('input[name="usluga"]');
      if (!chips.length || !field) return;
      const sync = () => {
        const picked = [];
        chips.forEach(c => {
          const on = c.dataset.on === '1';
          c.style.background = on ? 'rgba(200,198,192,.16)' : 'rgba(0,0,0,.3)';
          c.style.borderColor = on ? 'rgba(200,198,192,.75)' : 'rgba(255,255,255,.15)';
          c.style.color = on ? '#E9E7E1' : 'rgba(245,243,239,.75)';
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
          if (on) picked.push(c.textContent.trim());
        });
        field.value = picked.join(', ');
      };
      chips.forEach(c => {
        c.dataset.on = '0';
        this.on(c, 'click', () => { c.dataset.on = c.dataset.on === '1' ? '0' : '1'; sync(); });
      });
      sync();
    }

    /* Video se učitava samo ako fajl postoji, inače ostaje poster (hero.jpg),
       bez greške u konzoli. Putanja je u data-src atributu. */
    /* Video se prikazuje tek kad počne da svira, do tada stoji fotografija. */
    setupHeroVideo() {
      const v = document.querySelector('[data-hero-video]');
      if (!v || !v.dataset.src || this.reduced) return;
      fetch(v.dataset.src, { method: 'HEAD' })
        .then(r => {
          if (!r.ok) return;
          v.src = v.dataset.src;
          v.addEventListener('playing', () => { v.style.opacity = '1'; }, { once: true });
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        })
        .catch(() => {});
    }

    setupCookieBar() {
      const bar = document.querySelector('[data-cookiebar]');
      if (!bar) return;
      let seen = null;
      try { seen = window.localStorage.getItem('dl-cookies'); } catch (e) { seen = 'skip'; }
      if (seen) return;
      setTimeout(() => { bar.style.display = 'flex'; }, 1200);
      bar.querySelectorAll('[data-cookie]').forEach(btn => {
        this.on(btn, 'click', () => {
          try { window.localStorage.setItem('dl-cookies', btn.dataset.cookie); } catch (e) {}
          bar.style.display = 'none';
        });
      });
    }

    /* Poruka se sastavlja iz čipova i opisa; isti tekst ide u pregled i u WhatsApp. */
    waMessage() {
      const form = document.querySelector('[data-form]');
      if (!form) return '';
      const lang = document.documentElement.lang;
      const t = {
        sr: { hi: 'Zdravo, treba mi:', car: '', empty: 'Zdravo, treba mi pomoć oko vozila.' },
        en: { hi: 'Hello, I need:', car: '', empty: 'Hello, I need help with my car.' },
        ru: { hi: 'Здравствуйте, мне нужно:', car: '', empty: 'Здравствуйте, нужна помощь с автомобилем.' }
      }[lang] || { hi: 'Zdravo, treba mi:', car: '', empty: 'Zdravo, treba mi pomoć oko vozila.' };
      const usluge = (form.elements['usluga'] && form.elements['usluga'].value || '').trim();
      const opis = (form.elements['poruka'] && form.elements['poruka'].value || '').trim();
      if (!usluge && !opis) return t.empty;
      const rows = [];
      if (usluge) rows.push(t.hi + ' ' + usluge + '.');
      if (opis) rows.push(opis);
      return rows.join('\n');
    }

    paintPreview() {
      const p = document.querySelector('[data-wa-preview]');
      if (p) p.textContent = this.waMessage();
    }

    /* Hamburger meni: ispod 992px navigacija je panel koji se spušta ispod headera. */
    /* Uvodni ekran stoji dok se logo i hero fotka ne učitaju, pa se povlači uvis. */
    setupLoader() {
      const el = document.querySelector('[data-loader]');
      if (!el) return;
      const logo = el.querySelector('[data-loader-logo]');
      const bar = el.querySelector('[data-loader-bar]');
      // Ne diramo body overflow: to sruši visinu dokumenta i ScrollTrigger izmeri nulu.
      // Umesto toga blokiramo same događaje skrolovanja dok uvodni ekran stoji.
      const block = (e) => { e.preventDefault(); };
      const keys = (e) => { if ([32,33,34,35,36,38,40].indexOf(e.keyCode) > -1) e.preventDefault(); };
      window.addEventListener('wheel', block, { passive: false });
      window.addEventListener('touchmove', block, { passive: false });
      window.addEventListener('keydown', keys, { passive: false });
      let stoppedLenis = false;
      if (this.lenis) { this.lenis.stop(); stoppedLenis = true; }
      window.scrollTo(0, 0);

      requestAnimationFrame(() => {
        if (logo) { logo.style.opacity = '1'; logo.style.transform = 'translateY(0)'; }
        if (bar) bar.style.transform = 'scaleX(1)';
      });

      const done = () => {
        if (el.dataset.done) return;
        el.dataset.done = '1';
        el.style.transform = 'translateY(-100%)';
        el.style.opacity = '0';
        window.removeEventListener('wheel', block);
        window.removeEventListener('touchmove', block);
        window.removeEventListener('keydown', keys);
        if (stoppedLenis && this.lenis) this.lenis.start();
        setTimeout(() => {
          el.remove();
          requestAnimationFrame(() => { if (window.ScrollTrigger) window.ScrollTrigger.refresh(true); });
        }, 1100);
      };

      // čeka logo i hero fotku, ali ne duže od 2.6s
      const hero = document.querySelector('#top img');
      const waits = [logo, hero].filter(Boolean).map(img => img.complete ? Promise.resolve()
        : new Promise(res => { img.addEventListener('load', res, { once: true }); img.addEventListener('error', res, { once: true }); }));
      Promise.all(waits).then(() => setTimeout(done, 620));
      setTimeout(done, 2600);
    }

    setupNav() {
      const burger = document.querySelector('[data-burger]');
      const nav = document.querySelector('[data-nav]');
      if (!burger || !nav) return;
      const lines = burger.querySelectorAll('[data-burger-line]');

      const setOpen = (open) => {
        document.documentElement.toggleAttribute('data-nav-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? 'Zatvori meni' : 'Meni');
        if (lines.length === 2) {
          lines[0].style.transform = open ? 'translateY(3.25px) rotate(45deg)' : 'none';
          lines[1].style.transform = open ? 'translateY(-3.25px) rotate(-45deg)' : 'none';
        }
        // dok je meni otvoren, pozadina se ne pomera
        if (this.lenis) { open ? this.lenis.stop() : this.lenis.start(); }
        document.body.style.overflow = open ? 'hidden' : '';
      };
      const isOpen = () => document.documentElement.hasAttribute('data-nav-open');

      this.on(burger, 'click', () => setOpen(!isOpen()));
      nav.querySelectorAll('a').forEach(a => this.on(a, 'click', () => { if (isOpen()) setOpen(false); }));
      this.on(document, 'keydown', (e) => { if (e.key === 'Escape' && isOpen()) { setOpen(false); burger.focus(); } });
      // prelazak na desktop širinu vraća normalno stanje
      this.on(window, 'resize', () => { if (window.innerWidth > 992 && isOpen()) setOpen(false); });
      setOpen(false);
    }

    setupForm() {
      const form = document.querySelector('[data-form]');
      if (!form) return;
      const ta = form.elements['poruka'];
      if (ta) this.on(ta, 'input', () => this.paintPreview());
      this.paintPreview();
      this.on(form, 'submit', (e) => {
        e.preventDefault();
        window.open('https://wa.me/38162350950?text=' + encodeURIComponent(this.waMessage()), '_blank', 'noopener');
      });
    }

    reg(tween) {
      if (tween && tween.scrollTrigger) this.triggers.push(tween.scrollTrigger);
      return tween;
    }

    /* Sigurnosna mreža: ako trigeri nisu živi, sadržaj se prikazuje bez animacije. */
    watchdog() {
      const gsap = window.gsap;
      setTimeout(() => {
        const live = window.ScrollTrigger.getAll();
        const alive = (this.triggers || []).some(t => live.indexOf(t) > -1);
        // Trigeri mogu i da postoje, a da su izmereni na nuli (npr. dokument bez visine).
        const zeroed = live.length > 0 && live.every(t => t.end === 0);
        if (zeroed) { try { window.ScrollTrigger.refresh(true); } catch (e) {} }
        if (!alive || (zeroed && window.ScrollTrigger.getAll().every(t => t.end === 0))) {
          gsap.set('#top h1 span, [data-card], [data-rise], section h2, section h3', { clearProps: 'all' });
          gsap.set('[data-ul]', { scaleX: 1 });
        }
      }, 2200);
    }

    setupMotion() {
      const gsap = window.gsap, ST = window.ScrollTrigger;
      gsap.registerPlugin(ST);

      /* Lenis smooth scroll, sinhronizovan sa ScrollTriggerom */
      if (window.Lenis && !this.reduced) {
        const lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
        this.lenis = lenis;
        lenis.on('scroll', ST.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
        document.querySelectorAll('a[href^="#"]').forEach(a => {
          this.on(a, 'click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            lenis.scrollTo(target, { offset: -60 });
          });
        });
      }

      if (this.reduced) {
        gsap.set('[data-ul]', { scaleX: 1 });
        const mq = document.querySelector('[data-marquee]');
        const mt = document.querySelector('[data-marquee-track]');
        if (mq && mt) { mt.style.animation = 'none'; mq.style.overflowX = 'auto'; }
        return;
      }

      /* Hero ulaz */
      const hero = gsap.timeline({ delay: 0.15 });
      hero.from('#top [data-rise]', { y: 22, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, 0)
          .from('#top h1 > span', { y: 34, opacity: 0, duration: 1.1, stagger: 0.09, ease: 'power3.out' }, 0.05)
          .to('#top [data-ul]', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0.85);

      /* Svaki element se animira TAČNO jednom. Ako je predak već animiran,
         potomak se preskače: dve transformacije na istom čvoru izgledaju kao bag. */
      const claimed = [];
      const free = (el) => {
        if (el.closest('#top')) return false;
        if (claimed.some(c => c !== el && c.contains(el))) return false;
        claimed.push(el);
        return true;
      };

      /* 1. Naslovi sekcija: maska se podiže, tekst izlazi ispod nje.
         Naslov je u omotaču sa overflow:hidden, pa deluje kao da se otkriva iza ivice. */
      gsap.utils.toArray('section > div > h2, section > div > div > h2').forEach(el => {
        if (!free(el)) return;
        const w = document.createElement('span');
        w.style.cssText = 'display:block;overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em';
        el.parentNode.insertBefore(w, el);
        w.appendChild(el);
        this.reg(gsap.fromTo(el, { yPercent: 108 }, {
          yPercent: 0, duration: 1.05, ease: 'expo.out', immediateRender: false,
          scrollTrigger: { trigger: w, start: 'top 90%' }
        }));
      });

      /* 2. Redovi usluga i koraka: linija se izvuče s leva, pa sadržaj klizne za njom. */
      gsap.utils.toArray('[data-card]').forEach(card => {
        if (!free(card)) return;
        const boxed = getComputedStyle(card).borderTopWidth !== '0px' && card.style.borderRadius === '';
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 88%' },
          defaults: { ease: 'power3.out' }
        });
        if (boxed) {
          // red sa linijom: prvo se linija izvuče, pa tekst
          tl.fromTo(card, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.7 }, 0)
            .fromTo(card.children, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.08 }, 0.18);
        } else {
          // kartica: blagi lift uz otkrivanje odozdo
          tl.fromTo(card, { y: 26, opacity: 0, clipPath: 'inset(12% 0 0 0)' },
                          { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.9 }, 0);
        }
        this.triggers.push(tl.scrollTrigger);
      });

      /* 3. Ostali naslovi i sitni tekst */
      gsap.utils.toArray('section h2, section h3').forEach(el => {
        if (!free(el)) return;
        this.reg(gsap.fromTo(el, { y: 22, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top 91%' }
        }));
      });
      gsap.utils.toArray('[data-rise]').forEach(el => {
        if (!free(el)) return;
        this.reg(gsap.fromTo(el, { y: 14, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top 93%' }
        }));
      });

      /* 4. Chevron liste: stavke ulaze jedna za drugom, chevron stigne prvi. */
      gsap.utils.toArray('ul').forEach(ul => {
        const items = [...ul.children].filter(li => li.querySelector('[aria-hidden="true"]'));
        if (items.length < 2 || ul.closest('#top')) return;
        if (claimed.some(c => c.contains(ul))) return;
        const tl = gsap.timeline({ scrollTrigger: { trigger: ul, start: 'top 88%' } });
        tl.fromTo(items, { x: -14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out' }, 0)
          .fromTo(items.map(li => li.firstElementChild), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.07, ease: 'none' }, 0);
        this.triggers.push(tl.scrollTrigger);
      });

      /* 5. Zlatna linija ispod ključne reči, iscrtava se na scroll */
      gsap.utils.toArray('[data-ul]').forEach(line => {
        if (line.closest('#top')) return;
        this.reg(gsap.to(line, {
          scaleX: 1, duration: 1, ease: 'power2.inOut',
          scrollTrigger: { trigger: line, start: 'top 86%' }
        }));
      });

      /* Hero video: spor zoom-out kroz prvi ekran */
      const hv = document.querySelector('[data-hero-video]');
      if (hv) {
        this.reg(gsap.fromTo(hv, { scale: 1.1 }, {
          scale: 1, ease: 'none', immediateRender: false,
          scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true }
        }));
      }

      /* Parallax na fotkama */
      gsap.utils.toArray('[data-parallax]').forEach(el => {
        this.reg(gsap.fromTo(el, { yPercent: -6 }, {
          yPercent: 6, ease: 'none', immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
        }));
      });

      /* Brojevi se broje */
      gsap.utils.toArray('[data-count]').forEach(el => {
        const end = parseFloat(el.dataset.count);
        const obj = { v: 0 };
        this.reg(gsap.to(obj, {
          v: end, duration: 1.4, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.v); },
          scrollTrigger: { trigger: el, start: 'top 90%' }
        }));
      });

      /* chevron na linkovima */
      document.querySelectorAll('[data-more]').forEach(a => {
        const chev = a.querySelector('span');
        if (!chev) return;
        this.on(a, 'mouseenter', () => { chev.style.transform = 'translateX(5px)'; });
        this.on(a, 'mouseleave', () => { chev.style.transform = 'translateX(0)'; });
      });

      /* Magnetic dugmad */
      document.querySelectorAll('[data-magnetic]').forEach(btn => {
        this.on(btn, 'mousemove', (e) => {
          const r = btn.getBoundingClientRect();
          gsap.to(btn, {
            x: (e.clientX - r.left - r.width / 2) * 0.22,
            y: (e.clientY - r.top - r.height / 2) * 0.3,
            duration: 0.4, ease: 'power2.out'
          });
        });
        this.on(btn, 'mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
        });
      });

      ST.refresh();
      this.watchdog();
      this.on(window, 'load', () => ST.refresh());
    }
  }

  var site = new DiplomatLine();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { site.init(); });
  } else {
    site.init();
  }
  window.DiplomatLine = site;
})();
