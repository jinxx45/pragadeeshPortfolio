"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook

const Homepage = () => {
  const router = useRouter(); // Initialize the router

  const [typedText, setTypedText] = useState("");
  const typewriterStrings = [
    "Full Stack Developer",
    "Java Developer",
    "React Developer",
    "Software Engineer",
  ];
  const typingSpeed = 100;
  const pauseBetweenStrings = 1500;

  useEffect(() => {
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentString = typewriterStrings[index];
      const displayedText = isDeleting
        ? currentString.substring(0, charIndex--)
        : currentString.substring(0, charIndex++);

      setTypedText(displayedText);

      if (!isDeleting && charIndex === currentString.length) {
        setTimeout(() => (isDeleting = true), pauseBetweenStrings);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        index = (index + 1) % typewriterStrings.length;
      }

      const typingDelay = isDeleting ? typingSpeed / 2 : typingSpeed;
      setTimeout(type, typingDelay);
    };

    type();
  }, []);

  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}
    >
      <div className="h-full flex flex-col lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48">
        <div className="h-1/3 lg:h-full lg:w-1/2 relative order-1 lg:order-2 animate-floating">
          <Image
            src="/coder-portfolio.gif"
            alt="Portfolio Image"
            fill
            className="object-contain lg:mx-10"
          />
        </div>
        <div className="h-2/3 lg:h-full lg:w-1/2 flex flex-col gap-8 items-center justify-center order-2 lg:order-1">
          <h1 className="text-4xl text-center md:text-6xl font-bold">
            Hello, I am Pragadeesh!
          </h1>
          <h2 className="text-2xl md:text-4xl text-gray-700">
            I am a {typedText}
            <span className="animate-blink">|</span>
          </h2>
          <p className="text-center text-justify text-sm md:text-l lg:text-lg xl:text-xl">
            I am a passionate <b>Full Stack Developer</b> with expertise in{" "}
            <b>Java</b>, <b>Spring Boot</b>, <b>React</b>, and <b>Angular</b>. I
            thrive on building scalable applications, designing intuitive user
            interfaces, and solving complex technical challenges to deliver
            impactful solutions.
          </p>
          <div className="w-full flex gap-4 items-center justify-center">
            <button
              onClick={() => router.push("/skills")} // Navigate to the Skills page
              className="p-4 rounded-lg ring-1 ring-black bg-black text-white"
            >
              View My Skills & Experience
            </button>
            <button
              onClick={() => router.push("/contact")} // Navigate to the Contact page
              className="p-4 rounded-lg ring-1 ring-black"
            >
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Homepage;
