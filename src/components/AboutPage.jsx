import React from "react";

const AboutPage = () => {
  return (
    <div className="bg-gray-50 p-6 lg:p-12 text-gray-800">
      <div className=" mx-auto">
        {/* Header Section */}
        <h1 className="text-3xl lg:text-5xl font-bold text-center text-blue-600 mb-6">
          About the Public Issue Reporting System
        </h1>

        {/* Project Overview */}
        <section className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Project Overview</h2>
          <p className="text-lg lg:text-xl leading-relaxed">
            The Public Issue Reporting System is a platform designed to empower citizens
            to report civic inconveniences effortlessly. By connecting people with the
            relevant authorities, it aims to improve public infrastructure and ensure a
            cleaner, safer, and more efficient environment.
          </p>
        </section>

        {/* Why This System? */}
        <section className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Why Did We Build This Platform?</h2>
          <p className="text-lg lg:text-xl leading-relaxed">
            Citizens often face difficulties reporting public issues like open manholes,
            broken streetlights, uncollected garbage, or damaged roads. Many are unsure
            about the reporting process or whom to contact, leading to delays in
            resolution and deterioration of public spaces. This platform simplifies the
            process by providing a single, user-friendly interface to report issues and
            track their resolution.
          </p>
        </section>

        {/* Key Features */}
        <section className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Key Features</h2>
          <ul className="text-lg lg:text-xl list-disc pl-6 leading-relaxed">
            <li>Report issues by taking photos and describing the problem.</li>
            <li>Categorize issues (e.g., Roads, Waste Management, Lighting).</li>
            <li>Automatically send structured emails to relevant authorities.</li>
            <li>Track the progress of reported issues.</li>
            <li>View frequently reported problems to raise awareness.</li>
            <li>Support community participation with voting and comments.</li>
          </ul>
        </section>

        {/* Goals and Vision */}
        <section className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Our Mission and Vision</h2>
          <p className="text-lg lg:text-xl leading-relaxed">
            Our mission is to bridge the gap between citizens and local authorities,
            ensuring that public issues are addressed promptly and effectively. We
            envision a world where citizens actively participate in improving their
            surroundings and authorities work transparently to resolve issues.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">How Does It Work?</h2>
          <ol className="text-lg lg:text-xl list-decimal pl-6 leading-relaxed">
            <li>Report an Issue: Capture an image, describe the problem, and select a category.</li>
            <li>Send a Report: The system identifies the appropriate department and sends a structured email.</li>
            <li>Track Progress: Use the unique tracking ID to monitor the resolution status.</li>
            <li>Raise Awareness: View unresolved issues and participate by voting or commenting.</li>
          </ol>
        </section>

        {/* Contact Us */}
        <section>
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Want to Know More?</h2>
          <p className="text-lg lg:text-xl leading-relaxed mb-4">
            We value your feedback! If you have any questions, suggestions, or want to
            collaborate, feel free to reach out to us.
          </p>
          <p className="text-lg lg:text-xl font-medium">
            Email: <a href="mailto:support@civicreporting.com" className="text-blue-600 underline">support@civicreporting.com</a>
          </p>
          <p className="text-lg lg:text-xl font-medium">
            Phone: <a href="tel:+11234567890" className="text-blue-600 underline">+1 (123) 456-7890</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
