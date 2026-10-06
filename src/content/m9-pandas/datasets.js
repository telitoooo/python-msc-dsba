/**
 * Jeux de données des exercices du module 9 (fichiers CSV déposés dans le dossier de travail).
 * Les données générées le sont de façon déterministe : mêmes fichiers à chaque chargement,
 * donc des tests reproductibles.
 */

/** Extrait simplifié du jeu « IMDB-Movie-Data » utilisé dans le cours (40 films). */
export const MOVIES_CSV = `Rank,Title,Genre,Director,Year,Runtime (Minutes),Rating,Votes,Revenue (Millions),Metascore
1,Guardians of the Galaxy,"Action,Adventure,Sci-Fi",James Gunn,2014,121,8.1,757074,333.13,76
2,Prometheus,"Adventure,Mystery,Sci-Fi",Ridley Scott,2012,124,7.0,485820,126.46,65
3,Split,"Horror,Thriller",M. Night Shyamalan,2016,117,7.3,157606,138.12,62
4,Sing,"Animation,Comedy,Family",Christophe Lourdelet,2016,108,7.2,60545,270.32,59
5,Suicide Squad,"Action,Adventure,Fantasy",David Ayer,2016,123,6.2,393727,325.02,40
6,The Great Wall,"Action,Adventure,Fantasy",Yimou Zhang,2016,103,6.1,56036,45.13,42
7,La La Land,"Comedy,Drama,Music",Damien Chazelle,2016,128,8.3,258682,151.06,93
8,Mindhorn,Comedy,Sean Foley,2016,89,6.4,2490,,71
9,The Lost City of Z,"Action,Adventure,Biography",James Gray,2016,141,7.1,7188,8.01,78
10,Passengers,"Adventure,Drama,Romance",Morten Tyldum,2016,116,7.0,192177,100.01,41
11,Fantastic Beasts and Where to Find Them,"Adventure,Family,Fantasy",David Yates,2016,133,7.5,232072,234.02,66
12,Hidden Figures,"Biography,Drama,History",Theodore Melfi,2016,127,7.8,93103,169.27,74
13,Rogue One,"Action,Adventure,Sci-Fi",Gareth Edwards,2016,133,7.9,323118,532.17,65
14,Moana,"Animation,Adventure,Comedy",Ron Clements,2016,107,7.7,118151,248.75,81
15,Colossal,"Action,Comedy,Drama",Nacho Vigalondo,2016,109,6.4,8612,2.87,70
16,The Secret Life of Pets,"Animation,Adventure,Comedy",Chris Renaud,2016,87,6.6,120259,368.31,61
17,Hacksaw Ridge,"Biography,Drama,History",Mel Gibson,2016,139,8.2,211760,67.12,71
18,Jason Bourne,"Action,Thriller",Paul Greengrass,2016,123,6.7,150823,162.16,58
19,Lion,"Biography,Drama",Garth Davis,2016,118,8.1,102061,51.69,69
20,Arrival,"Drama,Mystery,Sci-Fi",Denis Villeneuve,2016,116,8.0,340798,100.5,81
21,Interstellar,"Adventure,Drama,Sci-Fi",Christopher Nolan,2014,169,8.6,1047747,187.99,74
22,The Dark Knight,"Action,Crime,Drama",Christopher Nolan,2008,152,9.0,1791916,533.32,82
23,Inception,"Action,Adventure,Sci-Fi",Christopher Nolan,2010,148,8.8,1583625,292.57,74
24,The Prestige,"Drama,Mystery,Sci-Fi",Christopher Nolan,2006,130,8.5,913152,53.08,66
25,The Dark Knight Rises,"Action,Thriller",Christopher Nolan,2012,164,8.5,1222645,448.13,78
26,The Martian,"Adventure,Drama,Sci-Fi",Ridley Scott,2015,144,8.0,556097,228.43,80
27,Robin Hood,"Action,Adventure,Drama",Ridley Scott,2010,140,6.7,221117,105.22,53
28,American Gangster,"Biography,Crime,Drama",Ridley Scott,2007,157,7.8,337835,130.13,76
29,Exodus: Gods and Kings,"Action,Adventure,Drama",Ridley Scott,2014,150,6.0,137299,65.01,52
30,The Counselor,"Crime,Drama,Thriller",Ridley Scott,2013,117,5.3,84927,16.97,48
31,A Good Year,"Comedy,Drama,Romance",Ridley Scott,2006,117,6.9,74674,7.46,47
32,Body of Lies,"Action,Drama,Romance",Ridley Scott,2008,128,7.1,182305,39.38,57
33,The Intouchables,"Biography,Comedy,Drama",Olivier Nakache,2011,112,8.6,557965,13.18,57
34,Kimi no na wa,"Animation,Drama,Fantasy",Makoto Shinkai,2016,106,8.6,34110,4.68,79
35,Dangal,"Action,Biography,Drama",Nitesh Tiwari,2016,161,8.8,48969,11.15,
36,Taare Zameen Par,"Drama,Family,Music",Aamir Khan,2007,165,8.5,102697,1.2,42
37,Paris pieds nus,Comedy,Dominique Abel,2016,83,6.8,222,,
38,Hounds of Love,"Crime,Drama,Horror",Ben Young,2016,108,6.7,1115,,72
39,Trolls,"Animation,Adventure,Comedy",Walt Dohrn,2016,92,6.5,38552,153.69,56
40,Inglourious Basterds,"Adventure,Drama,War",Quentin Tarantino,2009,153,8.3,959065,120.52,69
`;

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
function seeded(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Taux de change mensuels USD → devise (format du fichier monthly.csv de datahub.io :
 * Date, Country, Exchange rate), de 1988 à 2002. Valeurs simulées autour des moyennes réelles.
 */
export function exchangeRatesCsv() {
  const countries = [
    ["Australia", 1.39, 0.07],
    ["Canada", 1.33, 0.05],
    ["China", 7.17, 0.09],
    ["Denmark", 6.32, 0.08],
    ["Japan", 122.0, 0.12],
    ["Switzerland", 1.4, 0.07],
    ["United Kingdom", 0.62, 0.06],
  ];
  const random = seeded(1990);
  const lines = ["Date,Country,Exchange rate"];
  for (let year = 1988; year <= 2002; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      const t = (year - 1988) * 12 + month;
      for (const [country, base, amplitude] of countries) {
        const value = base * (1 + amplitude * Math.sin(t / 11 + base) + 0.01 * (random() - 0.5));
        lines.push(`${year}-${String(month).padStart(2, "0")}-01,${country},${value.toFixed(4)}`);
      }
    }
  }
  return lines.join("\n") + "\n";
}

