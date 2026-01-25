// /root/projects/wade-template/src/services/auth.ts

/**
 * Authentication Service
 * ----------------------
 * FIXED: Now correctly finds the access_token whether it is 
 * at the top level or wrapped inside a "data" object.
 */

import { readMe, login, logout } from '@directus/sdk';
import { client } from '../lib/directus';

const TOKEN_KEY = 'wade_directus_token';

// 1. Log In
export async function loginUser(email: string, pass: string) {
  // Request the token
  const result = await client.request(login({ email, password: pass }));

  // Find the token (handling different response structures)
  // @ts-ignore
  const token = result?.access_token || result?.data?.access_token;

  if (token) {
    // A. Give it to the SDK (for right now)
    await client.setToken(token);
    
    // B. Save it to the Hard Drive (for later/refresh)
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  return result;
}

// 2. Log Out
export async function logoutUser() {
  // Clear everything
  await client.setToken(null);
  window.localStorage.removeItem(TOKEN_KEY);
  // We can also call the server logout if needed, but local clear is most important
}

// 3. Get Current User
export async function getCurrentUser() {
  return await client.request(readMe()); 
}

// 4. (NEW) Restore Session
// We call this when the app starts to reload the token from storage
export async function restoreSession() {
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (token) {
    await client.setToken(token);
  }
}