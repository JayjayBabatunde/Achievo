import { useRef, useEffect } from "react";

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
                rows={1}
                className="flex-1 px-4 py-2 border border-teal-500 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none hide-scrollbar max-h-32"
                placeholder="Ask Ava about your Goals..."
                onInput={handleInput}
            />
            <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 h-10"
                style={{ minHeight: 40 }}
            >
                Send
            </button>
        </form>
    );
}

export default ChatForm;
