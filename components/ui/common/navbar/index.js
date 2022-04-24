import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { PlusSmIcon } from "@heroicons/react/solid";
import Image from "next/image";
import ActiveLink from "@components/ui/common/link";

const navigation = [
  { name: "Agenda", href: "/", current: true },
  { name: "Qui som", href: "/qui-som", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  return (
    <Disclosure as="nav" className="bg-gray-800 sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Obrir menú principal</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  <Image
                    src="/static/images/logo-cultura-cardedeu-small.png"
                    className="block lg:hidden h-8 w-auto"
                    alt="Cultura Cardedeu"
                    width={40}
                    height={40}
                  />
                  <Image
                    src="/static/images/logo-cultura-cardedeu-small.png"
                    className="hidden lg:block h-8 w-auto"
                    alt="Cultura Cardedeu"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {navigation.map((item) => (
                    <ActiveLink href={item.href} key={item.name}>
                      <a className="font-medium mr-8 text-white hover:text-stone-200">
                        {item.name}
                      </a>
                    </ActiveLink>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
                  >
                    <PlusSmIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Publica</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <ActiveLink href={item.href} key={item.name}>
                  <a className="font-medium mr-8 text-white hover:text-stone-200">
                    {item.name}
                  </a>
                </ActiveLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
