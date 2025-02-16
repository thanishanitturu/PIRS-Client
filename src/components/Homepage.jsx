import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (

    <>
   <div className="relative bg-gray-50 h-[100vh] flex items-center justify-center">
  {/* Overlay for better text visibility */}
  <div className="absolute inset-0 bg-gray-50"></div>

  {/* Content */}
  <div className="relative z-10 text-center px-6 md:px-8 lg:px-10 max-w-[90vw]">
    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold text-blue-600">
      Empowering Communities, Resolving Issues
    </h1>
    <p className="text-sm sm:text-base md:text-lg mt-4 text-gray-800 leading-relaxed">
      Welcome to the Public Issue Reporting System, a platform dedicated to
      enabling citizens to report community issues efficiently. Whether it's
      broken streetlights, potholes, or any public inconvenience, we bridge
      the gap between citizens and authorities to ensure a timely resolution.
    </p>
    <Link to="/issue-report">
      <button
        className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
      >
        Report an Issue
      </button>
    </Link>
  </div>
</div>


    {/* About page snipped */}
    <div className="bg-gray-50 rounded-lg shadow-md p-6 w-full lg:pl-12 lg:pr-12">
  {/* Heading */}
  <div className="text-center mb-6">
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-600 mb-12">
      About Us
    </h2>
  </div>

  {/* Left side: Image and Right side: Description and Button */}
  <div className="flex flex-col lg:flex-row items-center">
    {/* Left side: Image */}
    <div className="lg:w-1/2 mb-6 lg:mb-0">
      <img
        src={"https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg"} // Replace with your image path
        alt="About Us"
        className="w-full max-h-64  rounded-lg"
      />
    </div>

    {/* Right side: Description and Button */}
    <div className="lg:w-1/2 text-center lg:text-left lg:pl-6">
      <p className="text-gray-800 text-base sm:text-lg lg:text-xl leading-relaxed mb-6">
        Discover how the Public Issue Reporting System empowers citizens to report
        civic issues efficiently. From damaged roads to uncollected garbage, our
        platform bridges the gap between the community and relevant authorities.
      </p>
      <Link to="/about">
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
          Learn More...
        </button>
      </Link>
    </div>
  </div>
</div>




    {/* Community Dashbord */}
    {/* Community Dashboard */}
<div className="bg-gray-50 rounded-lg shadow-md p-6 w-full lg:pl-12 lg:pr-12">
  {/* Heading */}
  <div className="text-center mb-6">
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-600 mb-12">
      Community Empowerment
    </h2>
  </div>

  {/* Left side: Description and Button, Right side: Image */}
  <div className="flex flex-col lg:flex-row items-center">
    {/* Left side: Description and Button */}
    <div className="lg:w-1/2 text-center lg:text-left lg:pl-6 mb-6 lg:mb-0">
      <p className="text-gray-800 text-base sm:text-lg lg:text-xl leading-relaxed mb-4">
        Join our community of active citizens working together to resolve public
        inconveniences efficiently. From reporting issues to tracking their
        resolutions, we provide a platform for collective action and accountability.
      </p>
      <Link to="/community">
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
          Involve Now..
        </button>
      </Link>
    </div>

    {/* Right side: Image */}
    <div className="lg:w-1/2">
      <img
        src={"https://res.cloudinary.com/dgye02qt9/image/upload/v1737872787/community1_k5j4ik.jpg"} // Replace with your image path
        alt="Community Empowerment"
        className="w-full h-auto rounded-lg max-h-64 object-cover"
      />
    </div>
  </div>
</div>



    </>


  );
};

export default Homepage;
