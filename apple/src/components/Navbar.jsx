import React from "react";
import { appleImg } from "../utils";
import { searchImg } from "../utils";
import { bagImg } from "../utils";
import { navLists } from "../constants";
export default function Navbar() {
  return (
    <header className="w-full py-5 sm:px-5 flex justify-between items-center">
      <nav className="flex w-full screen-max-width">
        <img src={appleImg} alt="Apple" width={14} height={18} />

        <div className="flex flex-1 justify-center max-sm:hidden">
          {navLists.map((nav) => (
            <div key={nav}>{nav}</div>
          ))}
        </div>

        <div>
          <img src={searchImg} alt="search" width={18} height={18} />
          <img src={bagImg} alt="bag" width={18} height={18} />
        </div>
      </nav>
    </header>
  );
}
