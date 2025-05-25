“Vrijeme za kokice” je interaktivna React aplikacija koja korisnicima omogućuje pregled, istraživanje i označavanje omiljenih TV serija, epizoda i glumaca. Povezana je na TVmaze API, odakle dohvaća podatke o 25 najpopularnijih serija, uključujući njihove naslove, ocjene, datume premijere, žanrove, epizode i glumačku postavu.

Glavne značajke projekta:

* **Home grid**: prikaz 25 serija u responsivnom gridu 5×5, s brzim učitavanjem slika i osnovnim informacijama (naziv, ocjena, datum).
* **Detaljni prikaz**: po kliku na seriju otvara se stranica s četiri taba—Opis, Epizode, Glumci i Favoriti—gdje korisnik može vidjeti sažetke, listu epizoda s detaljima, galeriju glavnih i sporednih glumaca te upravljati favoritima za svaku stavku.
* **Favoriti**: lokalno pohranjivanje u `localStorage` i zaseban grid za serije, epizode i glumce, svaki s posterom i gumbom “Ukloni iz favorita”.

Aplikacija je optimizirana za brzinu i jednostavnost korištenja, s modernim CSS stilovima, prilagođenim gumbima za sortiranje i pretragu, te intuitivnom navigacijom “Nazad” i osvježavanjem stranice pritiskom na logo. Cilj je pružiti zabavno “kino iskustvo” uz minimalan broj klikova i jasno vizualno sučelje koje vas poziva da “uzmete kokice” i uživate u svijetu omiljenih serija.
