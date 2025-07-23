import { FiThumbsUp, FiThumbsDown, FiVolume2, FiRefreshCw, FiCopy } from "react-icons/fi";
import React from "react";
import { FaRobot, FaUserCircle } from "react-icons/fa";

export default function ChatMessage({ chat }) {
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
                        <button title="Copy"><FiCopy size={14} className="hover:text-teal-800" /></button>
                        <button title="Like"><FiThumbsUp size={14} className="hover:text-teal-800" /></button>
                        <button title="Dislike"><FiThumbsDown size={14} className="hover:text-teal-800" /></button>
                        <button title="Speaker"><FiVolume2 size={14} className="hover:text-teal-800" /></button>
                        <button title="Reload"><FiRefreshCw size={14} className="hover:text-teal-800" /></button>
                    </div>
                )}
            </div>
        )
    );

}
