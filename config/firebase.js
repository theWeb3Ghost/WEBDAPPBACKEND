import fs from "fs";
import adminModule from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

// __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

// 1️⃣ Prefer environment variable (Render)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.log("Using FIREBASE_SERVICE_ACCOUNT from environment...");
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// 2️⃣ Fallback to local JSON file for development
} else {
  console.log("Using local serviceAccountKey.json...");
  const filePath = path.join(__dirname, "serviceAccountKey.json");
  serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Initialize Firebase Admin
const adminApp = adminModule.initializeApp({
  credential: adminModule.credential.cert(serviceAccount)
});
  export default adminApp;
