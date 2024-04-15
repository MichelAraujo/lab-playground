"use client"

import CatImage from "@/components/cat-image";

export default function Home() {
  return (
    <main className="flex flex-col justify-between">
      <div className="w-full justify-between font-mono text-sm lg:flex">
        <h1>Show and Hide a Cat!</h1>
        <br />
        <CatImage />
      </div>
    </main>
  );
}
