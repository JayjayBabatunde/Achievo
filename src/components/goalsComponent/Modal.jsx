import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onclose, children }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open
  
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-full"
        onClick={onclose} // Close the modal when clicking the backdrop
      >
        <div
          className="bg-white w-1/3 rounded-lg shadow-lg p-6"
          onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
        >
          <button
            className="absolute top-3 right-6 text-white hover:text-gray-600"
            onClick={onclose}
          >
            <X size={30} />
          </button>
          {children}
        </div>
      </div>
    );
  };
  
export default Modal;
  


Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired, 
    onclose: PropTypes.func.isRequired, 
    children: PropTypes.node, 
  };
  