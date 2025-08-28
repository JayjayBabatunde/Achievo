import { useState } from "react";
import { Bot, X } from "lucide-react";

export default function AiBot() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating AI Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-purple-700 hover:bg-purple-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-transform duration-300"
                >
                    <Bot size={24} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[370px] h-[450px] bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col border border-gray-200">
                    {/* Header */}
                    <div className="bg-purple-600 text-white p-3 flex justify-between items-center">
                        <span className="font-semibold">AI Chatbot</span>
                        <button onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto text-sm text-gray-700">
                        <p className="text-gray-500 italic">
                            👋 Hello! How can I help you today?
                        </p>
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-gray-200 flex">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <button className="ml-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md">
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
