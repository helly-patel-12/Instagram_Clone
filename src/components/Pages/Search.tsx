import React, { useState } from "react";
import Navigation from "../Layout/Navigation";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("home");

  // Handler to close search popup
  const closeSearch = () => {
    setCurrentPage("home");
  };

  return (
    <>
      {/* When search is active, show overlay */}
      {currentPage === "search" && (
        <div className="fixed inset-0 z-50 flex bg-black bg-opacity-50 backdrop-blur-sm">
          {/* Sidebar */}
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

          {/* Search dialog */}
          <div className="flex-grow flex items-start ml-12 p-8">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                onClick={closeSearch}
                aria-label="Close search"
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">Search</h2>
              <input
                type="text"
                placeholder="Search..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              {/* Add your search results or UI here */}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className={`transition-filter duration-300 ${
          currentPage === "search" ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {/* Your main app content here */}
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="p-4 md:ml-56">
          {/* Example content */}
          <h1 className="text-2xl font-bold mb-4">Welcome to Instagram Clone</h1>
          <p>Current page: {currentPage}</p>
          {/* ...rest of your app */}
        </main>
      </div>
    </>
  );
};

export default App;
