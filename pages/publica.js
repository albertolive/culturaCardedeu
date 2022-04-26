import { useState, useEffect } from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
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

const _createFormState = (isDisabled = false, message = "") => ({
  isDisabled,
  message,
});

const createFormState = ({
  title,
  description,
  startDate,
  endDate,
  location,
}) => {
  if (!title) {
    return _createFormState(true, "Títol obligatori");
  }

  return _createFormState();
};

export default function Publica() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [form, setForm] = useState(defaultForm);

  let formState = _createFormState();

  const handleChange = ({ target: { name, value } }) =>
    setForm({ ...form, [name]: value });

  const handleChangeDate = (name, value) => setForm({ ...form, [name]: value });

  const handleChangeLocation = ({ value }) =>
    setForm({ ...form, location: value });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 divide-y divide-gray-200 max-w-3xl mx-auto"
    >
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
              register={register}
              id="title"
              title="Títol *"
              value={form.title}
              onChange={handleChange}
            />

            <TextArea
              {...register("description")}
              id="description"
              onChange={handleChange}
            />

            <Select
              id="location"
              {...register("location")}
              title="Localització *"
              onChange={handleChangeLocation}
            />

            <DatePicker onChange={handleChangeDate} />
          </div>
        </div>
      </div>
      {errors?.name && errors.name.message}
      {formState.message && (
        <div className="p-4 my-3 text-red-700 bg-red-200 rounded-lg text-sm">
          {formState.message}
        </div>
      )}
      <div className="pt-5">
        <div className="flex justify-end">
          <input
            type="submit"
            value="Publica"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ECB84A] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </form>
  );
}
