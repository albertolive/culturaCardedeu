import { LOCATIONS_ARRAY } from "@utils/constants";
import Select from "react-select";
import { useState } from "react";

export default function SelectComponent({ id, title, onChange }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (value) => {
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div className="mt-2 relative rounded-md">
      <div className="mb-1">
        <label className="mb-2 font-bold">{title}</label>
      </div>
      <div className="text-sm">
        <Select
          id={id}
          isSearchable
          autoComplete
          placeholder="Selecciona una opció"
          noOptionsMessage={() => "Lloc no trobat"}
          defaultValue={selectedOption}
          value={selectedOption}
          onChange={handleChange}
          options={LOCATIONS_ARRAY}
        />
      </div>
    </div>
  );
}
