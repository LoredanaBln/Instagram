// components/Layout.jsx
import React from "react";
import {useNavigate} from "react-router";
import {UsersRepository} from "~/repositories/user_repository";

const Layout = ({ children }: {children: React.ReactNode}) => {
    const navigation = useNavigate();

    const logout = () => {
        new UsersRepository().logout().then(_ => navigation("/login"));

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
                        <a href="#" className="block font-medium hover:text-[#e74c3c]">Notifications</a>
                        <a href="#" className="block font-medium hover:text-[#e74c3c]">Messages</a>
                        <a href="#" className="block font-medium hover:text-[#e74c3c]">Profile</a>
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
                <div className="bg-[#111] rounded-xl p-4 border border-gray-800">
                    <h2 className="font-bold text-lg mb-2 text-[#e74c3c]">Trends for you</h2>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="cursor-pointer">#ReactJS</li>
                        <li>#TailwindCSS</li>
                        <li>#DarkMode</li>
                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default Layout;
