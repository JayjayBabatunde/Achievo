import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from '@emailjs/browser';

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
    .sendForm (
      'service_bsyeq3l',
      'template_qm676wd',
      form.current,
      'f-2bjxDiNx-omjqyy'
    )
    .then(
      (result) => {
        console.log(result.text);
        alert('Message sent Successfully');
        e.target.reset();
      },
      (error) => {
        console.log(error.text);
        alert('Failed to send message try again later')
      }
    )

    console.log({ name, email, message });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Initial animation
      animate={{ opacity: 1, y: 0 }} // Animation when component loads
      transition={{ duration: 0.6 }} // Transition timing
      className="lg:flex justify-evenly items-center p-5 pt-20 pb-20 sm:block"
    >
      {/* Left Section (Image) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="lg:w-1/2 sm:w-full"
      >
        <img
          className="w-full"
          src="/src/assets/contact.png"
          alt="Contact Us"
        />
      </motion.div>

      {/* Right Section (Form) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:w-1/2 max-w-md p-8 bg-white shadow-lg rounded-xl"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Contact Us
        </h2>

        <form ref={form}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Name Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </motion.div>

          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>

          {/* Message Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            <textarea
              id="message"
              name="message"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Send us a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-20 py-2 bg-[#148359] text-white rounded-lg font-semibold hover:bg-[#1a6d4d] transition duration-200"
            type="submit"
          >
            Send
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ContactForm;
