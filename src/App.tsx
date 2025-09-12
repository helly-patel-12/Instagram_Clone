import React, { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/useAuth";
import AuthPage from "./components/Auth/AuthPage";
import Navigation from "./components/Layout/Navigation";
import Home from "./components/Pages/Home";
import Profile from "./components/Pages/Profile";
import Explore from "./components/Pages/Explore";
import Messages from "./components/Pages/Messages";
import About from "./components/Pages/About";
import Reels from './components/Pages/Reels';
import CreatePost from "./components/Post/CreatePost";

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handlePageChange = (page: string) => {
    if (page === "create") {
      setShowCreatePost(true);
    } else {
      setCurrentPage(page);
      setSelectedUser(null);
    }
  };

  const handleUserClick = (username: string) => {
    setSelectedUser(username);
    setCurrentPage("profile");
  };

  const handlePostCreated = () => {
    setCurrentPage("home");
  };

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <Home onUserClick={handleUserClick} />;
      case "explore":
        return <Explore onUserClick={handleUserClick} />;
      case "reels":
        return <Reels />;
      case "messages":
        return <Messages onUserClick={handleUserClick} />;
      case "profile":
        return (
          <Profile selectedUser={selectedUser} onUserClick={handleUserClick} />
        );
      case "about":
        return <About />;
      default:
        return <Home onUserClick={handleUserClick} />;
    }
  };

  return (
    <div className=" bg-white">
      <Navigation currentPage={currentPage} onPageChange={handlePageChange} />

      <main className="">
        <div className="px-4">{renderCurrentPage()}</div>
      </main>

      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
