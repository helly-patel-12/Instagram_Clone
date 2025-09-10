// src/pages/Messages.tsx
import React, { useEffect, useState } from "react";
import {
  Edit2,
  Search,
  MessageCircle,
  Phone,
  Video,
  Info,
  Minimize2,
  Smile,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getUsers } from "../../utils/storage";
import { User } from "../../types";

const getOtherUsers = (allUsers: User[], currentUser: User | null): User[] => {
  if (!currentUser) return allUsers;
  return allUsers.filter((u) => u.id !== currentUser.id);
};

interface MessageProps {
  onUserClick: (username: string) => void;
}

const Messages: React.FC<MessageProps> = ({ onUserClick }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const allUsers = getUsers();
    setUsers(getOtherUsers(allUsers, currentUser));
  }, [currentUser]);

  // Track window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="md:flex h-auto md:h-[640px] bg-white md:ml-20 mb-20 md:mb-0">
      {/* Sidebar (show on desktop OR on mobile if no user selected) */}
      {(!isMobile || !selectedUser) && (
        <div className="w-full md:w-1/3 md:border-r border-gray-300 flex flex-col">
          {/* Header */}
          {currentUser && (
            <>
              <div className="flex items-center justify-between px-4 py-3 ">
                <h2 className="font-semibold text-lg">
                  {currentUser.username}
                </h2>
                <button>
                  <Edit2 size={22} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="px-3 py-2">
                <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
                  <Search className="text-gray-500 mr-2" size={18} />
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent focus:outline-none text-sm w-full"
                  />
                </div>
              </div>

              {/* Notes Section */}
              <div className="flex gap-4 px-3 py-3 overflow-x-auto border-b border-gray-200 h-36 items-center">
                {/* Your Note */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.username}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {/* + Icon */}
                    <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                    {/* Note preview */}
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white text-center border border-gray-300 rounded-2xl px-2 py-1 text-xs">
                      Today's Mood
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Your note</p>
                </div>

                {/* Other users' notes */}
                {users.map((user: User) => (
                  <div key={user.id} className="flex flex-col items-center">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <p className="text-xs text-gray-500 mt-1 truncate w-14 text-center">
                      {user.username}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            <div className="flex justify-between">
              <h3 className="px-4 py-2 font-semibold">Messages</h3>
              <h4 className="px-4 py-2 font-medium text-gray-500 hover:text-black cursor-pointer">
                Requests
              </h4>
            </div>
            <ul>
              {users.length === 0 ? (
                <li className="px-4 py-3 text-gray-500">No other users found.</li>
              ) : (
                users.map((user: User) => (
                  <li
                    key={user.id}
                    className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                      selectedUser?.id === user.id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-500">Active recently</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Chat section (show on desktop OR on mobile if user selected) */}
      {(!isMobile || selectedUser) && (
        <div className="md:flex-1 md:flex md:flex-col">
          {selectedUser ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Back button (mobile only) */}
                  {isMobile && (
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="mr-2"
                    >
                      <ArrowLeft size={22} />
                    </button>
                  )}
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{selectedUser.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedUser.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-center md:gap-4 gap-2 text-gray-600">
                  <Phone size={20} />
                  <Video size={20} />
                  <Info size={20} />
                  <Minimize2 size={20} />
                </div>
              </div>

              {/* Chat body */}
              <div className="flex-1 flex flex-col items-center justify-center text-center h-[500px]">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.username}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h2 className="font-semibold text-xl">{selectedUser.name}</h2>
                <p className="text-gray-500 text-sm">
                  {selectedUser.username} · Instagram
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
                  onClick={() => onUserClick(selectedUser.username)}
                >
                  View Profile
                </button>
              </div>

              {/* Chat input */}
              <div className="p-3 border-t flex items-center">
                <Smile size={20} className="text-gray-600 mr-2" />
                <input
                  type="text"
                  placeholder="Message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none"
                />
              </div>
            </>
          ) : (
            !isMobile && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 border-2 border-gray-400 rounded-full flex items-center justify-center">
                    <MessageCircle size={40} className="text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Your messages</h3>
                  <p className="text-gray-500 text-sm">
                    Send private photos and messages to a friend or group.
                  </p>
                  <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600">
                    Send message
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Messages;
