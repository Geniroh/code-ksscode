import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <section className="h-screen w-full flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-lg">
        <Image
          src="/images/notfound.svg" // Ensure this image exists in the "public/images" folder
          alt="Page not found"
          width={400}
          height={300}
          className="mx-auto"
        />
        <h1 className="text-3xl font-bold mt-6">Oops! Page not found</h1>
        <p className="text-gray-600 mt-2">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 text-sm rounded-lg hover:bg-blue-700 transition"
        >
          Go back home
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
