import adminApp from "../config/firebase.js";

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "Missing idToken" });
    }

    const decodedToken = await adminApp.auth().verifyIdToken(idToken);

    const userData = {
      uid: decodedToken.uid,
      displayName: decodedToken.name || decodedToken.email || "User",
      balance: 0
    };

    console.log("SENDING TO FRONTEND:", userData);   // 👈 ADD THIS

    res.status(200).json(userData);

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ success: false, error: "Invalid token" });
  }
};
