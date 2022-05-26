import { useCallback, useEffect, useState } from "react";
import { SearchIcon, XIcon } from "@heroicons/react/solid";
import { useGetEvents } from "@components/hooks/useGetEvents";
import Card from "@components/ui/card";
import List from "@components/ui/list";
import Meta from "@components/partials/seo-meta";
import { NoEventsFound } from "@components/ui/common";

function debounce(func, wait, immediate) {
  let timeout;

  return function executedFunction() {
    const context = this;
    const args = arguments;

    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

const SearchResults = ({ keyword }) => {
  const {
    data: { events = [] },
    error,
    isValidating,
  } = useGetEvents({}, "search", keyword, false);

  if (error) return <div className="">failed to load</div>;

  return (
    <>
      {events.length ? (
        <List events={events}>
          {(event) => <Card key={event.id} event={event} />}
        </List>
      ) : (
        !isValidating && (
          <NoEventsFound title="Res ha coincidit amb la teva cerca, però pot ser que t'agradin aquestes altres opcions." />
        )
      )}
    </>
  );
};

const sendSearchTermGA = (searchTerm) => {
  if (typeof window !== "undefined") {
    window.gtag &&
      window.gtag("event", "search", {
        event_category: "search",
        event_label: searchTerm,
        search_term: searchTerm,
        value: searchTerm,
      });
  }
};

export default function Search() {
  const [startFetching, setStartFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const searchEvents = useCallback(
    (searchInLocalStorage) => {
      if (
        (searchInLocalStorage && searchInLocalStorage.length > 0) ||
        searchTerm.length > 0
      ) {
        setStartFetching(true);
        sendSearchTermGA(searchInLocalStorage || searchTerm);
      }
    },
    [searchTerm]
  );

  useEffect(() => {
    if (searchTerm.length > 0) {
      localStorage.setItem("searchTerm", JSON.stringify(searchTerm));
    }
  }, [searchTerm]);

  useEffect(() => {
    const searchTerm = JSON.parse(localStorage.getItem("searchTerm"));

    if (searchTerm) {
      setSearchTerm(searchTerm);
      searchEvents(searchTerm);
    }
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") searchEvents();
  };

  const handleChange = (e) => {
    const value = e.target.value;

    value.length === 0 ? setStartFetching(false) : setSearchTerm(value);
  };

  const handleChangeWithDebounce = debounce((e) => {
    const value = e.target.value;

    if (value.length === 0) {
      setSearchTerm("");
      localStorage.setItem("searchTerm", JSON.stringify(""));
      setStartFetching(false);
    } else {
      sendSearchTermGA(value);
      setSearchTerm(value);
    }
  }, 1500);

  const onFocus = (e) => {
    const val =
      JSON.parse(localStorage.getItem("searchTerm")) || e.target.value;
    e.target.value = "";
    e.target.value = val;
  };

  const clearSearchTerm = () => setSearchTerm("");

  return (
    <>
      <Meta
        title="Cerca - Cultura Cardedeu"
        description="Cerca esdeveniments a Cardedeu. Cultura i esdeveniments a Cardedeu. Cultura Cardedeu"
        canonical="https://www.culturacardedeu.com/cerca"
        image="/static/images/banner-cultura-cardedeu.jpeg"
      />
      <div className="space-y-8 divide-y divide-gray-200 max-w-3xl mx-auto mb-4">
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="relative">
            <input
              type="text"
              className="shadow-sm focus:ring-gray-300 focus:border-gray-300 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Cerca..."
              defaultValue={searchTerm}
              onChange={startFetching ? handleChangeWithDebounce : handleChange}
              onKeyPress={handleKeyPress}
              autoFocus
              onFocus={onFocus}
            />

            {false && (
              <div className="absolute top-3 right-10 cursor-pointer">
                <XIcon
                  className="h-4 w-4 text-gray-400"
                  onClick={clearSearchTerm}
                />
              </div>
            )}
            <div className="absolute top-2 right-2 cursor-pointer">
              <SearchIcon
                className="h-6 w-6 text-gray-400"
                onClick={searchEvents}
              />
            </div>
          </div>
        </div>
      </div>
      {startFetching && <SearchResults keyword={searchTerm} />}
    </>
  );
}
