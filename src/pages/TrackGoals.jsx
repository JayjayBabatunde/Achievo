// Create a new file: Analytics.js
import { useEffect, useState } from "react";
import { db, auth } from "../components/firebase/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AnalyticsDashboard from "../components/overviewComponents/AnalyticsData";

export default function TrackGoals() {
    const [goals, setGoals] = useState([]);
    const [user, setUser] = useState(null);

    // Same authentication and data fetching logic as your Goals component
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userGoalsRef = collection(db, "users", currentUser.uid, "goals");
                const q = query(userGoalsRef, orderBy("createdAt", "asc"));

                const unsubscribeSnapshot = onSnapshot(
                    q,
                    (snapshot) => {
                        const fetchedGoals = snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                        setGoals(fetchedGoals);
                    },
                    (error) => {
                        console.error("Snapshot error:", error.message);
                    }
                );

                return () => unsubscribeSnapshot();
            }
        });

        return () => unsubscribeAuth();
    }, []);

    return (
        <div className="mt-20">
            <AnalyticsDashboard goals={goals} />
        </div>
    )
}