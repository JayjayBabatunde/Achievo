import ChatForm from "./ChatForm";
import { useEffect, useRef, useState, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import { AchievoData } from "../../AchievoData";
import { getUserContext } from "./utils/UserContext";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
    doc,
    setDoc,
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    limit,
    getDocs,
    updateDoc
} from "firebase/firestore";

export default function ChatbotUI() {
    const [chatHistory, setChatHistory] = useState([]);
    const [userName, setUserName] = useState("User");
    const [userId, setUserId] = useState(null);
    const [currentChatId, setCurrentChatId] = useState(null);
    const chatBodyRef = useRef();
    const [isLoading, setIsLoading] = useState(true);


    // Create or get the most recent chat session
    const getOrCreateChatSession = useCallback(async (uid) => {
        try {
            // Check for existing chats (get the most recent one)
            const chatsRef = collection(db, `users/${uid}/chats`);
            const q = query(chatsRef, orderBy("createdAt", "desc"), limit(1));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Use the most recent chat
                const recentChat = querySnapshot.docs[0];
                setCurrentChatId(recentChat.id);
                return {
                    id: recentChat.id,
                    messages: recentChat.data().messages || []
                };
            } else {
                // Create a new chat session with initial welcome message
                const initialMessage = {
                    hideInChat: true,
                    role: "model",
                    text: typeof AchievoData === "string"
                        ? AchievoData
                        : JSON.stringify(AchievoData, null, 2),
                };

                const newChatRef = await addDoc(chatsRef, {
                    messages: [initialMessage],
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    title: "New Chat"
                });

                setCurrentChatId(newChatRef.id);
                return {
                    id: newChatRef.id,
                    messages: [initialMessage]
                };
            }
        } catch (error) {
            console.error("Error getting chat session:", error);
            throw error;
        }
    }, []);

    const saveChatHistory = useCallback(async (messages) => {
        if (!userId || !currentChatId) return;

        try {
            const chatDocRef = doc(db, "users", userId, "chats", currentChatId);
            await setDoc(chatDocRef, {
                messages,
                updatedAt: serverTimestamp()
            }, { merge: true }); // Merge to preserve createdAt and other fields
        } catch (error) {
            console.error("Error saving chat history:", error);
        }
    }, [userId, currentChatId]);

    const loadChatHistory = useCallback(async (uid) => {
        try {
            const chatSession = await getOrCreateChatSession(uid);
            setChatHistory(chatSession.messages);
        } catch (error) {
            console.error("Error loading chat history:", error);
            setChatHistory([{
                hideInChat: true,
                role: "model",
                text: "Welcome! Failed to load chat history.",
            }]);
        }
    }, [getOrCreateChatSession]);

    const updateHistoryAndSave = (newHistoryorUpdater) => {
        setChatHistory(prev => {
            const newHistory = typeof newHistoryorUpdater === "function"
                ? newHistoryorUpdater(prev)
                : newHistoryorUpdater;
            saveChatHistory(newHistory);
            return newHistory;
        });
        // Auto-scroll after state update
        setTimeout(() => {
            chatBodyRef.current?.scrollTo({
                top: chatBodyRef.current.scrollHeight,
                behavior: "smooth"
            });
        }, 0);
    };

    useEffect(() => {
        // Ensure we wait for Firebase auth to initialize on first load
        setIsLoading(true);
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const user = await getUserContext();
                setUserName(user?.name || "User");
                setUserId(user?.uid || firebaseUser.uid);
            } else {
                setUserId(null);
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const load = async () => {
            await loadChatHistory(userId);
            setIsLoading(false); // only stop loading after chat history is set
        };

        load();
    }, [userId, loadChatHistory]);

    const generateBotResponse = async (history) => {
        // format chat history for API response
        const formattedHistory = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const systemPrompt = {
            role: "user",
            parts: [{
                text: `You are Ava, a goal coach helping a user named ${userName}. Respond in a friendly and encouraging tone. today is ${formattedDate}. When planning dates or setting timelines, base everything off this date, you don't necesarily nave to mention the date in your introductory conversation, only when conversation requires it.`
            }]
        };

        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [systemPrompt, ...formattedHistory] })
        };

        try {
            const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || "Something went wrong");

            let apiText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

            const lines = apiText.split('\n').filter(line => line.trim() !== "");
            let formattedText = "";
            let listCount = 0;
            lines.forEach(line => {
                if (/^[-*]\s/.test(line)) {
                    listCount += 1;
                    formattedText += `${listCount}. ${line.replace(/^[-*]\s/, "")}\n`;
                } else {
                    listCount = 0;
                    formattedText += line + "\n";
                }
            });

            apiText = formattedText.trim();

            // Remove "Thinking..." and add real bot response
            const finalHistory = [...history, { role: "model", text: apiText }];
            updateHistoryAndSave(finalHistory);

            // Update chat title if it's the first real message exchange
            if (history.length <= 2) { // Adjust this number based on your initial messages
                try {
                    const chatDocRef = doc(db, "users", userId, "chats", currentChatId);
                    const firstUserMessage = history.find(m => m.role === "user");
                    const newTitle = firstUserMessage?.text.substring(0, 50) || "Goal Chat";
                    await updateDoc(chatDocRef, {
                        title: newTitle
                    });
                } catch (error) {
                    console.error("Error updating chat title:", error);
                }
            }

        } catch (error) {
            const finalHistory = [...history, { role: "model", text: error.message, isError: true }];
            updateHistoryAndSave(finalHistory);
        }
    }

    const handleUserSubmit = async (userMessage) => {
        const userEntry = { role: "user", text: userMessage };
        const updatedHistory = [...chatHistory, userEntry];

        // 1. Update state and save to Firebase
        updateHistoryAndSave(updatedHistory);

        // 2. Add a temporary "Thinking..." message to chat and DB
        const withThinking = [...updatedHistory, { role: "model", text: "Thinking..." }];
        setChatHistory(withThinking);
        await saveChatHistory(withThinking);

        // 3. Generate bot response
        await generateBotResponse(updatedHistory); // pass without "Thinking..."
    };

    useEffect(() => {
        // Auto-scroll whenever chat history updates
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [chatHistory]);

    const greetingMesage = () => {
        const today = new Date();
        const currentHour = today.getHours();
        let greeting;
        if (currentHour < 12) {
            greeting = 'Good Morning';
        } else if (currentHour < 18) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }
        return greeting;
    }

    if (isLoading) {
        return;
    }

    return (
        <div className="min-h-[89vh] w-full max-w-full mx-auto py-3">
            <div className="backdrop-blur sm:border-[0.3px] rounded-2xl sm:shadow-sm flex flex-col h-[89vh] overflow-hidden">
                {/* Introduction Good morning User */}
                {chatHistory.filter(m => m.role === 'user').length === 0 && (
                    <div className="flex flex-col gap-5 items-center justify-center h-screen">
                        <h2 className="sm:text-[2.8rem] text-xl text-center font-bold">{greetingMesage()}, {userName}</h2>
                        <h3 className="sm:text-4xl text-center text-xl">Where should we begin?</h3>
                    </div>
                )}

                {/* Messages */}
                <div ref={chatBodyRef} className="flex-1 overflow-y-auto hide-scrollbar px-3 md:px-6 py-4">
                    {isLoading ? (
                        <div className="text-center py-8 text-gray-500">Loading chat...</div>
                    ) : (
                        chatHistory.map((chat, index) => (
                            <ChatMessage key={index} chat={chat} userName={userName} />
                        ))
                    )}
                </div>

                {/* Input */}
                <div className="px-2 md:px-6 py-3 border-t border-gray-200">
                    <ChatForm onUserSubmit={handleUserSubmit} />
                </div>
            </div>
        </div>
    );
}