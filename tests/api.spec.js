// @ts-check
import { test, expect } from '@playwright/test';

/**
 * TEST SUITE: Banking API (Backend)
 * Goal: Verify core logic without using the UI (Headless)
 */

// Force serial mode so TC:6 (Register) always finishes before TC:7 (Login)
test.describe.configure({ mode: 'serial' });

test.describe('Banking API Endpoints', () => {

  const API_URL = 'http://localhost:3001';
  
  // These variables are shared across tests in the same worker
  const UNIQUE_ID = Date.now().toString().slice(-4);
  const newUser = {
    firstName: 'API',
    lastName: 'User',
    username: `api_user_${UNIQUE_ID}`,
    password: 'password123',
    confirmPassword: 'password123'
  };

  test('TC:6 - Should register a new user via API', async ({ request }) => {
    const response = await request.post(`${API_URL}/users`, {
      data: newUser
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.user.username).toBe(newUser.username);
  });

  test('TC:7 - Should login and check authentication status via API', async ({ request }) => {
    // 1. Login
    const loginResponse = await request.post(`${API_URL}/login`, {
      data: {
        username: newUser.username,
        password: newUser.password
      }
    });

    expect(loginResponse.status()).toBe(200);

    // 2. Verify Session
    const authRecord = await request.get(`${API_URL}/checkAuth`);
    expect(authRecord.status()).toBe(200);
    
    const authBody = await authRecord.json();
    expect(authBody.user.username).toBe(newUser.username);
  });

});
