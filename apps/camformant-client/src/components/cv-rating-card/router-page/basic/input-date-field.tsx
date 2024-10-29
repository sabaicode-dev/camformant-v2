"use client";
import React, { useEffect, useState } from "react";

interface typeofInputDete {
  setOpen: (value: boolean) => void;
  setDay: (value: string) => void;
  day: string;
  setMonth: (value: string) => void;
  month: string;
  setYear: (value: string) => void;
  year: string;
  setSubmitted: (value: boolean) => void;
}

const InputDate: React.FC<typeofInputDete> = ({
  setOpen,
  setDay,
  setMonth,
  setYear,
  day,
  month,
  year,
  setSubmitted,
}) => {
  const [sumbit, setSubmit] = useState<boolean>(false);

  useEffect(() => {
    if (day === "" || null || undefined) {
      setSubmit(false);
    } else if (month === "" || null || undefined) {
      setSubmit(false);
    } else if (year === "" || null || undefined) {
      setSubmit(false);
    } else {
      setSubmit(true);
    }
  }, [day, month, year]);

  function Sumbit() {
    if (sumbit === false) {
    } else {
      setOpen(false);
      setSubmitted(true);
    }
  }

  return (
    <div className="container flex flex-col justify-between w-full h-full ">
      <div className="container flex flex-row items-center justify-center w-full h-full gap-4 ">
        <input
          type="number"
          placeholder="Date"
          min={1}
          max={2}
          className="w-24 p-5 shadow-md outline-none rounded-xl"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
        <input
          type="number"
          placeholder="Month"
          className="w-24 p-5 shadow-md outline-none rounded-xl"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          className="w-24 p-5 shadow-md outline-none rounded-xl"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      <div className="pb-10">
        <button
          onClick={Sumbit}
          className={`p-5 ${sumbit ? "bg-primaryCam" : " bg-slate-300"}  w-full rounded-2xl text-white`}
        >
          {" "}
          Done{" "}
        </button>
      </div>
    </div>
  );
};

export default InputDate;
