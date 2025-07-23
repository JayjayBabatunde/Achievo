import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const getUserContext = async () => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  if (!user) return null;

  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    return {
      name: userData.name || user.displayName || "User",
      email: user.email,
      uid: user.uid,
    };
  }

  return {
    name: user.displayName || "User",
    email: user.email,
    uid: user.uid,
  };
};
