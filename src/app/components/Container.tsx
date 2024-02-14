"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Container({ children }: Props) {
  return <SessionProvider refetchInterval={5 * 60}>{children}</SessionProvider>;
}