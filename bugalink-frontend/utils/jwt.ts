import jwt_decode from 'jwt-decode';
import JWTTokenI from '@/interfaces/jwtToken';

export const decodeJWT = (jwt: string) => {
  const token = jwt_decode<JWTTokenI>(jwt);
  return {
    tokenType: token.token_type,
    exp: token.exp,
    jti: token.jti,
    userId: token.user_id,
  };
};
