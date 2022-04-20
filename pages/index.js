import React from "react";
import Card from "@components/ui/card";
import List from "@components/ui/list";

const API_KEY = "AIzaSyDocqAvVLC4XlHdHKKfXVss82-CUDp0wdU";
const CLIENT_ID =
  "619209770068-9hbdefm1vbm5uksfnh2gpkvpvkmj8kql.apps.googleusercontent.com";
const CALENDAR_ID = "8e1jse11ireht56ho13r6a470s@group.calendar.google.com";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
const now = new Date();

let calApiLoaded;
let calApiLoading;

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

const images = {
  biblioteca: "/images/biblioteca.jpg",
};

const tags = ["Familiar", "Tertúlia Literària"];

function App() {
  const [events, setEvents] = React.useState([]);
  const [firstDay, setFirstDay] = React.useState(now);
  const [lastDay, setLastDay] = React.useState(
    new Date(now.getFullYear(), now.getMonth() + 2)
  );
  const [view, setView] = React.useState("month");

  // Load the SDK asynchronously
  const loadGoogleSDK = React.useCallback(() => {
    calApiLoading = true;
    (function (d, s, id) {
      let js;
      let fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        window.onGoogleLoad();
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://apis.google.com/js/api.js?onload=onGoogleLoad";
      js.onload = "onGoogleLoad";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "google-jssdk");
  }, []);

  // Load events from Google Calendar between 2 dates
  const loadEvents = React.useCallback((from, until) => {
    // Only load events if the Google API finished loading
    if (calApiLoaded) {
      window.gapi.client.calendar.events
        .list({
          calendarId: CALENDAR_ID,
          timeMin: from.toISOString(),
          timeMax: until.toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 100,
          orderBy: "startTime",
        })
        .then((response) => {
          let start;
          let end;
          let event;
          let events = response.result.items;
          let eventList = [];

          // Process event list
          for (let i = 0; i < events.length; ++i) {
            event = events[i];
            start = new Date(event.start.date || event.start.dateTime);
            end = new Date(event.end.date || event.end.dateTime);
            const numberDay = new Date(start).getDay();
            const nameDay = days[numberDay];
            const nameMonth = months[numberDay];
            const formattedStart = `${start.getDate()} de ${nameMonth} del ${start.getFullYear()}`;
            const startTime = `${start.getHours()}:${String(
              start.getMinutes()
            ).padStart(2, "0")}`;
            const endTime = `${end.getHours()}:${String(
              end.getMinutes()
            ).padStart(2, "0")}`;
            const location = event.location
              ? event.location.split(",")[0]
              : "Cardedeu";
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
              .replace(/:/g, "")}-${formattedStart
              .toLowerCase()
              .replace(/ /g, "-")}`;
            const imageTitle = location
              .toLowerCase()
              .replace(/ /g, "-")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/"/g, "")
              .replace(/,/g, "")
              .replace(/:/g, "");
            const image = `/static/images/${imageTitle}.jpeg`;

            eventList.push({
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
            });
          }

          setEvents(eventList);
        });
    }
  }, []);

  // Init the Google API client
  const initClient = React.useCallback(() => {
    window.gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(() => {
        calApiLoaded = true;
        loadEvents(firstDay, lastDay);
      });
  }, [loadEvents, firstDay, lastDay]);

  React.useEffect(() => {
    // Load the Google API Client
    window.onGoogleLoad = () => {
      window.gapi.load("client", initClient);
    };
    if (!calApiLoading) {
      loadGoogleSDK();
    }
  }, [initClient, loadGoogleSDK]);

  return (
    <List events={events}>
      {(event) => <Card key={event.id} event={event} />}
    </List>
  );
}

export default App;
