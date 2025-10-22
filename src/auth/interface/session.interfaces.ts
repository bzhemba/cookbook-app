import session from 'express-session';

export interface User {
  id: string;
  name: string;
}

export interface UserSession {
  user?: User;
}

export interface CustomSession extends session.Session {
  customProperty?: string;
}
