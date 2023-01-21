import CheckCircleIcon from "@heroicons/react/solid/CheckCircleIcon";
import XIcon from "@heroicons/react/solid/XIcon";

export default function Notification({
  url,
  title,
  customNotification = true,
  hideNotification,
}) {
  if (customNotification) {
    return (
      <div className="rounded-md bg-green-50 p-4 mb-4 break-word">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Fantàstic!! L&apos;esdeveniment {title} s&apos;ha creat
              correctament i ja el pot veure tothom!
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Et recomanem guardar el següent enllaç per si més endavant
                necessites modificar-lo: <br />
                <a
                  className="font-bold"
                  href={`https://www.culturacardedeu.com/${url}/edita`}
                >
                  {`https://www.culturacardedeu.com/${url}/edita`}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-md bg-green-50 p-4 mb-4 break-word">
      <div className="absolute top-0 right-0 pt-4 pr-4">
        <button
          type="button"
          className=" rounded-md text-gray-400 hover:text-gray-500"
          onClick={() => hideNotification && hideNotification()}
        >
          <span className="sr-only">Close</span>
          <XIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            {title}{" "}
            <span className="mt-2 text-sm text-green-700">
              <a className="font-bold" href={`mailto:${url}`}>
                {url}
              </a>
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
}
