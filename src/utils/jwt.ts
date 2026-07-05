import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string,
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};

const verifyToken = (token: string, secret: string) => {
  const payload = jwt.verify(token, secret) as JwtPayload;
  return payload;
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
