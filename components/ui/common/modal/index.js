import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { DatePicker, Input, Select, TextArea } from "../form";

const defaultForm = {
  title: "",
  description: "",
  startDate: null,
  endDate: null,
  location: null,
};

export default function Modal({ isOpen, toggle }) {
  const [form, setForm] = useState(defaultForm);
  const cancelButtonRef = useRef(null);

  const handleChange = ({ target: { name, value } }) =>
    setForm({ ...form, [name]: value });

  const handleChangeDate = (name, value) => setForm({ ...form, [name]: value });

  const handleChangeLocation = ({ value }) =>
    setForm({ ...form, location: value });

  const closeModal = () => {
    setForm(defaultForm);
    toggle();
  };

  const onSubmit = () => {};
  console.log(form);
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={closeModal}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block overflow-auto align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <Input
                id="title"
                title="Títol"
                value={form.title}
                onChange={handleChange}
              />

              <TextArea
                id="description"
                onChange={handleChange}
                value={form.description}
              />

              <Select
                id="location"
                title="Localització"
                onChange={handleChangeLocation}
              />

              <DatePicker onChange={handleChangeDate} />

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#ECB84A] text-base font-medium text-white hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:col-start-2 sm:text-sm"
                  onClick={onSubmit}
                >
                  Publica
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={closeModal}
                  ref={cancelButtonRef}
                >
                  Cancel·la
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
