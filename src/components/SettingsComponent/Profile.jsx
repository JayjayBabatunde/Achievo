import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye } from "lucide-react";

// Generate initials-based avatar URL
const generateInitialsAvatar = (name) => {
    const nameParts = name.split(' ');
    const initials = nameParts
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;
};

const ProfileSettings = () => {
    // REMOVE image upload state
    const [url, setUrl] = useState(null);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        bio: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            try {
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);

                let avatarUrl = "";

                if (userSnap.exists()) {
                    const { name, bio } = userSnap.data();

                    // Always generate avatar from initials
                    avatarUrl = generateInitialsAvatar(name || currentUser.displayName);

                    setUserData(prev => ({
                        ...prev,
                        name: name || "",
                        email: currentUser.email || "",
                        bio: bio || "",
                    }));
                } else {
                    // Generate avatar if no user data exists
                    avatarUrl = generateInitialsAvatar(currentUser.displayName || "User");
                }

                setUrl(avatarUrl);
            } catch (err) {
                console.error("Error fetching user data:", err);
                toast.error("Failed to load user data");
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [id]: value,
        }));

        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userData.name.trim()) newErrors.name = "Username is required";
        if (!userData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (userData.newPassword && userData.newPassword !== userData.confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match";
        }

        if (userData.newPassword && !userData.currentPassword) {
            newErrors.currentPassword = "Current password is required to change password";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setLoading(true);

        const currentUser = auth.currentUser;
        if (!currentUser) {
            toast.error("User not authenticated");
            setLoading(false);
            return;
        }

        try {
            // Always use initials avatar
            const initialsAvatar = generateInitialsAvatar(userData.name);

            // Update email if changed
            if (userData.email !== currentUser.email) {
                await updateEmail(currentUser, userData.email);
            }

            // Update password if changed
            if (userData.newPassword && userData.currentPassword) {
                const credential = EmailAuthProvider.credential(
                    currentUser.email,
                    userData.currentPassword
                );
                await reauthenticateWithCredential(currentUser, credential);
                await updatePassword(currentUser, userData.newPassword);
            }

            // Update profile
            await updateProfile(currentUser, {
                displayName: userData.name,
                photoURL: initialsAvatar
            });

            // Update Firestore
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                name: userData.name,
                bio: userData.bio,
                email: userData.email,
                photoURL: initialsAvatar
            });

            // Update UI
            setUrl(initialsAvatar);

            toast.success("Profile updated successfully!");

            // Reset password fields
            setUserData(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));
        } catch (err) {
            console.error("Update failed:", err);

            if (err.code === "auth/requires-recent-login") {
                toast.error("Please reauthenticate to update sensitive info");
            } else if (err.code === "auth/wrong-password") {
                setErrors({ currentPassword: "Incorrect password" });
                toast.error("Incorrect current password");
            } else if (err.code === "auth/email-already-in-use") {
                toast.error("Email already in use");
            } else {
                toast.error("Failed to update profile");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl py-3">
            <ToastContainer position="top-right" autoClose={5000} theme="colored" />

            <h1 className="text-xl font-semibold  mb-6">Profile Settings</h1>

            <div className="py-3 mb-8">
                <div className="flex flex-col md:flex-col">
                    {/* Profile Picture Section */}
                    <div className="w-full flex flex-col items-center mx-auto relative">
                        <div className="mb-4 relative">
                            <img
                                src={url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                                alt="Profile"
                                className="w-32 h-32 rounded-full bg-gray-500 object-cover border-4 border-gray-200"
                            />
                        </div>
                        <p className="text-xs  text-center my-2 mb-4">
                            Your profile image is generated from your initials.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="w-full">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium  mb-1">
                                        Username *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={userData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"
                                            } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-black`}
                                    />
                                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium  mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={userData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"
                                            } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-black`}
                                    />
                                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="bio" className="block text-sm font-medium  mb-1">
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    value={userData.bio}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
                                />
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-4">
                                <h3 className="text-lg font-medium  mb-3">Change Password</h3>

                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        id="currentPassword"
                                        value={userData.currentPassword}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border ${errors.currentPassword ? "border-red-500" : "border-gray-300"
                                            } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-black pr-10`}
                                        placeholder="Required to change password"
                                    />
                                    <Eye
                                        onClick={() => setShowCurrentPassword(prev => !prev)}
                                        className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 mt-7">
                                    <div className="relative">
                                        <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                                            New Password
                                        </label>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            id="newPassword"
                                            value={userData.newPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                                            placeholder="Leave blank to keep current"
                                        />
                                        <Eye
                                            onClick={() => setShowNewPassword(prev => !prev)}
                                            className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                                        />
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            value={userData.confirmPassword}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-black pr-10`}
                                            placeholder="Confirm new password"
                                        />
                                        <Eye
                                            onClick={() => setShowConfirmPassword(prev => !prev)}
                                            className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                                        />
                                        {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;