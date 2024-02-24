"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

type Props = {};

export default function NavBar({}: Props) {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-black px-2 sm:px-4 py-3.5 rounded-sm text-base z-20 sticky top-0">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <span className="self-center text-xl font-semibold">
          <span className="font-bold text-emerald-400 text-xl">Art</span>
          {/* <span className="font-semibold  text-emerald-300 text-3xl">Works</span> */}

          <span className="font-semibold bg-gradient-to-r from-emerald-700 via-emerald-300 to-emerald-800 text-transparent bg-clip-text text-3xl">
            Works
          </span>
        </span>
        <div className="gap-2 flex flex-col items-center justify-between sm:flex-row">
          {!session?.user?.name ? (
            <button
              className="text-gray-600 bg-emerald-400 hover:bg-emerald-600 focus:ring-4  
focus:ring-blue-300 font-semibold rounded-full px-8 py-4 cursor-pointer border-none focus:outline-none"
              type="button"
              onClick={() => {
                signIn("deviantart");
              }}
            >
              Login with Deviant Art
            </button>
          ) : (
            <div className="flex items-center gap-x-2">
              <img
                className="object-cover w-7 h-7 rounded-full"
                src={session?.user?.image ?? ""}
                alt="profile picture"
              />

              <div>
                <h1 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
                  {session?.user?.name ?? "__0_0__"}
                </h1>
              </div>
              <button
                className="text-gray-600 bg-emerald-400 hover:bg-emerald-600 focus:ring-4  
focus:ring-blue-300 font-semibold rounded-full text-sm px-8 py-4 cursor-pointer border-none focus:outline-none"
                type="button"
                onClick={() => {
                  signOut();
                }}
              >
                Logout
              </button>
            </div>
          )}
          {/* <button
            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4  
focus:ring-blue-300 font-semibold rounded-full text-sm px-8 py-4 cursor-pointer border-none focus:outline-none"
            type="button"
          >
            Login with Pinterest
          </button> */}
        </div>
      </div>
    </nav>
  );
}
