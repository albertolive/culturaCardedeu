import CheckCircleIcon from "@heroicons/react/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/solid/ExclamationCircleIcon";
import XIcon from "@heroicons/react/solid/XIcon";
import ExclamationIcon from "@heroicons/react/solid/ExclamationIcon";

export default function Notification({
  url,
  title,
  message,
  type = "success",
  customNotification = true,
  hideNotification,
  hideClose = false,
  actions,
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

  let bgColor, iconColor, titleColor, messageColor, IconComponent;

  switch (type) {
    case "error":
      bgColor = "bg-red-50";
      iconColor = "text-red-400";
      titleColor = "text-red-800";
      messageColor = "text-red-700";
      IconComponent = ExclamationCircleIcon;
      break;
    case "warning":
      bgColor = "bg-yellow-50";
      iconColor = "text-yellow-400";
      titleColor = "text-yellow-800";
      messageColor = "text-yellow-700";
      IconComponent = ExclamationIcon;
      break;
    case "success":
    default:
      bgColor = "bg-green-50";
      iconColor = "text-green-400";
      titleColor = "text-green-800";
      messageColor = "text-green-700";
      IconComponent = CheckCircleIcon;
      break;
  }

  return (
    <div className={`relative rounded-md ${bgColor} p-4 mb-4 break-word`}>
      {!hideClose && (
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={(hide) => hideNotification && hideNotification(hide)}
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="flex">
        <div className="flex-shrink-0">
          <IconComponent
            className={`h-5 w-5 ${iconColor}`}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className={`text-sm font-medium ${titleColor}`}>
              <div dangerouslySetInnerHTML={{ __html: title }} />
            </h3>
          )}
          {message && (
            <div className={`mt-2 text-sm ${messageColor}`}>
              <p dangerouslySetInnerHTML={{ __html: message }} />
            </div>
          )}
          {actions && <div className="mt-4">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
