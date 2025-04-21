import { Target, TrendingUp, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features() {
  return (
    <div className="p-5 ps-24 pe-24">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-center mb-8 mt-5"
      >
        OUR CORE FEATURES
      </motion.h1>

      <div className="flex flex-wrap justify-around gap-6">
        {/* Goal Setting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center p-6 w-full sm:w-1/2 lg:w-1/4"
        >
          <Target className="h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold">Goal Setting</h2>
          <p className="text-center text-gray-600 mt-2">
            Set and define your goals with ease, ensuring clear direction for success.
          </p>
        </motion.div>

        {/* Progress Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-center p-6 w-full sm:w-1/2 lg:w-1/4"
        >
          <TrendingUp className="h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold">Progress Tracking</h2>
          <p className="text-center text-gray-600 mt-2">
            Track your progress step by step, visualizing your journey toward achievement.
          </p>
        </motion.div>

        {/* Goal Export */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col items-center p-6 w-full sm:w-1/2 lg:w-1/4"
        >
          <FileText className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold">Goal Export</h2>
          <p className="text-center text-gray-600 mt-2">
            Export your goals and progress to PDFs for easy sharing and record-keeping.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
