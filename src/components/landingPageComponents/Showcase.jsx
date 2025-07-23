import { useEffect } from 'react';
import { Rocket } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Showcase() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Initialize AOS with options
  }, []);

  return (
    <div className="ps-6 sm:ps-16 md:ps-28 pe-6 sm:pe-16 md:pe-28 font-sans text-center min-h-[80vh] flex flex-col justify-center items-center">

      <h1 data-aos="fade-up" className="text-4xl sm:text-6xl font-bold font-sans p-2">
        Set Goals,
        Track Progress <br />
        <p className='pt-2'>Achieve <span className="text-white">Success.</span></p>
      </h1>

      <p
        data-aos="fade-up"
        className="text-lg sm:text-xl font-normal p-2 pt-5"
      >
        Stay focused and organized with our goal tracker, <br /> Export your progress anytime.
      </p>

      {/* Animated Buttons */}
      <div className="flex flex-wrap items-center gap-5 p-2 pt-5 justify-center">
        <button
          data-aos="fade-up"
          aria-label="Get Started"
          className="bg-white w-[150px] justify-center text-[#0061ff] p-2 rounded-md hover:bg-[#0061ff] hover:text-white transition ease-in-out flex items-center gap-2"
        >
          Learn more <Rocket size={20} />
        </button>
      </div>

      {/* <div className='justify-center flex py-10' data-aos="fade-up">
        <img src='/display.png' width={500} height={500} className='rounded-lg shadow-md w-1/2 h-[45vh]' />
      </div> */}


    </div>
  );
}
