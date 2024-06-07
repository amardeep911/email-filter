"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const MobileNav = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { data: session, status } = useSession();
console.log(session)
  const toggleOpen = () => setOpen((prev) => !prev);

  const pathname = usePathname();

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      setOpen(false);
    }
  };

  return (
    <div className="sm:hidden">
      <Menu
        onClick={toggleOpen}
        className="relative z-50 pl-0.5 h-5 w-5 text-zinc-700"
      />

      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            <li>
              <Link
                onClick={() => closeOnCurrent("/")}
                className="flex items-center w-full font-semibold text-green-600"
                href="/"
              >
                Home
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </li>
            <li className="my-3 h-px w-full bg-gray-300" />
            <li>
              <Link
                onClick={() => closeOnCurrent("/sign-in")}
                className="flex items-center w-full font-semibold"
                href="/Project"
              >
                Project
              </Link>
            </li>
            <li className="my-3 h-px w-full bg-gray-300" />
            <li>
              <Link
                onClick={() => closeOnCurrent("/Dashboard")}
                className="flex items-center w-full font-semibold"
                href="/Dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li className="my-3 h-px w-full bg-gray-300" />
            <li>
              <Link
                onClick={() => closeOnCurrent("/contact")}
                className="flex items-center w-full font-semibold"
                href="/contact"
              >
                Contact
              </Link>
            </li>
            <li className="my-3 h-px w-full bg-gray-300" />
            <li>
              {session ? (
                <Link
                  href="/api/auth/signout?callbackUrl=/"
                  className="flex items-center w-full text-red-600 font-semibold"
                >
                  Logout 
                </Link>
              ) : (
                <Link
                  href="/api/auth/signin"
                  className="flex items-center w-full font-semibold"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;
