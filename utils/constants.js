export const DAYS = [
  "Diumenge",
  "Dilluns",
  "Dimarts",
  "Dimecres",
  "Dijous",
  "Divendres",
  "Dissabte",
];

export const MONTHS = [
  "Gener",
  "Febrer",
  "Març",
  "Abril",
  "Maig",
  "Juny",
  "Juliol",
  "Agost",
  "Septembre",
  "Octubre",
  "Novembre",
  "Desembre",
];

export const TAGS = ["Familiar", "Tertúlia Literària"];

export const LOCATIONS_ARRAY = [
  { value: "Ajuntament de Cardedeu", label: "Ajuntament de Cardedeu" },
  { value: "Biblioteca Marc de Vilalba", label: "Biblioteca Marc de Vilalba" },
  { value: "Cambridge School Cardedeu", label: "Cambridge School Cardedeu" },
  {
    value: "Capella de Sant Corneli i Sant Cebrià",
    label: "Capella de Sant Corneli i Sant Cebrià",
  },
  { value: "Casa Corbella", label: "Casa Corbella" },
  { value: "Casa Viader", label: "Casa Viader" },
  {
    value: "Casal Ajuntament de Cardedeu",
    label: "Casal Ajuntament de Cardedeu",
  },
  { value: "Cementiri de Cardedeu", label: "Cementiri de Cardedeu" },
  { value: "Cervesa Sant Jordi", label: "Cervesa Sant Jordi" },
  { value: "Cinema Esbarjo", label: "Cinema Esbarjo" },
  { value: "Església de Santa Maria", label: "Església de Santa Maria" },
  { value: "Floristeria Parera", label: "Floristeria Parera" },
  { value: "Granja el Melindro", label: "Granja el Melindro" },
  { value: "Kid&Us Cardedeu", label: "Kid&Us Cardedeu" },
  { value: "La Fresca", label: "La Fresca" },
  {
    value: "La Guingueta del Pompeu Fabra",
    label: "La Guingueta del Pompeu Fabra",
  },
  { value: "La Terrassa de Viulamúsica", label: "La Terrassa de Viulamúsica" },
  { value: "Museu Arxiu Tomàs Balvey", label: "Museu Arxiu Tomàs Balvey" },
  { value: "Parc Pompeu Fabra", label: "Parc Pompeu Fabra" },
  { value: "Plaça de l'Església", label: "Plaça de l'Església" },
  { value: "Plaça Sant Corneli", label: "Plaça Sant Corneli" },
  { value: "Plaça Sant Joan", label: "Plaça Sant Joan" },
  { value: "Sala Sarau", label: "Sala Sarau" },
  { value: "Sant Hilari", label: "Sant Hilari" },
  { value: "Tarambana", label: "Tarambana" },
  { value: "Teatre Auditori Cardedeu", label: "Teatre Auditori Cardedeu" },
  {
    value: "Tèxtil Rase Fàbrica de Cultura",
    label: "Tèxtil Rase Fàbrica de Cultura",
  },
  { value: "Vil·la Paquita", label: "Vil·la Paquita" },
  {
    value: "Plaça dels Contes (Carrer Hospital i Teresa Oller)",
    label: "Plaça dels Contes (Carrer Hospital i Teresa Oller)",
  },
];

export const LOCATIONS = {
  ajuntamentCardedeu: ["ajuntament", "columnes"],
  bibliotecaMarcVilalba: ["vilalba"],
  bibliotecaLesAigues: ["aigues", "sec"],
  cambridgeSchool: ["cambridge"],
  capellaSantCorneli: ["corneli"],
  casaCorbella: ["corbella"],
  casaViader: ["viader"],
  casalAjuntamentCardedeu: ["gent gran"],
  canBorras: ["eureka"],
  cementiriCardedeu: ["cementiri"],
  cervesaSantJordi: ["cervesa", "jordi"],
  cinemaEsbarjo: ["esbarjo"],
  esglesiaSantaMaria: ["esglesia"],
  espai31: ["Espai31"],
  floristeriaParera: ["parera"],
  creperiaMelindro: ["melindro"],
  kidUsCardedeu: ["kid"],
  laFresca: ["fresca"],
  guinguetaPompeuFabra: ["guingueta"],
  terrassaViuLaMusica: ["terrassa"],
  museuArxiuTomasBalvey: ["museu"],
  parcPompeuFabra: ["pompeu"],
  placaContes: ["hospital", "oller", "contes"],
  placaEsglesia: ["l'església"],
  placaSantCorneli: ["corneli"],
  placaSantJoan: ["joan"],
  placaJoanAlsina: ["alsina"],
  salaSarau: ["sarau"],
  santHilari: ["hilari"],
  tarambana: ["tarambana"],
  teatreAuditoriCardedeu: ["teatre", "auditori"],
  textilRase: ["textil", "rase"],
  vilaPaquita: ["paquita"],
};

