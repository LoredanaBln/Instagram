import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  React.useEffect(() => {
    const handleMouseMove = (event) => {
      const circle = document.getElementById('mouse-circle');
      circle.style.left = `${event.clientX - 160}px`;
      circle.style.top = `${event.clientY - 160}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {/* <div className="absolute inset-0 bg-radial from-[#45191d] to-[#0e0b11] pointer-events-none opacity-10"></div> */}
      <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-md pointer-events-none"></div>
      <div className="text-center z-10">
        <p className="text-[#e56263] uppercase text-sm font-bold -mb-2">Coming soon</p>
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-[#e56263] to-white bg-clip-text text-transparent pb-5">Lategram</h1>
        <h2 className="text-xl font-light text-white mb-8">Let your memories speak for themselves. But not about the jews or gypsies.</h2>
        <button className="relative uppercase group border-2 border-[#e56263] bg-[#140c13] rounded-full px-8 py-2 shadow-[0_0_px_#e56263] overflow-hidden mt-12">
        {/* Button text (kept above the overlay) */}
        <span className="relative z-10 flex items-center">
            Join now <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
        </span>

        {/* Overlay that slides in on hover */}
        <span className="absolute top-0 bottom-0 left-[-10%] w-[200%] bg-red-500 transform -translate-x-full skew-x-[-20deg] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>
        </button>
      </div>
      <div className="absolute w-80 h-80  rounded-full pointer-events-none" id="mouse-circle"></div>
    </div>
  );
}

export default App;
