"use client";

import { Sheet } from "react-modal-sheet";
import { Filter } from "./filter";
import Link from "next/link";
import {
  ChangeEvent,
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { IoMdFunnel } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";
import { BackButton_md } from "../back/BackButton";
import {
  defaultFilterValue,
  FilterValueParams,
} from "@/components/in-search/search-home-page";

interface autoFocusd {
  focus?: RefObject<HTMLInputElement>;
  buttonBack?: boolean;
  isFilterDisplay?: boolean;
  // setSearchValue?: Dispatch<SetStateAction<string>>;
  onChangeFilterValues?: (value: FilterValueParams) => void;
  searchValue?: string;
  onChangeSearchValue: (value: string) => void;
}

export const Search: React.FC<autoFocusd> = ({
  focus,
  buttonBack,
  isFilterDisplay = false,
  onChangeFilterValues,
  searchValue,
  onChangeSearchValue,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [filterValues, setFilterValues] = useState(defaultFilterValue);

  const handleCompleteFilter = () => {
    onChangeFilterValues!(filterValues);
    setOpen(false);
  };

  useEffect(() => {
    if (focus?.current) {
      focus?.current.focus();
    }
  }, [focus]);

  function handleReset() {
    setFilterValues(defaultFilterValue);
  }
  function handleInputOnChange(e: ChangeEvent<HTMLInputElement>) {
    onChangeSearchValue(e.target.value);
  }

  return (
    <>
      {isFilterDisplay && (
        <button
          onClick={() => setOpen(true)}
          className="absolute translate-y-[16px] right-3 top-1 z-50 "
        >
          <IoMdFunnel size={22} className="text-primaryCam" />
        </button>
      )}

      <div className="flex items-center w-full">
        <div className={` ${buttonBack ? "block" : "hidden"} `}>
          <Link href={"../home"}>
            <BackButton_md styles=" bg-white p-3 px-4 rounded-xl top-5 left-3 " />
          </Link>
        </div>
        <Link href="/search" className="w-full ">
          <div className="absolute translate-y-[3px] translate-x-1  z-10 bg-gradient-to-r from-[#FF5858] to-primaryCam rounded-full p-3.5 ">
            <AiOutlineSearch size={22} color="#ffff" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={handleInputOnChange}
            ref={focus || undefined}
            placeholder="Search Job vacancy"
            className="relative w-full p-4 pl-16 shadow-md outline-none placeholder:text-md bg-whit rounded-2xl "
          />
        </Link>
      </div>
      {isFilterDisplay && (
        <Sheet
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          snapPoints={[750, 400, 0]}
        >
          <Sheet.Container>
            <Sheet.Header />
            <div className="container flex justify-between pb-5 ">
              <button className="text-lg text-primaryCam">{"Filter"}</button>
              <button onClick={handleReset} className="text-lg text-primaryCam">
                {"Reset"}
              </button>
            </div>
            <Sheet.Content>
              <Filter
                filterValues={filterValues}
                setFilterValues={setFilterValues}
                setIsopen={setOpen}
                handleCompleteFilter={handleCompleteFilter}
              />
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
      )}
    </>
  );
};
