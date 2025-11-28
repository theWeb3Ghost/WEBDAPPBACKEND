import adminApp from "../config/firebase.js";

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "Missing idToken" });
    }

    // Verify the Google ID token
    const decodedToken = await adminApp.auth().verifyIdToken(idToken);

    // You can create or fetch user data here

    res.status(200).json({
  uid: decodedToken.uid,
  displayName: decodedToken.name || decodedToken.email || "User",
  balance: 0   // starting balance
});
    
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ success: false, error: "Invalid token" });
  }
};
