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
  const [endDate, setEndDate] = useState(setMinutes(new Date(startDate), 60));

  useEffect(() => {
    if (startDate > endDate) setEndDate(setMinutes(startDate, 60));
  }, [startDate, endDate]);

  const onChangeStart = (date) => {
    onChange("startDate", date);
    setStartDate(date);
  };
  const onChangeEnd = (date) => {
    onChange("endDate", date);
    setEndDate(date);
  };

  return (
    <>
      <div className="sm:col-span-3">
        <label
          htmlFor="first-name"
          className="block text-sm font-medium text-gray-700"
        >
          Inici *
        </label>
        <div className="mt-1">
          <DateComponent
            selected={startDate}
            onChange={onChangeStart}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
      <div className="sm:col-span-3">
        <label
          htmlFor="first-name"
          className="block text-sm font-medium text-gray-700"
        >
          Final *
        </label>
        <div className="mt-1">
          <DateComponent
            selected={endDate}
            onChange={onChangeEnd}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </div>
      </div>
    </>
  );
}

const DateComponent = ({
  selected,
  startDate,
  endDate,
  onChange,
  selectsStart,
  selectsEnd,
  minDate,
}) => {
  return (
    <DatePicker
      locale={ca}
      selected={selected}
      onChange={onChange}
      showTimeSelect
      selectsStart={!!selectsStart}
      selectsEnd={!!selectsEnd}
      startDate={startDate}
      endDate={endDate}
      minDate={minDate}
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
      className="capitalize w-full mb-1 shadow-sm block p-2 sm:text-sm border border-gray-300 rounded-md focus:border-grey-300"
    >
      {value}
    </button>
  );
});

ButtonInput.displayName = "ButtonInput";
