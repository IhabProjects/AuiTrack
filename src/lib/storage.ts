export interface SessionData {
  currentStep: number;
  answers: Record<string, any>;
  includeSummer: boolean;
  summerTerms: number;
  transferCredits: any[];
  specializations: string[];
}

const STORAGE_KEY = 'degree_plan_session';

export function getSession(): SessionData | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setSession(data: SessionData) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}
