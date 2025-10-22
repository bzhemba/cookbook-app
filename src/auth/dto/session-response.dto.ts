import { User } from '../interface/session.interfaces';

export class SessionResponseDto {
  isAuthenticated: boolean;
  user?: User;
}
