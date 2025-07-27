import React from "react";

const AuthErrorPage = async () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-heading md:text-6xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-lg text-body md:text-xl font-light text-center">
          Oops seems there was an error during authentication. Please try again.
        </p>
      </div>
    </div>
  );
};

export default AuthErrorPage;
