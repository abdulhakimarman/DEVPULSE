import dotenv from "dotenv";
import { env } from "process";

dotenv.config({ quiet: true });

const config = {
  port: env.PORT as string,
  databaseUrl: env.DATABASE_URL as string,
  nodeEnv: env.NODE_ENV as string,
  jwtSecretKey: env.JWT_SECRET_KEY as string,
  refreshTokenSecretKey: env.REFRESH_TOKEN_SECRET_KEY as string,
};

export default config;
