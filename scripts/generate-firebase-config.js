#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate that all required variables are present
const missingVars = Object.entries(config)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('Error: Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`  - NEXT_PUBLIC_FIREBASE_${varName.replace(/([A-Z])/g, '_$1').toUpperCase().replace(/^_/, '')}`);
  });
  process.exit(1);
}

const configContent = `// This file is generated from environment variables
// Do not edit manually - it will be overwritten
const firebaseConfig = ${JSON.stringify(config, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'public', 'firebase-config.js');

try {
  fs.writeFileSync(outputPath, configContent, 'utf8');
  console.log('✓ Firebase config generated successfully:', outputPath);
} catch (error) {
  console.error('Error writing firebase-config.js:', error);
  process.exit(1);
}
