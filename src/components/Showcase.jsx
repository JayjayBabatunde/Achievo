import  { useEffect } from 'react';
import { ArrowRightCircle, PawPrint } from 'lucide-react';
import AOS from 'aos'; 
import 'aos/dist/aos.css'; 

export default function Showcase() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Initialize AOS with options
  }, []);

  return (
    <div className="ps-6 sm:ps-16 md:ps-28 pe-6 sm:pe-16 md:pe-28 pt-9 font-sans
    ">
      <h1
        data-aos="fade-right"
        className="text-4xl sm:text-6xl font-bold font-sans p-2"
      >
        Set <span className="text-[#148359]">Goals</span>
      </h1>
      <h1
        data-aos="fade-left"
        className="text-4xl sm:text-6xl font-bold font-sans p-2"
      >
        Track <span className="text-[#148359]">Progress</span>
      </h1>
      <h1
        data-aos="fade-up"
        className="text-4xl sm:text-6xl font-bold font-sans p-2"
      >
        Achieve <span className="text-[#148359]">Success</span>
      </h1>

      {/* Animated Paragraph */}
      <p
        data-aos="fade-up"
        className="text-lg sm:text-xl font-normal p-2 pt-5"
      >
        Stay focused and organized with our goal tracker,
        <br /> Export your progress anytime.
      </p>

      {/* Animated Buttons */}
      <div className="flex flex-wrap items-center gap-5 p-2 pt-5">
        <button
          data-aos="zoom-in"
          aria-label="Get Started"
          className="bg-[#148359] text-white p-2 rounded-md hover:bg-[#219267] transition ease-in-out flex items-center gap-2 pe-4 hover:scale-105"
        >
          Get started <PawPrint size={20} color="white" />
        </button>

        <button
          data-aos="zoom-in"
          aria-label="Learn More"
          className="hover:bg-[#148359] hover:text-white border-2 border-[#148359] text-[#148359] p-2 rounded-md flex items-center gap-2 transition hover:scale-105"
        >
          Learn More <ArrowRightCircle size={20} />
        </button>
      </div>

    </div>
  );
}
