import { useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { PencilAltIcon, DocumentSearchIcon } from "@heroicons/react/outline";
import { Tab } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TextArea({ id, value, onChange }) {
  return (
    <div className="mt-2 relative rounded-md">
      <div className="mb-1">
        <label className="mb-2 font-bold">Descripció</label>
      </div>
      <form action="#">
        <Tab.Group>
          {() => (
            <>
              <Tab.List className="flex items-center">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      selected
                        ? "text-gray-900 bg-gray-100 hover:bg-gray-200"
                        : "text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100",
                      "px-3 py-1.5 border border-transparent text-sm font-medium rounded-md"
                    )
                  }
                >
                  <PencilAltIcon className="h-5 w-5" aria-hidden="true" />
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      selected
                        ? "text-gray-900 bg-gray-100 hover:bg-gray-200"
                        : "text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100",
                      "ml-2 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md"
                    )
                  }
                >
                  <DocumentSearchIcon className="h-5 w-5" aria-hidden="true" />
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel className="p-0.5 -m-0.5 rounded-lg">
                  <label htmlFor="comment" className="sr-only">
                    Comment
                  </label>
                  <div>
                    <textarea
                      onChange={onChange}
                      rows={5}
                      name={id}
                      id={id}
                      className="w-full mb-1 shadow-sm block p-4 sm:text-sm border border-gray-200 rounded-md focus:border-yellow-500"
                      placeholder="Afegir una descripció (Text o Html)..."
                      value={value}
                    />
                  </div>
                </Tab.Panel>
                <Tab.Panel className="p-0.5 -m-0.5 rounded-lg">
                  <div className="border-b">
                    <div className="mx-px mt-px px-3 pt-2 pb-12 text-sm leading-5 text-gray-800">
                      <div className="whitespace-pre reset-this">
                        {ReactHtmlParser(value)}
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </>
          )}
        </Tab.Group>
      </form>
    </div>
  );
}
