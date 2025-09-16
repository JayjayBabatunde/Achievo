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
import AccountSettings from "./AccountSettings";
import { collection, onSnapshot, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";


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
    const [completedGoals, setCompletedGoals] = useState(0);
    const [totalGoals, setTotalGoals] = useState(0);
    const [averageSuccessRate, setAverageSuccessRate] = useState(0);

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

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const userGoalsRef = collection(db, "users", currentUser.uid, "goals");
                const q = query(userGoalsRef);

                const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                    const goalsData = snapshot.docs.map((doc) => doc.data());

                    const total = goalsData.length;
                    const completed = goalsData.filter(
                        (goal) => goal.completed && !goal.deleted
                    ).length;

                    setCompletedGoals(completed);
                    setTotalGoals(total);

                    // Compute averageSuccessRate (same approach as AnalyticsData.jsx)
                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear();
                    const currentMonth = currentDate.getMonth();

                    const monthlyStats = {};
                    for (let month = 0; month <= currentMonth; month++) {
                        const date = new Date(currentYear, month, 1);
                        const monthKey = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
                        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                        monthlyStats[monthKey] = {
                            month: monthName,
                            year: currentYear,
                            monthNumber: month + 1,
                            sortKey: month,
                            totalGoals: 0,
                            completedGoals: 0,
                            successRate: 0,
                        };
                    }

                    const activeGoals = goalsData.filter(g => !g.deleted);
                    activeGoals.forEach(goal => {
                        let deadline;
                        if (goal?.deadline?.toDate) {
                            deadline = goal.deadline.toDate();
                        } else if (goal?.deadline?.seconds) {
                            deadline = new Date(goal.deadline.seconds * 1000);
                        } else if (goal?.deadline) {
                            deadline = new Date(goal.deadline);
                        }
                        if (deadline && deadline.getFullYear() === currentYear) {
                            const key = `${deadline.getFullYear()}-${String(deadline.getMonth() + 1).padStart(2, '0')}`;
                            if (monthlyStats[key]) {
                                monthlyStats[key].totalGoals += 1;
                                if (goal.completed) monthlyStats[key].completedGoals += 1;
                            }
                        }
                    });

                    Object.values(monthlyStats).forEach(m => {
                        m.successRate = m.totalGoals > 0 ? Math.round((m.completedGoals / m.totalGoals) * 100) : 0;
                    });

                    const monthsWithGoals = Object.values(monthlyStats).filter(m => m.totalGoals > 0);
                    const avg = monthsWithGoals.length > 0
                        ? Math.round(monthsWithGoals.reduce((sum, m) => sum + m.successRate, 0) / monthsWithGoals.length)
                        : 0;
                    setAverageSuccessRate(avg);
                });

                return () => unsubscribeSnapshot();
            }
        });

        return () => unsubscribeAuth();
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
        <div className="py-3">
            <ToastContainer position="top-right" autoClose={5000} theme="colored" />

            {/* Header card */}
            <div className="rounded-xl border border-gray-200 shadow-sm p-5 py-8 mb-5">
                <div className="flex items-center gap-4">
                    <img
                        src={url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full bg-gray-200 object-cover"
                    />
                    <div className="flex-1">
                        <div className="text-2xl font-semibold">{userData.name || "Your Name"}</div>
                        <div className="text-[14px] text-gray-500 mt-2">Goal Enthusiast • Member since 2025</div>
                        <div className="flex flex-wrap items-center text-[14px] text-gray-500 mt-1">
                            <span>{userData.email || "you@example.com"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal information card */}
            <div className="w-full grid grid-cols-3 gap-4 mt-10">
                <div className="rounded-xl border border-gray-200 shadow-sm p-5 lg:col-span-2 col-span-3">
                    <div className="mb-4">
                        <h3 className="text-base font-semibold">Personal Information</h3>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="name" className="block text-xs font-medium mb-1">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={userData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-black`}
                                />
                                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-xs font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-black`}
                                />
                                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="bio" className="block text-xs font-medium mb-1">Bio</label>
                            <textarea
                                id="bio"
                                value={userData.bio}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
                            />
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <h4 className="text-sm font-medium mb-3">Current Password</h4>

                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    id="currentPassword"
                                    value={userData.currentPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.currentPassword ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-black pr-10`}
                                    placeholder="Required to change password"
                                />
                                <Eye onClick={() => setShowCurrentPassword(prev => !prev)} className="absolute right-3 top-3 text-gray-500 cursor-pointer" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="relative">
                                    <label htmlFor="newPassword" className="block text-xs font-medium mb-1">New Password</label>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        id="newPassword"
                                        value={userData.newPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                                        placeholder="Leave blank to keep current"
                                    />
                                    <Eye onClick={() => setShowNewPassword(prev => !prev)} className="absolute right-3 top-9 text-gray-500 cursor-pointer" />
                                </div>

                                <div className="relative">
                                    <label htmlFor="confirmPassword" className="block text-xs font-medium mb-1">Confirm New Password</label>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        value={userData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-black pr-10`}
                                        placeholder="Confirm new password"
                                    />
                                    <Eye onClick={() => setShowConfirmPassword(prev => !prev)} className="absolute right-3 top-9 text-gray-500 cursor-pointer" />
                                    {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full justify-end mt-5">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="lg:col-span-1 col-span-3">
                    {/* AccountSettings summary uses averageSuccessRate from analytics logic */}
                    <AccountSettings
                        variant="summary"
                        successRate={averageSuccessRate}
                        completedGoals={completedGoals}
                        totalGoals={totalGoals}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;