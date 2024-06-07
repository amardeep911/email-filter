"use client";
import Link from "next/link";
import React from "react";

type Props = {};
import { useSession } from "next-auth/react";

const NavItems = (props: Props) => {
  const { data: session } = useSession();
  const firstLetter = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "";

  return (
    <div className="flex gap-4 h-full">
      <ul className="flex h-full items-center gap-6">
        <li>
          {session ? (
            <Link
              href="/api/auth/signout?callbackUrl=/"
              className="text-red-500 font-semibold"
            >
              Logout
            </Link>
          ) : (
            <Link href="/api/auth/signin">Login</Link>
          )}
        </li>
        <li>
          <p className="font-semibold text-xl text-blue-700">
            {session ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white font-semibold">
                  {firstLetter}
                </div>
                <p>{session.user?.email}</p>
              </div>
            ) : (
              <p className="font-bold text-xl text-blue-700">Guest</p>
            )}
          </p>
        </li>
      </ul>
    </div>
  );
};

export default NavItems;
