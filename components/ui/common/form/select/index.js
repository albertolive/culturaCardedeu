import { LOCATIONS_ARRAY } from "@utils/constants";
import CreatableSelect from "react-select/creatable";
import { useState } from "react";

const customStyles = {
  container: (provided) => ({
    ...provided,
    borderColor: "#D1D5DB !important",
  }),
  input: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    borderColor: state.isSelected ? "#D1D5DB !important" : "#D1D5DB !important",
    borderColor: state.isFocused ? "#D1D5DB !important" : "#D1D5DB !important",
  }),
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isSelected ? "#D1D5DB !important" : "#D1D5DB !important",
    borderColor: state.isFocused ? "#D1D5DB !important" : "#D1D5DB !important",
    boxShadow: state.isFocused ? "#D1D5DB !important" : "#D1D5DB !important",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
  option: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

export default function SelectComponent({
  id,
  title,
  value: initialValue = null,
  onChange,
}) {
  const [selectedOption, setSelectedOption] = useState({
    value: initialValue,
    label: initialValue,
  });

  const handleChange = (value) => {
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div className="sm:col-span-6">
      <label
        htmlFor="first-name"
        className="block text-sm font-medium text-gray-700"
      >
        {title}
      </label>
      <div className="mt-1 select-container">
        <CreatableSelect
          id={id}
          instanceId={id}
          isSearchable
          autoComplete
          formatCreateLabel={(inputValue) => `Afegir nou lloc: "${inputValue}"`}
          placeholder="Selecciona una opció"
          defaultValue={selectedOption}
          value={selectedOption}
          onChange={handleChange}
          options={LOCATIONS_ARRAY}
          styles={customStyles}
        />
      </div>
    </div>
  );
}
