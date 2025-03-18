"use client";

import { Search } from "./search";
import React, { useState } from "react";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";
import Image from "next/image";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="border-b sticky top-0 z-10 bg-white">
      <div className="flex h-16 items-center md:px-16 px-4">
        <a href="/" className="flex-shrink-0">
          <Image src={"/logo-black.svg"} alt="Logo" width={120} height={40} className="cursor-pointer"/>
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <MainNav className="mx-6" />
        </div>
        
        <div className="ml-auto flex items-center">
          {/* Desktop User Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <UserNav />
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden ml-4 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 py-3 bg-white border-t">
          <div className="flex flex-col space-y-4">
            <MainNav className="flex flex-col space-y-2" />
            <hr className="border-gray-200" />
            <div className="flex justify-end">
              <UserNav />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