/**
 * Ventes de 4 distributeurs automatiques sur deux semaines (du lundi 4 au dimanche 17 mars 2024) :
 * machine, timestamp, item, price, cost, payment.
 */
export function vendingCsv() {
  const catalog = {
    chocolate: [1.5, 0.6],
    gums: [0.8, 0.2],
    candy: [0.5, 0.15],
    cookie: [1.0, 0.4],
    cake: [2.0, 0.9],
    soda: [1.2, 0.5],
  };
  const machines = {
    machine1: ["chocolate", "gums", "candy", "cookie"],
    machine2: ["chocolate", "cookie", "soda", "candy"],
    machine3: ["cake", "chocolate", "soda", "gums"],
    machine4: ["chocolate", "candy", "soda", "cake", "gums"],
  };
  // Heures d'ouverture et affluence relative (pics le matin, le midi et en fin d'après-midi).
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  const hourWeights = [2, 3, 6, 4, 5, 7, 3, 4, 6, 7, 4, 2];
  const random = seeded(2024);
  const pick = (values, weights) => {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = random() * total;
    for (let i = 0; i < values.length; i += 1) {
      r -= weights[i];
      if (r < 0) return values[i];
    }
    return values[values.length - 1];
  };

  const rows = [];
  for (let day = 4; day <= 17; day += 1) {
    for (const [machine, items] of Object.entries(machines)) {
      const count = 8 + Math.floor(random() * 9);
      for (let i = 0; i < count; i += 1) {
        const hour = pick(hours, hourWeights);
        const minute = Math.floor(random() * 60);
        // Le chocolat se vend surtout l'après-midi, le gâteau au goûter.
        const weights = items.map((item) => {
          if (item === "chocolate") return hour >= 15 ? 5 : 2;
          if (item === "cake") return hour >= 16 && hour <= 17 ? 6 : 1;
          if (item === "soda") return hour >= 12 && hour <= 14 ? 4 : 2;
          return 2;
        });
        const item = pick(items, weights);
        const [price, cost] = catalog[item];
        const payment = random() < 0.4 ? "card" : "cash";
        const stamp = `2024-03-${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        rows.push([stamp, `${machine},${stamp},${item},${price.toFixed(2)},${cost.toFixed(2)},${payment}`]);
      }
    }
  }
  rows.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return ["machine,timestamp,item,price,cost,payment", ...rows.map((r) => r[1])].join("\n") + "\n";
}

/** Extrait de la carte du TD « Map of France » (ville:x:y, puis --, puis villeA:villeB:distance). */
export const FRANCE_MAP = `La Baule-Escoublac:356:638
Saint-Nazaire:484:563
Guerande:180:340
Saint-Andre-des-Eaux:345:402
Pornichet:420:690
Le Croisic:120:600
Nantes:880:520
Saint-Brevin-les-Pins:520:760
--
La Baule-Escoublac:Saint-Nazaire:15
La Baule-Escoublac:Guerande:6
La Baule-Escoublac:Saint-Andre-des-Eaux:8
La Baule-Escoublac:Pornichet:5
Le Croisic:La Baule-Escoublac:10
Guerande:Le Croisic:11
Guerande:Saint-Andre-des-Eaux:9
Saint-Nazaire:Pornichet:11
Saint-Nazaire:Saint-Andre-des-Eaux:10
Saint-Nazaire:Nantes:63
Saint-Nazaire:Saint-Brevin-les-Pins:14
`;
