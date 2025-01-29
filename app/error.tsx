"use client";

import React, { useEffect } from "react";
import Image from "next/image";

const ErrorPage = ({ error, reset }: { error: Error; reset: () => void }) => {
  useEffect(() => {
    console.error("Error caught:", error);
  }, [error]);

  return (
    <section className="h-screen w-full flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-lg">
        <Image
          src="./images/error2.svg"
          alt="Error"
          width={400}
          height={300}
          className="mx-auto"
        />
        <h1 className="text-3xl font-bold mt-6">Something went wrong</h1>
        <p className="text-gray-600 mt-2">
          An unexpected error occurred. Try refreshing the page.
        </p>
        <button
          onClick={reset}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-red-700 transition"
        >
          Refresh Page
        </button>
      </div>
    </section>
  );
};

export default ErrorPage;
