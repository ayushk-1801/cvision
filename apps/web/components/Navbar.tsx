import { Search } from "./search";
import React from "react";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";

function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <UserNav />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
