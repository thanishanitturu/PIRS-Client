import React from "react";

const HeadingComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-gray-50 p-6">
      <h1 className="text-2xl md:text-4xl font-bold text-blue-600 mb-4 mt-2">
        Welcome to the Community Page
      </h1>
      <p className="text-base md:text-lg text-gray-800 ">
        Join us in making our community better by reporting issues, sharing
        updates, and participating in civic discussions. Together, we can build
        a stronger and more connected society.
      </p>
    </div>
  );
};

export default HeadingComponent;
