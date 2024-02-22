"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages?: number;
  term: string;
  //changePage: (change: number) => void;
};

export default function Pagination({
  currentPage,
  term,
  // changePage,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const changePage = (change: number) => {
    const newPage = currentPage + change;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(term, newPage.toString());
    router.push(`/?${newSearchParams.toString()}`, { scroll: false });
  };
  return (
    <div className="flex justify-between sticky bottom-0">
      <button
        disabled={currentPage === 0}
        onClick={() => changePage(-1)}
        className="text-gray-600 bg-emerald-400 hover:bg-emerald-600 focus:ring-4  
focus:ring-blue-300 font-semibold rounded-md px-8 py-4 cursor-pointer border-none focus:outline-none capitalize mx-1"
        type="button"
      >
        <div className="flex items-center -mx-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mx-1 rtl:-scale-x-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>

          <span className="mx-1">previous</span>
        </div>
      </button>
      <button
        onClick={() => changePage(1)}
        className="text-gray-600 bg-emerald-400 hover:bg-emerald-600 focus:ring-4 capitalize
focus:ring-blue-300 font-semibold rounded-md px-8 py-4 cursor-pointer border-none focus:outline-none mx-1"
        type="button"
      >
        <div className="flex items-center -mx-1">
          <span className="mx-1">Next</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mx-1 rtl:-scale-x-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </button>
    </div>
  );
}
