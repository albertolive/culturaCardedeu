/* This example requires Tailwind CSS v2.0+ */
import { CheckCircleIcon } from "@heroicons/react/solid";

export default function Notification({ url, title }) {
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
            Fantàstic!! L'esdeveniment {title} s&apos;ha creat correctament i ja
            el pot veure tothom!
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
