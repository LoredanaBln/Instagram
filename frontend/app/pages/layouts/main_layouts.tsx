// components/Layout.jsx
import React from "react";
import {useNavigate} from "react-router";
import {UserService} from "~/services/user_service";

const Layout = ({ children }: {children: React.ReactNode}) => {
    const navigation = useNavigate();

    const logout = () => {
        new UserService().logout().then(_ => navigation("/login"));
    }

    function canAccessAdminPortal() {
        const role = sessionStorage.getItem("role");

        return role == "MODERATOR";

    }

    return (
        <div className="flex min-h-screen text-white max-w-screen-xl mx-auto">
            {/* Sidebar */}
            <aside className="w-72 p-4 sticky top-0 h-screen hidden md:flex flex-col justify-between">
                <div className="space-y-4">
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#e74c3c] from-15% to-white bg-clip-text text-transparent pb-5">Lategram</h1>
                    <nav className="space-y-3">
                        <a href="/posts" className="block font-medium hover:text-[#e74c3c]">Home</a>
                        <a href="/posts" className="block font-medium hover:text-[#e74c3c]">Explore</a>
                        <a href="/profile" className="block font-medium hover:text-[#e74c3c]">Profile</a>
                        {canAccessAdminPortal() && (
                            <a href="/users" className="block font-medium hover:text-[#e74c3c]">Admin Portal</a>
                        )}
                    </nav>
                </div>
                <button className="bg-[#e74c3c] cursor-pointer text-white py-2 px-4 rounded-full font-semibold hover:bg-[#cf3e30] transition-colors" onClick={logout}>
                    Log out
                </button>
            </aside>

            {/* Main content */}
            <main className="flex-1 max-w-2xl mx-auto p-4">
                {children}
            </main>

            {/* Right Sidebar */}
            <aside className="w-72 p-4 hidden lg:block">
                <div className="space-y-4">
                  {/* Filter Controls */}
                  <div className="bg-[#1a1219] rounded-xl p-4 border border-[#2a1f29]">
                    <h2 className="font-bold text-lg mb-2 text-[#e74c3c]">
                      Filter Posts
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="search"
                          className="block text-sm font-medium text-gray-300 mb-1"
                        >
                          Search by Title
                        </label>
                        <input
                          id="search"
                          type="text"
                          placeholder="Enter post title..."
                          className="w-full p-2 rounded-lg border border-[#2a1f29] bg-[#140c13] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#e74c3c] focus:border-[#e74c3c] transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="tagFilter"
                          className="block text-sm font-medium text-gray-300 mb-1"
                        >
                          Filter by Tag
                        </label>
                        <select
                          id="tagFilter"
                          className="w-full p-2 rounded-lg border border-[#2a1f29] bg-[#140c13] text-white focus:ring-2 focus:ring-[#e74c3c] focus:border-[#e74c3c] transition-colors"
                        >
                          <option value="">All Tags</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="userFilter"
                          className="block text-sm font-medium text-gray-300 mb-1"
                        >
                          Filter by User
                        </label>
                        <select
                          id="userFilter"
                          className="w-full p-2 rounded-lg border border-[#2a1f29] bg-[#140c13] text-white focus:ring-2 focus:ring-[#e74c3c] focus:border-[#e74c3c] transition-colors"
                        >
                          <option value="">All Users</option>
                        </select>
                      </div>

                      <div className="flex items-center pt-2">
                        <input
                          type="checkbox"
                          id="ownPosts"
                          className="w-4 h-4 text-[#e74c3c] border-[#2a1f29] rounded focus:ring-[#e74c3c] bg-[#140c13]"
                        />
                        <label
                          htmlFor="ownPosts"
                          className="ml-2 text-sm font-medium text-gray-300"
                        >
                          Show only my posts
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
            </aside>
        </div>
    );
};

export default Layout;
