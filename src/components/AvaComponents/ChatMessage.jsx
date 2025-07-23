import { FiThumbsUp, FiThumbsDown, FiVolume2, FiRefreshCw, FiCopy, FiCheck, } from "react-icons/fi";
import React, { useState } from "react";
import { FaRobot, FaStop, FaUserCircle } from "react-icons/fa";

export default function ChatMessage({ chat }) {
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleCopy = async () => {
        if (chat.text) {
            await navigator.clipboard.writeText(chat.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        }
    };

    const handleLike = () => {
        setLiked(true);
        setDisliked(false);
    };

    const handleDislike = () => {
        setDisliked(true);
        setLiked(false);
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


    return (
        !chat.hideInChat && (
            <div className={`flex flex-col mb-7 ${chat.role === "model" ? "bot" : "user"}`}>
                <div className={`flex items-start gap-2 w-full ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                    {chat.role !== "user" && (
                        <FaRobot size={22} className="text-teal-600 mt-1" />
                    )}
                    <div
                        className={`
                        px-4 py-2 rounded-lg
                        ${chat.role === "user"
                                ? "bg-teal-600 text-white order-2"
                                : `bg-gray-100 ${chat.isError ? "text-red-700 bg-red-200" : "text-gray-800"} order-1`
                            }
                        ${chat.role !== "user"
                                ? "lg:max-w-[45%] max-w-[80%] sm:max-w-[80%]"
                                : "lg:max-w-[30%] max-w-[50%] sm:max-w-[50%]"
                            }
                    `}
                    >
                        <span>
                            {chat.text.split('\n').map((line, idx) => (
                                <React.Fragment key={idx}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </span>
                    </div>
                    {chat.role === "user" && (
                        <FaUserCircle size={22} className="text-teal-600 mt-1 order-3" />
                    )}
                </div>
                {chat.role === 'model' && (
                    <div className="flex gap-3 mt-3 ml-9 text-gray-500">
                        <button title={copied ? "Copied!" : "Copy"} onClick={handleCopy}>
                            {copied ? (
                                <FiCheck size={14} className="text-green-600" />
                            ) : (
                                <FiCopy size={14} className="hover:text-teal-800" />
                            )}
                        </button>
                        <button title="Like" onClick={handleLike}>
                            <FiThumbsUp size={14} className={liked ? "text-green-600" : "hover:text-teal-800"} />
                        </button>
                        <button title="Dislike" onClick={handleDislike}>
                            <FiThumbsDown size={14} className={disliked ? "text-red-600" : "hover:text-teal-800"} />
                        </button>
                        <button title="Speaker" onClick={isSpeaking ? handleStop : handleSpeak}>
                            {isSpeaking ? (
                                <FaStop size={14} className="text-teal-600" />
                            ) : (
                                <FiVolume2 size={14} className="hover:text-teal-800" />
                            )}
                        </button>
                        {/* <button title="Reload"><FiRefreshCw size={14} className="hover:text-teal-800" /></button> */}
                    </div>
                )}
            </div>
        )
    );

}
