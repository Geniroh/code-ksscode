import React from "react";

interface SearchParams {
  error?: string;
  code?: string;
}

interface AuthErrorPageProps {
  searchParams: SearchParams;
}

const AuthErrorPage = async ({ searchParams }: AuthErrorPageProps) => {
  console.log({ searchParams: await searchParams });
  return <div>AuthErrorPage</div>;
};

export default AuthErrorPage;
