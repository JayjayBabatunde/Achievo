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
        <form className="flex items-end gap-2" onSubmit={handleFormSubmit}>
            <div className="flex-1 relative">
                <textarea
                    ref={inputRef}
                    rows={3}
                    className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 resize-none hide-scrollbar max-h-16 text-[15px] placeholder:text-gray-400"
                    placeholder="Ask Ava about your goals..."
                    onInput={handleInput}
                />
                <button
                    type="submit"
                    className="absolute bottom-2.5 right-2.5 h-9 w-9 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-500 shadow-sm"
                >
                    <FaRegPaperPlane size={14} />
                </button>
            </div>
        </form>
    );
}

export default ChatForm;
