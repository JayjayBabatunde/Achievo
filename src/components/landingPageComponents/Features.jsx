import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Features = () => {

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  return (
    <div className="bg-blue-100 p-8 py-32 px-32 gap-10 flex items-baseline justify-center">

      <div className="max-w-[50%] mx-auto text-start">
        <h2 className="text-lg text-gray-500 font-semibold mb-4">Our Features</h2>
        <p className="text-5xl font-bold mb-6">
          Core Features of Achievo
        </p>
        <p className="text-gray-700 mb-6">
          Achievo is designed to enhance your organizational effectiveness through collaborative and innovative strategies. Here are the core features that define its exceptional value:
        </p>

        <img src="/community.png" width={500} height={500} className='rounded-lg shadow-md w-full mt-14' />
      </div>


      <div className="text-left space-y-4">
        <div className="border-b border-gray-400">
          <h3 className="text-xl font-bold">Easy Goal Setting</h3>
          <p className="text-gray-700 pt-1.5 pb-3">Simplify your objective planning with our user-friendly interface. Quickly outline your goals, set deadlines, and break them down into manageable tasks, ensuring clarity and focus.</p>

        </div>
        <div className="border-b border-gray-400">
          <h3 className="text-xl font-bold">Progress Tracking</h3>
          <p className="text-gray-700 pt-1.5 pb-3"> Monitor your advancements effortlessly with our intuitive progress tracking tools. Visual charts and milestone markers keep you informed about your achievements, motivating you to stay on track.</p>
        </div>
        <div className="border-b border-gray-400">
          <h3 className="text-xl font-bold">Community Access</h3>
          <p className="text-gray-700 pt-1.5 pb-3">Join a vibrant community of like-minded individuals. Share experiences, seek advice, and collaborate on projects to foster growth and innovation within a supportive environment.</p>
        </div>
        <div className="border-b border-gray-400">
          <h3 className="text-xl font-bold">AI Assistance</h3>
          <p className="text-gray-700 pt-1.5 pb-3">Leverage cutting-edge AI technology tailored to enhance your productivity. Receive personalized recommendations, automate repetitive tasks, and gain insights to optimize your workflow effectively.</p>
        </div>

      </div>
    </div>
  );
};

export default Features;
