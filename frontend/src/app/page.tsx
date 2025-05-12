"use client"

import {GetInfoFromBackend} from "...@/app/components/getInfoFromBackend";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-3xl border-gray-500">
     <h1>Hello there My name is Elliott</h1>
        <GetInfoFromBackend />
    </div>
  );
}
