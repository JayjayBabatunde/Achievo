import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    text: '"This app has completely transformed how I set and achieve my goals. The reminders and progress tracking keep me focused and accountable. Highly recommend it!"',
    name: "John Doe"
},
  {
    text: '"I love how easy it is to set up goals and track my progress. The export-to-PDF feature is perfect for reviewing my achievements."',
    name: "Jane Smith"
  },
  {
    text: '"The clean design and intuitive interface make it fun to plan and track goals. It’s like having a personal coach in your pocket."',
   name: "Alice Johnson"
  },
    
    {
    text: '"The app helps me prioritize my tasks and stay organized. I’ve accomplished more in the past month than I did all year!"',
   name: "Jordan George"
  },
    {
    text: '"I’ve struggled with sticking to my goals, but this app has made it so much easier. The visual progress bars are super motivating!"',
   name: "Miss Allison"
  }
];

const Testimonial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="font-sans p-6">
      <h2 className="text-4xl font-bold text-center pb-8">What Our Clients Say</h2>
      {/* <div className='flex justify-center items-center gap-36'> */}

      <div className="bg-[#fff] rounded-lg lg:w-3/4 lg:h-80 flex lg:gap-14 justify-center items-center justify-self-center
      shadow-lg p-10 sm:w-4/4 sm:h-96 sm:gap-6 text-center">
 <button
          onClick={handlePrev}
        >
          <ChevronLeft size={50} />
        </button>
        <motion.div
          className=""
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <p className="lg:text-2xl sm:text-sm italic font-light">{testimonials[currentSlide].text}</p>
          <h3 className="lg:text-xl sm:text-sm font-semibold pt-3">{testimonials[currentSlide].name}</h3>
        </motion.div>

          <button
          onClick={handleNext}
        >
          <ChevronRight size={50} />
        </button>
        </div>

       
      {/* </div> */}
    </div>
  );
};

export default Testimonial;