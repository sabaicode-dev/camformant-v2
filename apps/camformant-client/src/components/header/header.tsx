/* eslint-disable react/no-unescaped-entities */
"use client";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { AiFillCaretDown } from "react-icons/ai";
import { FaBell } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { Search } from "../search/search";
import logoTeam from "../../../public/images/Sabailogo.gif";
import ButtonLanguage from "../change-language/button-language";

const people = [
  { name: "Phnom Penh" },
  { name: "Kompng Thom" },
  { name: "Siem Reap" },
  { name: "kep" },
  { name: "Kompong Som" },
];

export const Header: React.FC = () => {
  const [selected, setSelected] = useState(people[0]);

  return (
    <div className="container pt-10 pb-10 ">
      <div className="flex flex-col justify-between h-40 bg-mybg-linear rounded-2xl">
        <div className="flex justify-start w-full">
          <Image
            className="bg-red-500 shadow-orange-700 shadow-md mt-[-20px] rounded-tl-lg rounded-e-[50px]"
            src={logoTeam}
            alt={"logo"}
            width={100}
          />
        </div>
        <div className="flex justify-between pl-3 pr-3">
          <div>
            <div className="mb-4">
              <Listbox value={selected} onChange={setSelected}>
                <div className="relative w-32 ">
                  <Listbox.Button className="flex items-center justify-between space-x-3 text-white rounded-lg">
                    <span className="block truncate">{selected.name}</span>
                    <AiFillCaretDown
                      className="w-4 h-4 text-white"
                      aria-hidden="true"
                    />
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-50 w-full mt-1 overflow-auto bg-white rounded-lg shadow-lg">
                      {people.map((person, personIdx) => (
                        <Listbox.Option
                          key={personIdx}
                          className={({ active }) =>
                            ` py-2 px-2 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={person}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {person.name}
                              </span>
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            <div className="w-10 h-5 ">
              <ButtonLanguage />
            </div>
          </div>
          <div
            className={`flex items-center justify-center rounded-[20px] border-4 border-solid border-orange-200 bg-white drop-shadow-lg`}
          >
            <Link
              href="notification"
              className="flex items-center justify-center h-full"
            >
              <div className="p-4 bg-white rounded-full">
                <FaBell size={20} color="#FF7300" />
              </div>
            </Link>
          </div>
        </div>
        <div className="pl-3 pr-3 mb-[-25px]">
          <Search />
        </div>
      </div>
    </div>
  );
};
