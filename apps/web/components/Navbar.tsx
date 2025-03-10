import { Search } from "./search";
import React from "react";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";
import Image from "next/image";

function Navbar() {
  return (
    <div className="border-b sticky top-0 z-10 bg-white">
      <div className="flex h-16 items-center md:px-16 px-8">
        <a href="/">
          <Image src={"/logo-black.svg"} alt="Logo" width={120} height={40} className="cursor-pointer"/>
        </a>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
