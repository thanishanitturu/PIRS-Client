import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-600 text-white py-[3vh] mt-[4vh] mt-1">
      <div className="max-w-[1200px] mx-auto px-[5vw] flex justify-center flex-wrap">
        {/* Left Section: Copyright */}
        <div className="text-[0.9vw] md:text-[1.1vw]">
          <p>&copy; 2025 Public Issue Reporting System. All rights reserved.</p>
        </div>     
      </div>
    </footer>
  );
};

export default Footer;
