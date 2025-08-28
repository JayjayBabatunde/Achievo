import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onclose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-full"
      onClick={onclose}
    >
      <div
        className="relative bg-white sm:w-[500px] w-full m-10 sm:m-0 rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-black hover:text-gray-600"
          onClick={onclose}
        >
          <X size={24} />
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
