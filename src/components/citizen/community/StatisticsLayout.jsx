import React from "react";
import Statistics from "./Statistics";
import MapComponent from "./MapComponent";
import Contributors from "./Contributors";

const StatisticsLayout = ({ initialIssues }) => {
  return (
    <div className="w-full bg-gray-50 p-2 sm:p-4">
      {/* Mobile View (Full width with peekable horizontal scroll) */}
      <div className="md:hidden w-full">
        <div className="relative">
          <div className="overflow-x-auto pb-6 snap-x snap-mandatory">
            <div className="flex space-x-4 w-max min-w-full">
              {/* Statistics - Takes full width initially */}
              <div className="w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] flex-shrink-0 bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500 snap-start">
                <Statistics initialIssues={initialIssues} mobileView />
              </div>
              
              {/* Map - Peekable next item */}
              <div className="w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] flex-shrink-0 bg-white rounded-xl shadow-sm p-4 snap-start">
                <MapComponent issues={initialIssues} mobileView />
              </div>
              
              {/* Contributors - Peekable next item */}
              <div className="w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] flex-shrink-0 bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500 snap-start">
                <Contributors mobileView />
              </div>
            </div>
          </div>
          
          {/* Scroll indicator for mobile */}
          <div className="flex justify-center space-x-2 mt-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="w-3 h-3 rounded-full bg-gray-300"></span>
            <span className="w-3 h-3 rounded-full bg-gray-300"></span>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex flex-col md:flex-row gap-6 w-full">
        {/* Left Side: Statistics */}
        <div className="w-full md:basis-2/12 bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <Statistics initialIssues={initialIssues} />
        </div>
      
        {/* Middle: Map */}
        <div className="w-full md:basis-6/12 bg-white rounded-xl shadow-sm p-4">
          <MapComponent issues={initialIssues} />
        </div>
      
        {/* Right Side: Contributors */}
        <div className="w-full md:basis-4/12 bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <Contributors />
        </div>
      </div>
    </div>
  );
};

export default StatisticsLayout;