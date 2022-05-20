import { useState } from "react";
import { SearchIcon, XIcon } from "@heroicons/react/solid";
import { useGetEvents } from "@components/hooks/useGetEvents";
import Card from "@components/ui/card";
import List from "@components/ui/list";

function debounce(func, wait, immediate) {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;

    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;

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
  } = useGetEvents({}, "search", keyword);

  if (error) return <div className="">failed to load</div>;

  if (!events.length && !isValidating)
    return (
      <div className="space-y-8 divide-y divide-gray-200 max-w-3xl mx-auto mb-4 font-bold text-center">
        No s&apos;ha trobat cap esdeveniment. Intenteu una altre cerca.
      </div>
    );

  return (
    <List events={events}>
      {(event) => <Card key={event.id} event={event} />}
    </List>
  );
};

const sendSearchTermGA = (searchTerm) => {
  if (typeof window !== "undefined") {
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") searchEvents();
  };

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length === 0) {
      setStartFetching(false);
    } else {
      sendSearchTermGA(value);
      setSearchTerm(value);
    }
  };

  const handleChangeWithDebounce = debounce((e) => {
    const value = e.target.value;

    if (value.length === 0) {
      setStartFetching(false);
    } else {
      sendSearchTermGA(value);
      setSearchTerm(value);
    }
  }, 800);

  const searchEvents = () => searchTerm.length > 0 && setStartFetching(true);

  const clearSearchTerm = () => setSearchTerm("");

  return (
    <>
      <div className="space-y-8 divide-y divide-gray-200 max-w-3xl mx-auto mb-4">
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="relative">
            <input
              type="text"
              className="shadow-sm focus:ring-gray-300 focus:border-gray-300 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Cerca..."
              onChange={startFetching ? handleChangeWithDebounce : handleChange}
              onKeyPress={handleKeyPress}
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
