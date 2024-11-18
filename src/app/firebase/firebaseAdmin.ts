import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

import { initializeApp, getApps, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from 'firebase-admin/auth';

dotenv.config(); // Load environment variables

// Parse the service account JSON from environment variable
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY?.replace(/\\n/gm, "\n"),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_CERT_URL,
  universe_domain: process.env.UNIVERSAL_DOMAIN,
} as admin.ServiceAccount;

// // Initialize Firebase app with parsed service account credentials
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
// });

// Initialize Firebase Admin only if no apps exist
const adminApp = !getApps().length ? initializeApp({
  credential: cert(serviceAccount),
}) : getApps()[0];

const db = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);

export { db, adminAuth };