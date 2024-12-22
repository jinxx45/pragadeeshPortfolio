"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ContactPage = () => {
  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }} // Start from off-screen
      animate={{ y: "0%" }} // End at the normal position
      transition={{ duration: 1 }} // 1 second transition
    >
      {/* Gradient Background for Large Screens */}
      <div
        className="hidden lg:flex items-center justify-center bg-white lg:bg-gradient-to-r lg:from-blue-500 lg:via-purple-500 lg:to-pink-500"
        style={{ minHeight: "calc(100vh - 6rem)" }}
      >
        {" "}
        {/* Adjust height for lg screens */}
        <div className="bg-white shadow-2xl rounded-lg p-0 lg:p-16 max-w-4xl w-full">
          {/* Profile Image */}
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-56 lg:h-56">
              <Image
                height={180}
                width={180}
                className="object-contain"
                src="/portfolio-image.jpg"
                alt="Pragadeesh's Profile Picture"
              />
            </div>

            {/* Contact Info */}
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-800">
                Pragadeesh S
              </h1>
              <p className="text-lg text-gray-600 mt-2">Full Stack Developer</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-gray-800">Mobile Number</label>
                  <p className="text-gray-600">91-9384978015</p>
                </div>
                <div>
                  <label className="block text-gray-800">Email</label>
                  <p className="text-gray-600">pragadeeshh45@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Content for Small Screens */}
      <div
        className="lg:hidden flex h-screen w-screen relative"
        style={{ height: "calc(100vh - 6rem)" }}
      >
        {/* Background Image with Blur */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center filter blur-sm"
          style={{ backgroundImage: "url('/portfolio-image.jpg')" }}
        ></div>

        {/* Contact Card Overlay */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-4 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            {/* Contact Info */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">Pragadeesh S</h1>
              <p className="text-lg text-gray-600 mt-2">Full Stack Developer</p>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-gray-800">Mobile Number</label>
                  <p className="text-gray-600">91-9384978015</p>
                </div>
                <div>
                  <label className="block text-gray-800">Email</label>
                  <p className="text-gray-600">pragadeeshh45@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
