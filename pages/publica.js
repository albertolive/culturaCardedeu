import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { slug, getFormattedDate } from "@utils/helpers";
import {
  DatePicker,
  Input,
  Select,
  TextArea,
} from "@components/ui/common/form";

const defaultForm = {
  title: "",
  description: "",
  startDate: null,
  endDate: null,
  location: null,
};

const _createFormState = (
  isDisabled = true,
  isPristine = true,
  message = ""
) => ({
  isDisabled,
  isPristine,
  message,
});

const createFormState = (
  { title, description, startDate, endDate, location },
  isPristine
) => {
  if (!isPristine) {
    return _createFormState(true, true, "");
  }

  if (!title) {
    return _createFormState(true, true, "Títol obligatori");
  }

  if (!description) {
    return _createFormState(true, true, "Descripció obligatòria");
  }

  if (!location) {
    return _createFormState(true, true, "Lloc obligatori");
  }

  if (!startDate) {
    return _createFormState(true, true, "Data inici obligatòria");
  }

  if (!endDate) {
    return _createFormState(true, true, "Data final obligatòria");
  }

  if (endDate.getTime() <= startDate.getTime()) {
    return _createFormState(
      true,
      true,
      "Data final no pot ser anterior o igual a la data inici"
    );
  }

  return _createFormState(false);
};

export default function Publica() {
  const router = useRouter();
  const didMount = useRef(false);
  const [form, setForm] = useState(defaultForm);
  const [formState, setFormState] = useState(_createFormState());
  const [isLoading, setIsLoading] = useState(false);

  const handleFormChange = (name, value) => {
    const newForm = { ...form, [name]: value };

    setForm(newForm);
    setFormState(createFormState(newForm));
  };

  const handleChange = ({ target: { name, value } }) =>
    handleFormChange(name, value);

  const handleChangeDate = (name, value) => handleFormChange(name, value);

  const handleChangeLocation = ({ value }) =>
    handleFormChange("location", value);

  const onSubmit = async () => {
    setFormState(createFormState(form, formState.isPristine));

    if (!formState.isDisabled) {
      setIsLoading(true);

      const rawResponse = await fetch(process.env.NEXT_PUBLIC_CREATE_EVENT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const { id } = await rawResponse.json();

      const { formattedStart } = getFormattedDate(form.startDate, form.endDate);
      const slugifiedTitle = slug(form.title, formattedStart, id);

      router.push(`/${slugifiedTitle}`);
    }
  };

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    onSubmit();
  }, [formState.isDisabled]);

  return (
    <>
      <Head>
        <title>Publica - Cultura Cardedeu</title>
        <meta
          name="description"
          content="Publica un acte cultural - Cultura Cardedeu"
        />
      </Head>
      <div className="space-y-8 divide-y divide-gray-200 max-w-3xl mx-auto">
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Publica un acte cultural
              </h3>
              <p className="mt-1 text-sm text-gray-500">* camps obligatoris</p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <Input
                id="title"
                title="Títol *"
                value={form.title}
                onChange={handleChange}
              />

              <TextArea id="description" onChange={handleChange} />

              <Select
                id="location"
                title="Localització *"
                onChange={handleChangeLocation}
              />

              <DatePicker onChange={handleChangeDate} />
            </div>
          </div>
        </div>
        {formState.isPristine && formState.message && (
          <div className="p-4 my-3 text-red-700 bg-red-200 rounded-lg text-sm">
            {formState.message}
          </div>
        )}
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              disabled={isLoading}
              onClick={onSubmit}
              className="disabled:opacity-50 disabled:cursor-default disabled:hover:bg-[#ECB84A] ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ECB84A] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            >
              Publica
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
