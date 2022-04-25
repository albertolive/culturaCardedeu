import { forwardRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { format } from "date-fns";
import { ca } from "date-fns/locale";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

import "react-datepicker/dist/react-datepicker.css";

export default function DatePickerComponent({ onChange }) {
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 0), 9)
  );
  const [endDate, setEndDate] = useState(new Date(startDate));

  useEffect(() => {
    if (startDate > endDate) setStartDate(endDate);
  }, [endDate]);

  useEffect(() => {
    if (startDate > endDate) setEndDate(startDate);
  }, [startDate]);

  const onChangeStart = (date) => {
    onChange("startDate", date);
    setStartDate(date);
  };
  const onChangeEnd = (date) => {
    onChange("endDate", date);
    setEndDate(date);
  };

  return (
    <div className="mt-2 relative rounded-md">
      <div className="flex flex-col max-w-2xl mx-auto">
        <div className="relative w-full">
          <div className="mb-1">
            <label className="mb-2 font-bold">Inici</label>
          </div>
          <DateComponent
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            onChange={onChangeStart}
          />
        </div>
        <div className="relative w-full">
          <div className="mb-1">
            <label className="mb-2 font-bold">Final</label>
          </div>
          <DateComponent
            selected={endDate}
            startDate={startDate}
            endDate={endDate}
            onChange={onChangeEnd}
          />
        </div>
      </div>
    </div>
  );
}

const DateComponent = ({ selected, startDate, endDate, onChange }) => {
  return (
    <DatePicker
      locale={ca}
      selected={selected}
      onChange={onChange}
      showTimeSelect
      selectsStart
      startDate={startDate}
      endDate={endDate}
      nextMonthButtonLabel=">"
      previousMonthButtonLabel="<"
      popperClassName="react-datepicker-left"
      popperPlacement="top-end"
      dateFormat="d MMMM, yyyy h:mm aa"
      customInput={<ButtonInput />}
      renderCustomHeader={({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-lg text-gray-700 capitalize">
            {format(date, "MMMM yyyy", { locale: ca })}
          </span>

          <div className="space-x-2">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              type="button"
              className={`${
                prevMonthButtonDisabled && "cursor-not-allowed opacity-50"
              }inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500`}
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              type="button"
              className={`${
                nextMonthButtonDisabled && "cursor-not-allowed opacity-50"
              }inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500`}
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    />
  );
};

const ButtonInput = forwardRef(({ value, onClick }, ref) => {
  return (
    <button
      onClick={onClick}
      ref={ref}
      type="button"
      className="capitalize w-full mb-1 shadow-sm block p-2 sm:text-sm border border-gray-200 rounded-md focus:border-yellow-500"
    >
      {value}
    </button>
  );
});
