import React from 'react';
import {faFaceSadTear} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import './banned.css';

export function Banned() {
  React.useEffect(() => {
    const handleMouseMove = (event :MouseEvent) => {
      const circle = document.getElementById('mouse-circle') as HTMLDivElement;
      circle.style.left = `${event.clientX - 160}px`;
      circle.style.top = `${event.clientY - 160}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
      <div className="relative min-h-screen bg-[#0C0C0C] text-white flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-5 backdrop-blur-md pointer-events-none z-10"></div>
        <div className="text-center z-10 cursor-default">
          <p className="text-[#e74c3c] uppercase text-sm font-bold -mb-2">Coming soon</p>
          <h1 className="text-7xl font-extrabold bg-gradient-to-r from-[#e74c3c] from-35% to-white bg-clip-text text-transparent pb-5">Lategram</h1>
          <h2 className="text-xl font-light text-white mb-8">You were banned! Please refer to our guidelines and never do it again.</h2>
          <button className="cursor-pointer relative uppercase group border-2 border-[#e74c3c] bg-[#140c13] rounded-full px-8 py-2 shadow-[0_0_60px_#e74c3c] overflow-hidden mt-12">
            {/* Button text (kept above the overlay) */}
            <a className="relative z-10 flex items-center">
              I am sorry <FontAwesomeIcon icon={faFaceSadTear} className="ml-2" />
            </a>

            {/* Overlay that slides in on hover */}
            <span className="absolute top-0 bottom-0 left-[-10%] w-[200%] bg-[#e74c3c] transform -translate-x-full skew-x-[-20deg] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>
          </button>
        </div>
        <div className="" id="mouse-circle"></div>
      </div>
  );
}
