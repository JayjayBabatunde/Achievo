import { useEffect, useState } from "react";
import { auth } from "../components/firebase/firebase";
import { sendEmailVerification, reload } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function EmailVerification() {
    const [isVerified, setIsVerified] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.currentUser) {
            setIsVerified(auth.currentUser.emailVerified);
        }
    }, []);

    const handleSendVerification = async () => {
        if (!auth.currentUser) return;
        setIsSending(true);
        try {
            await sendEmailVerification(auth.currentUser);
            toast.success("Verification email sent! Please check your inbox.");
        } catch (error) {
            console.error("Error sending verification email:", error);
            toast.error("Failed to send verification email. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    const handleReloadStatus = async () => {
        if (!auth.currentUser) return;
        setIsReloading(true);
        try {
            await reload(auth.currentUser);
            setIsVerified(auth.currentUser.emailVerified);
            if (auth.currentUser.emailVerified) {
                toast.success("Email verified successfully!");
                navigate("/dashboard"); // redirect after verification
            } else {
                toast.info("Still not verified. Please check your inbox.");
            }
        } catch (error) {
            console.error("Error refreshing user:", error);
        } finally {
            setIsReloading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-semibold mb-4">A Verification Link has been sent to your Email</h1>
            {isVerified ? (
                <p className="text-green-600">✅ Your email is verified!</p>
            ) : (
                <>
                    <p className="mb-4 text-gray-700 text-lg">
                        If not found chack spam folder
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={handleSendVerification}
                            disabled={isSending}
                            className={`px-4 py-2 rounded-md ${isSending
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                        >
                            {isSending ? "Sending..." : "Resend Verification Email"}
                        </button>

                        <button
                            onClick={handleReloadStatus}
                            disabled={isReloading}
                            className={`px-4 py-2 rounded-md ${isReloading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                        >
                            {isReloading ? "Checking..." : "Check Verification Status"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
