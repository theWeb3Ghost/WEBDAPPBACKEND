import admin from "../config/firebase.js";

export default async function verify(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).send("No token");
    }

    const token = header.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded;
    next();
  } catch (e) {
    console.error("Invalid Google token:", e);
    res.status(401).send("Invalid token");
  }
}
