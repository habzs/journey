"use client";

import { FaceFrownIcon } from "@heroicons/react/24/outline";

const Error = () => {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <FaceFrownIcon className="size-32" />
      <div>
        <h1 className="font-mono">404</h1>
        <h3 className="opacity-40 font-mono">Page not found</h3>
      </div>
      <p className="text-base">
        The page you&apos;re looking for cannot be found. If you believe this to
        be a mistake, please contact us.
      </p>
    </div>
  );
};

export default Error;
