import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaUsers, FaHandsHelping, FaBullhorn } from "react-icons/fa";

const Homepage = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-gray-900/80"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="relative z-10 text-center px-3 md:px-6 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Empowering Communities, <br />
            Resolving Issues Together
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
            Report public issues, track resolutions, and connect directly with authorities 
            to make your neighborhood a better place for everyone.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/issue-report" className="flex items-center justify-center">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-lg font-semibold text-white flex items-center gap-2 shadow-lg hover:shadow-xl">
                Report an Issue <FaArrowRight />
              </button>
            </Link>
            <Link to="/community" className="flex items-center justify-center">
              <button className="px-8 py-3 bg-white hover:bg-gray-100 text-blue-600 transition-all duration-300 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl">
                Join Community <FaUsers />
              </button>
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce w-6 h-6 border-2 border-white rounded-full"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaBullhorn className="text-4xl text-blue-600" />,
                title: "Report Issues",
                desc: "Easily document problems in your community with photos and location details."
              },
              {
                icon: <FaHandsHelping className="text-4xl text-blue-600" />,
                title: "Community Support",
                desc: "Get support from neighbors and upvote important issues that need attention."
              },
              {
                icon: <FaUsers className="text-4xl text-blue-600" />,
                title: "Authority Response",
                desc: "Direct connection to relevant departments for faster resolution."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img
                src="https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg"
                alt="Community working together"
                className="rounded-lg shadow-md w-full object-cover h-80 md:h-96"
              />
            </div>
            
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                About Our Platform
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our platform was created to bridge the gap between citizens and local authorities. 
                We believe in the power of community engagement to solve public issues efficiently.
              </p>
              
              <ul className="space-y-3 mb-8">
                {[
                  "Real-time issue tracking",
                  "Direct communication channels",
                  "Transparent resolution process",
                  "Community voting system"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/about">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center gap-2">
                  Learn More <FaArrowRight />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2">
              <img
                src="https://res.cloudinary.com/dgye02qt9/image/upload/v1737872787/community1_k5j4ik.jpg"
                alt="Community empowerment"
                className="rounded-lg shadow-md w-full object-cover h-80 md:h-96"
              />
            </div>
            
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Join Our Community
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Become part of a growing network of active citizens who are making real 
                changes in their neighborhoods. Together, we can hold authorities 
                accountable and improve our shared spaces.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-100">
                <p className="text-blue-800 italic">
                  "This platform helped us get our streetlights fixed within a week after 
                  months of complaints through traditional channels."
                </p>
                <p className="text-blue-600 font-medium mt-2">- Mr. Prasad Kancharla, Community Member</p>
              </div>
              
              <Link to="/community">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center gap-2">
                  Get Involved <FaUsers />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Join thousands of citizens who are already improving their communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/issue-report" className="flex items-center justify-center">
              <button className="px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 transition-all duration-300 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl">
                Report an Issue Now <FaArrowRight />
              </button>
            </Link>
            <Link to="/register" className="flex items-center justify-center">
              <button className="px-8 py-3 border-2 border-white hover:bg-blue-700 transition-all duration-300 rounded-lg font-semibold flex items-center gap-2">
                Create Free Account
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;