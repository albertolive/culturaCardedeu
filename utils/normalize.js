const days = [
  "Diumenge",
  "Dilluns",
  "Dimarts",
  "Dimecres",
  "Dijous",
  "Divendres",
  "Dissabte",
];

const months = [
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

const tags = ["Familiar", "Tertúlia Literària"];

const images = {
  biblioteca: "/images/biblioteca.jpg",
};

export const normalizeEvent = (event) => {
  const start = new Date(event.start.date || event.start.dateTime);
  const end = new Date(event.end.date || event.end.dateTime);
  const numberDay = new Date(start).getDay();
  const nameDay = days[numberDay];
  const nameMonth = months[numberDay - 1];
  const formattedStart = `${start.getDate()} de ${nameMonth} del ${start.getFullYear()}`;
  const startTime = `${start.getHours()}:${String(start.getMinutes()).padStart(
    2,
    "0"
  )}`;
  const endTime = `${end.getHours()}:${String(end.getMinutes()).padStart(
    2,
    "0"
  )}`;
  const location = event.location ? event.location.split(",")[0] : "Cardedeu";
  let title = event.summary || "";
  const tag = tags.find((v) => title.includes(v));

  if (tag) {
    title = title.replace(`${tag}:`, "").trim();
  }

  let slug = `${title
    .toLowerCase()
    .replace(/ /g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/"/g, "")
    .replace(/,/g, "")
    .replace(/:/g, "")}-${formattedStart.toLowerCase().replace(/ /g, "-")}`;
  const imageTitle = location
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/"/g, "")
    .replace(/,/g, "")
    .replace(/:/g, "");
  const image = `/static/images/${imageTitle}.jpeg`;

  return {
    start: event.start.date || event.start.dateTime,
    end: event.end.date
      ? new Date(end.getFullYear(), end.getMonth(), end.getDate() - 1)
      : end,
    title,
    description: event.description || "",
    attachments: event.attachments,
    allDay: !event.start.dateTime,
    id: event.id,
    location,
    formattedStart,
    nameDay,
    startTime,
    endTime,
    tag,
    slug,
    image: image.trim(),
  };
};
