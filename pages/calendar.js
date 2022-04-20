import React, { Fragment } from "react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
  LocationMarkerIcon,
} from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";

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
let meetings = [
  {
    id: 1,
    date: "January 10th, 2022",
    time: "5:00 PM",
    datetime: "2022-01-10T17:00",
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    location: "Starbucks",
  },
  // More meetings...
];

const days = (month, year) =>
  new Array(31)
    .fill("")
    .map((v, i) => new Date(year, month, i + 1))
    .filter((v) => v.getMonth() === month)
    .map((x, i) => {
      const day = new Date(x);
      const date = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
      const isCurrentMonth = now.getMonth() === day.getMonth();
      const isToday = now.getDate() === day.getDate();

      return {
        date,
        isCurrentMonth,
        isToday,
        isSelected: false,
      };
    });

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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

            eventList.push({
              start: start,
              end: event.end.date
                ? new Date(end.getFullYear(), end.getMonth(), end.getDate() - 1)
                : end,
              title: event.summary || "No Title",
              description: event.description || "",
              attachments: event.attachments,
              allDay: !event.start.dateTime,
              id: event.id,
            });
          }
          // Pass the processed events to the calendar
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

  // const onPageLoading = React.useCallback(
  //   (event) => {
  //     const start = event.month ? event.month : event.firstDay;
  //     const year = start.getFullYear();
  //     const month = start.getMonth();

  //     // Calculate dates
  //     // (pre-load events for previous and next months as well)
  //     const first = new Date(year, month - 1, -7);
  //     const last = new Date(year, month + 2, 14);

  //     setTimeout(() => {
  //       setFirstDay(first);
  //       setLastDay(last);
  //     });

  //     loadEvents(first, last);
  //   },
  //   [loadEvents]
  // );

  React.useEffect(() => {
    // Load the Google API Client
    window.onGoogleLoad = () => {
      window.gapi.load("client", initClient);
    };
    if (!calApiLoading) {
      loadGoogleSDK();
    }
  }, [initClient, loadGoogleSDK]);
  console.log(days(4, 2022));
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Upcoming meetings</h2>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
        <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
          <div className="flex items-center text-gray-900">
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex-auto font-semibold">January</div>
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
            <div>Dill</div>
            <div>Dim</div>
            <div>Dicr</div>
            <div>Dij</div>
            <div>Div</div>
            <div>Dis</div>
            <div>Dium</div>
          </div>
          <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
            {days(4, 2022).map((day, dayIdx) => {
              return (
                <button
                  key={day.date}
                  type="button"
                  className={classNames(
                    "py-1.5 hover:bg-gray-100 focus:z-10",
                    day.isCurrentMonth ? "bg-white" : "bg-gray-50",
                    (day.isSelected || day.isToday) && "font-semibold",
                    day.isSelected && "text-white",
                    !day.isSelected &&
                      day.isCurrentMonth &&
                      !day.isToday &&
                      "text-gray-900",
                    !day.isSelected &&
                      !day.isCurrentMonth &&
                      !day.isToday &&
                      "text-gray-400",
                    day.isToday && !day.isSelected && "text-indigo-600",
                    dayIdx === 0 && "rounded-tl-lg",
                    dayIdx === 6 && "rounded-tr-lg",
                    dayIdx === days.length - 7 && "rounded-bl-lg",
                    dayIdx === days.length - 1 && "rounded-br-lg"
                  )}
                >
                  <time
                    dateTime={day.date}
                    className={classNames(
                      "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                      day.isSelected && day.isToday && "bg-indigo-600",
                      day.isSelected && !day.isToday && "bg-gray-900"
                    )}
                  >
                    {day.date.split("-").pop().replace(/^0/, "")}
                  </time>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="focus:outline-none mt-8 w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add event
          </button>
        </div>
        <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
          {meetings.map((meeting) => (
            <li
              key={meeting.id}
              className="relative flex space-x-6 py-6 xl:static"
            >
              <img
                src={meeting.imageUrl}
                alt=""
                className="h-14 w-14 flex-none rounded-full"
              />
              <div className="flex-auto">
                <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">
                  {meeting.name}
                </h3>
                <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
                  <div className="flex items-start space-x-3">
                    <dt className="mt-0.5">
                      <span className="sr-only">Date</span>
                      <CalendarIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </dt>
                    <dd>
                      <time dateTime={meeting.datetime}>
                        {meeting.date} at {meeting.time}
                      </time>
                    </dd>
                  </div>
                  <div className="mt-2 flex items-start space-x-3 xl:mt-0 xl:ml-3.5 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
                    <dt className="mt-0.5">
                      <span className="sr-only">Location</span>
                      <LocationMarkerIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </dt>
                    <dd>{meeting.location}</dd>
                  </div>
                </dl>
              </div>
              <Menu
                as="div"
                className="absolute top-6 right-0 xl:relative xl:top-auto xl:right-auto xl:self-center"
              >
                <div>
                  <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
                    <span className="sr-only">Open options</span>
                    <DotsHorizontalIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="focus:outline-none absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Edit
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Cancel
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default App;

// export default function Home() {
//   return (
//     <div className="mx-auto">
//       <main className="fit"></main>
//     </div>
//   );
// }
