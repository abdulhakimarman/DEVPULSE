import { sql } from "../../db";
import type { RUser } from "../../types";
import bcrypt from "bcrypt";

class AuthService {
  async createUser(user: RUser & { password: string }) {
    const { name, email, password, role } = user;
    const hash = await bcrypt.hash(password, 10);
    const res = await sql`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (${name}, ${email}, ${hash}, COALESCE(${role}, 'contributor'))
      RETURNING id, name, email, role, created_at, updated_at
    `;
    return res[0];
  }
}

export default new AuthService();