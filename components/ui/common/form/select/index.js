import { LOCATIONS_ARRAY } from "@utils/constants";
import CreatableSelect from "react-select/creatable";
import { useState } from "react";

const customStyles = {
  container: (provided, state) => ({
    ...provided,
    borderColor: "#D1D5DB !important",
  }),
  input: (provided, state) => ({
    ...provided,
    borderColor: state.isSelected ? "#D1D5DB !important" : "#D1D5DB !important",
    borderColor: state.isFocused ? "#D1D5DB !important" : "#D1D5DB !important",
  }),
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isSelected ? "#D1D5DB !important" : "#D1D5DB !important",
    borderColor: state.isFocused ? "#D1D5DB !important" : "#D1D5DB !important",
    boxShadow: state.isFocused ? "#D1D5DB !important" : "#D1D5DB !important",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

export default function SelectComponent({ id, title, onChange }) {
  const [selectedOption, setSelectedOption] = useState(null);

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
