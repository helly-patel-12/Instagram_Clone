import React from "react";
import { Code, Heart, Github, Linkedin, Mail } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold mb-2">My Instagram Clone</h1>
          <p className="text-purple-100">
            Reimagining the social experience with my own twist
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* About the Project */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              About This Project
            </h2>
            <p className="text-gray-600 leading-relaxed">
              This project is my task on building a social media platform
              similar to Instagram, but completely from scratch using modern
              technologies. It supports photo sharing, user accounts, likes,
              comments, and is optimized for mobile and desktop. The goal was to
              challenge myself and showcase what I can build without relying on
              pre-built templates.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              What It Offers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Upload and share real images",
                "Secure user login & authentication",
                "Post creation and editing",
                "Like and comment functionality",
                "Customizable user profiles",
                "Explore feed for new content",
                "Fully responsive layout",
                "Smooth, interactive UI",
                "Share and save functionalities",
                "No backend - front-end only" 
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Technologies I Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "React",
                "TypeScript",
                "Tailwind CSS",
                "Lucide Icons",
                "LocalStorage",
                "Vite"
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Developer Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              About Me
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  HP
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">
                    Helly Patel
                  </h4>
                  <p className="text-gray-600">
                    Frontend Developer & Tech Enthusiast
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                I love building clean, modern web apps that are fast,
                responsive, and easy to use. This project helped me dive deeper
                into React, TypeScript, and responsive design principles.
              </p>

              <div className="flex space-x-4">
                <a
                  href="https://github.com/helly-patel-12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                <a
                  href="www.linkedin.com/in/helly-patel-12-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="mailto:hellyvrajpatel1312@gmail.com"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Version 1.0.0 • Designed & developed by Helly Patel
            </p>
            <p className="text-xs text-gray-400 mt-1">
              © 2025 My Instagram Clone. Created as a personal learning project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
