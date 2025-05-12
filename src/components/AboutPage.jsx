import React from "react";
import { FaBullseye, FaLightbulb, FaCogs, FaChartLine, FaEnvelope, FaPhone ,FaUsers,FaMapMarkerAlt,FaBell} from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Header */}
      <div className="bg-gray-50 text-blue py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue">
            About Public Issue Reporting System
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue">
            Empowering citizens to create cleaner, safer, and more efficient communities
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Project Overview */}
<section className="mb-8 md:mb-16 bg-gray-50 p-6 md:p-8 rounded-xl">
  <div className="flex flex-col md:flex-row md:items-start">
    {/* Icon - Centered on mobile, left-aligned on desktop */}
    <div className="flex justify-center md:block mb-4 md:mb-0 md:mr-6">
      <div className="bg-blue-100 p-3 rounded-full inline-flex md:block">
        <FaLightbulb className="text-blue-600 text-2xl" />
      </div>
    </div>
    
    <div className="text-center md:text-left">
      <h2 className="text-2xl font-bold text-gray-800 mb-3 md:mb-4">
        Project Overview
      </h2>
      <p className="text-gray-600 leading-relaxed">
        The Public Issue Reporting System is a civic engagement platform designed to bridge 
        the gap between citizens and local authorities. By providing a simple way to report 
        infrastructure issues, we aim to improve public spaces and foster community participation 
        in maintenance and development.
      </p>
    </div>
  </div>
</section>

        {/* Why We Built This */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
            Why We Built This Platform
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">The Problem</h3>
              <p className="text-gray-600">
                Citizens often struggle to report public issues effectively - unclear processes, 
                bureaucratic hurdles, and lack of transparency lead to unresolved problems and 
                deteriorating public spaces.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Our Solution</h3>
              <p className="text-gray-600">
                A unified platform that simplifies reporting, ensures proper routing to authorities, 
                and provides transparency through tracking - making civic engagement accessible to all.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <FaBullseye className="text-blue-600 text-2xl" />,
                title: "Issue Reporting",
                desc: "Easy photo-based reporting with categorization"
              },
              {
                icon: <FaCogs className="text-blue-600 text-2xl" />,
                title: "Automated Routing",
                desc: "Smart system directs reports to correct departments"
              },
              {
                icon: <FaChartLine className="text-blue-600 text-2xl" />,
                title: "Progress Tracking",
                desc: "Real-time updates on issue resolution status"
              },
              {
                icon: <FaUsers className="text-blue-600 text-2xl" />,
                title: "Community Participation",
                desc: "Voting and commenting on important issues"
              },
              {
                icon: <FaMapMarkerAlt className="text-blue-600 text-2xl" />,
                title: "Location Mapping",
                desc: "Visual representation of reported problems"
              },
              {
                icon: <FaBell className="text-blue-600 text-2xl" />,
                title: "Notifications",
                desc: "Alerts when issues are resolved"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                </div>
                <p className="text-gray-600 pl-12">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission and Vision */}
        <section className="mb-16 bg-blue-50 p-8 rounded-xl">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                To create transparent, efficient communication channels between citizens 
                and local authorities, ensuring public issues are addressed promptly and 
                communities can actively participate in improving their surroundings.
              </p>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                A world where technology bridges the gap between people and their governments, 
                where every citizen has the tools to contribute to community development, and 
                where public services are responsive and accountable.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
            How It Works
          </h2>
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Report an Issue",
                desc: "Capture an image, describe the problem, and select the appropriate category (roads, waste, lighting, etc.)"
              },
              {
                step: "2",
                title: "Automated Processing",
                desc: "Our system identifies the responsible department and generates a structured report"
              },
              {
                step: "3",
                title: "Authority Notification",
                desc: "The relevant department receives the issue with all necessary details for action"
              },
              {
                step: "4",
                title: "Progress Tracking",
                desc: "You receive updates and can monitor resolution status through your personal dashboard"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 mr-4">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
            Get In Touch
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-6">
                <FaEnvelope className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">Email Us</h3>
                <a href="mailto:pirssupportteam@gmail.com" className="text-blue-600 hover:underline">
                  pirssupportteam@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-6">
                <FaPhone className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">Call Us</h3>
                <a href="tel:+9898989898" className="text-blue-600 hover:underline">
                  +91 9898989898
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;