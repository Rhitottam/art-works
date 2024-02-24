import { cn } from "@/src/lib/utils";
import React, { ButtonHTMLAttributes } from "react";

type Props = {
  children?: React.ReactNode;
} & React.HTMLProps<HTMLButtonElement>;

export default function StyledButton({ children, className, ...rest }: Props) {
  return (
    <button
      className={cn(
        `text-gray-600 bg-emerald-400 hover:bg-emerald-600 focus:ring-4  
focus:ring-blue-300 font-semibold rounded-full px-8 py-4 cursor-pointer border-none focus:outline-none`,
        className,
      )}
      type="button"
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children ?? "Button"}
    </button>
  );
}
