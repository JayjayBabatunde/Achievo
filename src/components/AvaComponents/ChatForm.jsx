import { useRef, useEffect } from "react";
import { FaRegPaperPlane } from "react-icons/fa";

function ChatForm({ onUserSubmit }) {
    const inputRef = useRef();

    // Load saved message on mount
    useEffect(() => {
        const savedMessage = localStorage.getItem("chat_draft");
        if (savedMessage && inputRef.current) {
            inputRef.current.value = savedMessage;
            // Resize textarea to fit content
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
        }
    }, []);

    // Save input value on every keystroke
    const handleInput = (e) => {
        localStorage.setItem("chat_draft", e.target.value);
        // Auto-resize
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;

        // Clear input and draft
        inputRef.current.value = "";
        localStorage.removeItem("chat_draft");
        inputRef.current.style.height = 'auto';

        onUserSubmit(userMessage);
    };

    return (
        <form className="flex gap-2 items-end" onSubmit={handleFormSubmit}>
            <textarea
                ref={inputRef}
                rows={4}
                className="flex-1 px-4 py-2 bg-transparent border border-gray-300 rounded-lg resize-none hide-scrollbar max-h-32"
                placeholder="Ask Ava about your Goals..."
                onInput={handleInput}
            />
            <div className="relative">
                <button
                    type="submit"
                    className="flex justify-center items-center h-7 w-7 bg-teal-600  rounded-full hover:bg-teal-500
                    absolute right-5 bottom-3"
                >
                    <FaRegPaperPlane size={15} />
                </button>
            </div>
        </form>
    );
}

export default ChatForm;
