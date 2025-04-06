import React from "react";
import Statistics from "./Statistics";
import MapComponent from "./MapComponent";
import Contributors from "./Contributors";

const StatisticsLayout = ({initialIssues}) => {
  return (
    <div className="flex flex-col md:flex-row bg-gray-50 text-gray-800 p-6 gap-6 w-full">
    {/* Left Side: Statistics */}
    <div className="w-full md:basis-2/12 border-l-4">
      <Statistics initialIssues={initialIssues} />
    </div>
  
    {/* Middle: Map */}
    <div className="w-full md:basis-6/12">
      <MapComponent issues={initialIssues}/>
    </div>
  
    {/* Right Side: Contributors */}
    <div className="w-full md:basis-4/12 border-l-4">
      <Contributors />
    </div>
  </div>
  
  );
};

export default StatisticsLayout;
