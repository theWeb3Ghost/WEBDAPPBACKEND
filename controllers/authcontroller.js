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
      success: true,
      user: decodedToken
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ success: false, error: "Invalid token" });
  }
};