export const VITAMINED_LOCATIONS = {
  ajuntamentCardedeu: {
    images: [
      "/static/images/locations/ajuntamentCardedeu/1.jpeg",
      "/static/images/locations/ajuntamentCardedeu/2.jpeg",
    ],
    lat: 41.63806878807939,
    lng: 2.354556047015495,
    social: [],
  },
  bibliotecaMarcVilalba: {
    images: [
      "/static/images/locations/bibliotecaMarcVilalba/1.jpeg",
      "/static/images/locations/bibliotecaMarcVilalba/2.jpeg",
    ],
    lat: 41.63937540779609,
    lng: 2.360981985672975,
    social: [],
  },
  bibliotecaLesAigues: {
    images: [
      "/static/images/locations/bibliotecaLesAigues/1.jpeg",
      "/static/images/locations/bibliotecaLesAigues/2.jpeg",
    ],
    lat: 41.63082569512009,
    lng: 2.361644997216786,
    social: [],
  },
  cambridgeSchool: {
    images: ["/static/images/locations/cambridgeSchool/1.jpeg"],
    lat: 41.64197980432416,
    lng: 2.3619516657450683,
    social: [],
  },
  capellaSantCorneli: {
    images: [
      "/static/images/locations/capellaSantCorneli/1.jpeg",
      "/static/images/locations/capellaSantCorneli/2.jpeg",
    ],
    lat: 41.638586306071716,
    lng: 2.356506032558306,
    social: [],
  },
  canBorras: {
    images: ["/static/images/locations/canBorras/1.jpeg"],
    lat: 41.64023,
    lng: 2.35982,
    social: [],
  },
  cardedeu: {
    images: [
      "/static/images/locations/cardedeu/1.jpeg",
      "/static/images/locations/cardedeu/2.jpeg",
    ],
    lat: 41.6394024,
    lng: 2.3591531,
    social: [],
  },
  casaCorbella: {
    images: ["/static/images/locations/casaCorbella/1.jpeg"],
    lat: 41.64260842131494,
    lng: 2.3563093806627684,
    social: [],
  },
  casaViader: {
    images: [
      "/static/images/locations/casaViader/1.jpeg",
      "/static/images/locations/casaViader/2.jpeg",
    ],
    lat: 41.63822360236233,
    lng: 2.356717062164755,
    social: [],
  },
  casalAjuntamentCardedeu: {
    images: [
      "/static/images/locations/casalAjuntamentCardedeu/1.jpeg",
      "/static/images/locations/casalAjuntamentCardedeu/2.jpeg",
    ],
    lat: 41.637386026126805,
    lng: 2.35524507384688,
    social: [],
  },
  cementiriCardedeu: {
    images: [
      "/static/images/locations/cementiriCardedeu/1.jpeg",
      "/static/images/locations/cementiriCardedeu/2.jpeg",
    ],
    lat: 41.63833320631103,
    lng: 2.345500898205636,
    social: [],
  },
  cervesaSantJordi: {
    images: [
      "/static/images/locations/cervesaSantJordi/1.jpeg",
      "/static/images/locations/cervesaSantJordi/2.jpeg",
    ],
    lat: 41.636249392703576,
    lng: 2.358455195836614,
    social: [],
  },
  cinemaEsbarjo: {
    images: [
      "/static/images/locations/cinemaEsbarjo/1.jpeg",
      "/static/images/locations/cinemaEsbarjo/2.jpeg",
    ],
    lat: 41.639618044147646,
    lng: 2.3564723602327,
    social: [],
  },
  esglesiaSantaMaria: {
    images: [
      "/static/images/locations/esglesiaSantaMaria/1.jpeg",
      "/static/images/locations/esglesiaSantaMaria/2.jpeg",
    ],
    lat: 41.63856445421189,
    lng: 2.355979312757857,
    social: [],
  },
  espai31: {
    images: ["/static/images/locations/espai31/1.jpeg"],
    lat: 41.63856445421189,
    lng: 2.355979312757857,
    social: [],
  },
  floristeriaParera: {
    images: ["/static/images/locations/floristeriaParera/1.jpeg"],
    lat: 41.63844997556709,
    lng: 2.35583292648753,
    social: [],
  },
  creperiaMelindro: {
    images: ["/static/images/locations/creperiaMelindro/1.jpeg"],
    lat: 41.63887870552354,
    lng: 2.3557829899327127,
    social: [],
  },
  kidUsCardedeu: {
    images: ["/static/images/locations/kidUsCardedeu/1.jpeg"],
    lat: 41.63975765103531,
    lng: 2.361501060984501,
    social: [],
  },
  laFresca: {
    images: [
      "/static/images/locations/laFresca/1.jpeg",
      "/static/images/locations/laFresca/2.jpeg",
    ],
    lat: 41.639890381660656,
    lng: 2.3579162300262793,
    social: [],
  },
  guinguetaPompeuFabra: {
    images: [
      "/static/images/locations/guinguetaPompeuFabra/1.jpeg",
      "/static/images/locations/guinguetaPompeuFabra/2.jpeg",
    ],
    lat: 41.64225826500509,
    lng: 2.352798747679134,
    social: [],
  },
  terrassaViuLaMusica: {
    images: [
      "/static/images/locations/terrassaViuLaMusica/1.jpeg",
      "/static/images/locations/terrassaViuLaMusica/2.jpeg",
    ],
    lat: 41.638703341862495,
    lng: 2.360165621399748,
    social: [],
  },
  museuArxiuTomasBalvey: {
    images: [
      "/static/images/locations/museuArxiuTomasBalvey/1.jpeg",
      "/static/images/locations/museuArxiuTomasBalvey/2.jpeg",
    ],
    lat: 41.637994223216054,
    lng: 2.3548167289541015,
    social: [],
  },
  parcPompeuFabra: {
    images: ["/static/images/locations/parcPompeuFabra/1.jpeg"],
    lat: 41.64187052797948,
    lng: 2.3530121512517255,
    social: [],
  },
  placaContes: {
    images: [
      "/static/images/locations/placaContes/1.jpeg",
      "/static/images/locations/placaContes/2.jpeg",
    ],
    lat: 41.63836142146722,
    lng: 2.357423235796843,
    social: [],
  },
  placaEsglesia: {
    images: ["/static/images/locations/placaEsglesia/1.jpeg"],
    lat: 41.63853798978688,
    lng: 2.355840838823934,
    social: [],
  },
  placaSantCorneli: {
    images: ["/static/images/locations/placaSantCorneli/1.jpeg"],
    lat: 41.63872635026174,
    lng: 2.356437313664736,
    social: [],
  },
  placaSantJoan: {
    images: ["/static/images/locations/placaSantJoan/1.jpeg"],
    lat: 41.63816747322217,
    lng: 2.355029169716503,
    social: [],
  },
  placaJoanAlsina: {
    images: ["/static/images/locations/placaJoanAlsina/1.jpeg"],
    lat: 41.64200225558534,
    lng: 2.36117166518075,
    social: [],
  },
  salaSarau: {
    images: ["/static/images/locations/salaSarau/1.jpeg"],
    lat: 41.637130295523384,
    lng: 2.361176040465669,
    social: [],
  },
  santHilari: {
    images: [
      "/static/images/locations/santHilari/1.jpeg",
      "/static/images/locations/santHilari/2.jpeg",
    ],
    lat: 41.66877946875697,
    lng: 2.34985794255853,
    social: [],
  },
  tarambana: {
    images: [
      "/static/images/locations/tarambana/1.jpeg",
      "/static/images/locations/tarambana/2.jpeg",
    ],
    lat: 41.641054643881766,
    lng: 2.363269773588325,
    social: [],
  },
  teatreAuditoriCardedeu: {
    images: [
      "/static/images/locations/teatreAuditoriCardedeu/1.jpeg",
      "/static/images/locations/teatreAuditoriCardedeu/2.jpeg",
    ],
    lat: 41.63715759707137,
    lng: 2.36132918584645,
    social: [],
  },
  textilRase: {
    images: [
      "/static/images/locations/textilRase/1.jpeg",
      "/static/images/locations/textilRase/2.jpeg",
    ],
    lat: 41.63835093425814,
    lng: 2.3629058262509672,
    social: [],
  },
  vilaPaquita: {
    images: [
      "/static/images/locations/vilaPaquita/1.jpeg",
      "/static/images/locations/vilaPaquita/2.jpeg",
    ],
    lat: 41.637052846146986,
    lng: 2.360924223825777,
    social: [],
  },
};
