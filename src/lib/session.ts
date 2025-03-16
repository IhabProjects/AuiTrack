import { cookies } from 'next/headers';

export interface SessionData {
  currentStep: number;
  answers: Record<string, any>;
  includeSummer: boolean;
  summerTerms: number;
  transferCredits: any[];
  specializations: string[];
}

export function getSession(): SessionData | null {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('degree_plan_session');

  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export function setSession(data: SessionData) {
  const cookieStore = cookies();
  cookieStore.set('degree_plan_session', JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  });
}

export function clearSession() {
  const cookieStore = cookies();
  cookieStore.delete('degree_plan_session');
}
