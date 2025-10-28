'use client';

// ============================================================================
// API CONFIGURATION
// ============================================================================
const AUTH_API_BASE_URL = 'http://localhost:8000';
const POLL_API_BASE_URL = 'http://localhost:8001';

// ============================================================================
// TYPES
// ============================================================================
export interface User {
  id?: string;
  email: string;
  name?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Option {
  id?: string;
  text: string;
  pollId?: string;
}

export interface Vote {
  id?: string;
  userId: string;
  optionId: string;
  pollId: string;
}

export interface Like {
  id?: string;
  userId: string;
  pollId: string;
}

export interface Poll {
  id?: string;
  question: string;
  userId: string;
  options?: Option[];
  votes?: Vote[];
  likes?: Like[];
  createdAt?: string;
}

export interface PollResponse {
  id: string;
  question: string;
  userId: string;
  createdAt: string;
  options: Option[];

  counts: { [key: string]: number };
  userHasVoted: string | null;
  userHasLiked: boolean;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

async function makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  
  const config: RequestInit = {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        clearAuthData();
        window.location.href = '/unauthorized';
        throw new Error('Authentication expired. Please login again.');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Create a poll
export async function createPoll(poll: Poll): Promise<Poll> {
  return makeRequest<Poll>(`${POLL_API_BASE_URL}/api/poll/create-poll`, {
    method: 'POST',
    body: JSON.stringify(poll),
  });
}

// Get all polls
export async function getAllPolls(): Promise<PollResponse[]> {
  return makeRequest<PollResponse[]>(`${POLL_API_BASE_URL}/api/poll/get-all-polls`);
}

// Get poll by ID
export async function getPollById(pollId: string): Promise<PollResponse> {
  return makeRequest<PollResponse>(`${POLL_API_BASE_URL}/api/poll/get-poll-by-id/${pollId}`);
}

// Get polls by user ID
export async function getUserPolls(userId: string): Promise<PollResponse[]> {
  console.log("userId", userId);
  return makeRequest<PollResponse[]>(`${POLL_API_BASE_URL}/api/poll/get-poll-by-user-id/${userId}`);
}

// Vote on a poll
export async function voteOnPoll(pollId: string, optionId: string): Promise<Vote> {
  return makeRequest<Vote>(`${POLL_API_BASE_URL}/api/poll/vote-on-poll/${pollId}/${optionId}`, {
    method: 'POST',
  });
}

// Like/unlike a poll
export async function likePoll(pollId: string): Promise<Like> {
  return makeRequest<Like>(`${POLL_API_BASE_URL}/api/poll/like-poll/${pollId}`, {
    method: 'POST',
  });
}

// Clear authentication data
export function clearAuthData(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('userData');
}

// Get stored user data
export function getStoredUser(): User | null {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
}

// Get stored token
export function getStoredToken(): string | null {
  return localStorage.getItem('access_token');
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
}

// Save user data to localStorage
export function saveUserData(user: User, token: string): void {
  localStorage.setItem('access_token', token);
  localStorage.setItem('userData', JSON.stringify(user));
}

export const pollAPI = {
  createPoll: createPoll,
  getAllPolls: getAllPolls,
  getPollById: getPollById,
  getPollsByUserId: getUserPolls,
  voteOnPoll: voteOnPoll,
  likePoll: likePoll,
};