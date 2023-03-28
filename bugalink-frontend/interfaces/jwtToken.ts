type JWTTokenI = {
  token_type: string;
  exp: number;
  jti: string;
  user_id: number;
};

export default JWTTokenI;
