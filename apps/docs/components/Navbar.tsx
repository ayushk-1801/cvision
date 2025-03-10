import { Search } from "./search";
import React from "react";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";
import Image from "next/image";
import { Badge } from "./ui/badge";

function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center md:px-16 px-8 sticky top-0 z-10 bg-white ">
        <a href="/" className="flex items-center">
          <Image
            src={"/logo-black.svg"}
            alt="Logo"
            width={120}
            height={40}
            className="cursor-pointer"
          />
          <Badge className="ml-2 rounded-full bg-green-700 hover:bg-green-700">
            Recruiter
          </Badge>
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
