import { FiThumbsUp, FiThumbsDown, FiVolume2, FiCopy, FiCheck } from "react-icons/fi";
import { useState, useEffect } from "react";
import { FaRobot, FaStop } from "react-icons/fa";

// Mock persistent storage that would be replaced with localStorage in a real app
const mockStorage = {
    data: {},
    getItem: function (key) {
        return this.data[key] || null;
    },
    setItem: function (key, value) {
        this.data[key] = value;
    }
};

const generateInitialsAvatar = (name) => {
    const nameParts = name.split(' ');
    const initials = nameParts
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;
};

export default function ChatMessage({ chat, userName }) {
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Create a unique key for this message to persist like/dislike state
    const messageKey = `message_${chat.id || chat.text?.substring(0, 50) || Date.now()}`;

    // Load persisted like/dislike state on component mount
    useEffect(() => {
        const savedLiked = mockStorage.getItem(`${messageKey}_liked`);
        const savedDisliked = mockStorage.getItem(`${messageKey}_disliked`);

        if (savedLiked === 'true') {
            setLiked(true);
        }
        if (savedDisliked === 'true') {
            setDisliked(true);
        }
    }, [messageKey]);

    const handleCopy = async () => {
        if (chat.text) {
            await navigator.clipboard.writeText(chat.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        }
    };

    const handleLike = () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setDisliked(false);

        // Persist the state
        mockStorage.setItem(`${messageKey}_liked`, newLiked.toString());
        mockStorage.setItem(`${messageKey}_disliked`, 'false');
    };

    const handleDislike = () => {
        const newDisliked = !disliked;
        setDisliked(newDisliked);
        setLiked(false);

        // Persist the state
        mockStorage.setItem(`${messageKey}_disliked`, newDisliked.toString());
        mockStorage.setItem(`${messageKey}_liked`, 'false');
    };

    const handleSpeak = () => {
        if (chat.text) {
            window.speechSynthesis.cancel();

            // Remove emojis from the text
            const textWithoutEmojis = chat.text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83D[\uDC00-\uDE4F])/g, '');

            const utterance = new window.SpeechSynthesisUtterance(textWithoutEmojis);
            utterance.lang = "en-US";

            // Try to select a more realistic voice
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.name.includes("Google") && v.lang === "en-US");
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    const formatTaskText = (text) => {
        if (!text) return "";

        // Split text into paragraphs
        return text.split(/\n\s*\n/).map((paragraph, idx) => {
            const trimmed = paragraph.trim();

            // Check if this is a list of tasks that already have numbers
            const hasTaskNumbers = trimmed.match(/Task \d+/gi);

            if (hasTaskNumbers) {
                // For tasks that already have numbers, don't add list formatting
                return trimmed.split('\n').map((line, i) => {
                    const cleanedLine = line.trim();
                    if (cleanedLine) {
                        return (
                            <div key={`${idx}-${i}`} className="mb-2">
                                <span className="font-medium">{cleanedLine}</span>
                            </div>
                        );
                    }
                    return null;
                }).filter(Boolean);
            } else {
                // For regular lists, maintain original formatting
                const isList = trimmed.match(/^(\d+\.)|(\* )/gm);

                if (isList) {
                    return (
                        <div key={idx} className="space-y-2">
                            {trimmed.split('\n').map((line, i) => {
                                const cleanedLine = line.trim().replace(/^\* /, "- ");
                                if (cleanedLine) {
                                    return (
                                        <p key={i} className="ml-4 py-1 leading-relaxed">
                                            {cleanedLine}
                                        </p>
                                    );
                                }
                                return null;
                            }).filter(Boolean)}
                        </div>
                    );
                }

                return (
                    <p key={idx} className="leading-relaxed text-[15px] mb-4">
                        {trimmed}
                    </p>
                );
            }
        });
    };

    return (
        !chat.hideInChat && (
            <div className={`flex flex-col mb-6 md:mx-10 mt-5 mx-2 ${chat.role === "model" ? "bot" : "user"}`}>
                <div className={`flex items-start gap-3 w-full ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                    {chat.role !== "user" && (
                        <FaRobot size={22} className="text-purple-600 mt-1" />
                    )}
                    <div
                        className={`px-4 py-3 rounded-2xl shadow-sm border ${chat.role === "user"
                            ? "bg-purple-600 text-white order-2 border-transparent"
                            : `bg-white text-gray-800 order-1 border-gray-200 ${chat.isError ? "!text-red-700 bg-red-50 border-red-200" : ""}`
                            } ${chat.role !== "user" ? "lg:max-w-[60%] max-w-[92%] sm:max-w-[80%]" : "lg:max-w-[68%] max-w-[72%] sm:max-w-[70%]"}`}
                    >
                        <div className="space-y-2">
                            {formatTaskText(chat.text)}
                        </div>
                    </div>
                    {chat.role === "user" && (
                        <img
                            src={generateInitialsAvatar(userName || "User")}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full order-3"
                        />
                    )}
                </div>
                {chat.role === 'model' && (
                    <div className="flex gap-3 mt-2 ml-9 text-gray-500">
                        <button
                            title={copied ? "Copied!" : "Copy"}
                            onClick={handleCopy}
                            className="hover:bg-gray-100 p-1 rounded transition-colors"
                        >
                            {copied ? (
                                <FiCheck size={14} className="text-green-600" />
                            ) : (
                                <FiCopy size={14} className="hover:text-purple-500" />
                            )}
                        </button>
                        <button
                            title={liked ? "Unlike" : "Like"}
                            onClick={handleLike}
                            className="hover:bg-gray-100 p-1 rounded transition-colors"
                        >
                            <FiThumbsUp size={14} className={liked ? "text-purple-600" : "hover:text-purple-800"} />
                        </button>
                        <button
                            title={disliked ? "Remove dislike" : "Dislike"}
                            onClick={handleDislike}
                            className="hover:bg-gray-100 p-1 rounded transition-colors"
                        >
                            <FiThumbsDown size={14} className={disliked ? "text-red-600" : "hover:text-purple-800"} />
                        </button>
                        <button
                            title={isSpeaking ? "Stop speaking" : "Speak"}
                            onClick={isSpeaking ? handleStop : handleSpeak}
                            className="hover:bg-gray-100 p-1 rounded transition-colors"
                        >
                            {isSpeaking ? (
                                <FaStop size={14} className="text-purple-600" />
                            ) : (
                                <FiVolume2 size={14} className="hover:text-purple-800" />
                            )}
                        </button>
                    </div>
                )}

                {/* Demo section to show the component in action */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Demo Messages:</h3>
                    <div className="space-y-4">
                        <ChatMessage
                            chat={{
                                role: "model",
                                text: "Here are your tasks:\n\nTask 1: Review the documentation\nTask 2: Update the code\nTask 3: Test the changes\nTask 4: Deploy to production"
                            }}
                            userName="Demo User"
                        />
                        <ChatMessage
                            chat={{
                                role: "model",
                                text: "Here's a regular numbered list:\n\n1. First item\n2. Second item\n3. Third item"
                            }}
                            userName="Demo User"
                        />
                    </div>
                </div>
            </div>
        )
    );
}