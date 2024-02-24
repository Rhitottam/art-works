"use client";
import React from "react";
import StyledButton from "./StyledButton";
import { signIn } from "next-auth/react";

type Props = {};

export default function Authenticate({}: Props) {
  return (
    <section className="bg-transparent">
      <div className="container flex items-center px-6 py-12 mx-auto">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="animate-push-pull p-3 text-sm font-medium text-emerald-500 rounded-full bg-emerald-50 dark:bg-emerald-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </p>
          <h1 className="relative font-mono mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            <span className="animate-bounce absolute top-2">_</span> Unable to
            retrieve results.
          </h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Please authenticate or refresh your session to view results.
          </p>

          <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
            <StyledButton
              className="flex items-center justify-center w-full gap-1"
              onClick={() => {
                signIn("deviantart");
              }}
            >
              Login
            </StyledButton>
          </div>
        </div>
      </div>
    </section>
  );
}
