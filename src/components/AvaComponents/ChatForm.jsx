import { useRef } from "react";

function ChatForm({ onUserSubmit }) {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = "";

        onUserSubmit(userMessage);
    }

    return (
        <form className="flex gap-2" onSubmit={handleFormSubmit}>
            <input
                type="text"
                ref={inputRef}
                className="flex-1 px-4 py-2 border border-teal-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Ask Ava about your Goals..."
            />
            <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500"
            >
                Send
            </button>
        </form>
    );
}

export default ChatForm;
