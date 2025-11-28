import fs from "fs";
import adminModule from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

// __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the service account JSON
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"), "utf8")
);


// Initialize Firebase Admin
const adminApp = adminModule.initializeApp({
  credential: adminModule.credential.cert(serviceAccount)
});
  export default adminApp;
