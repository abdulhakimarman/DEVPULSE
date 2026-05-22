import { sql } from "../../db";
import type { RUser, User } from "../../types";
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

  async validateUser(email: string, password: string) {
    const res = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    if (res.length === 0) {
      return null;
    }
    const { password_hash, ...user } = res[0] as User;
    const isValid = await bcrypt.compare(password, password_hash);
    return isValid ? user : null;
  }
  async getUserById(id: number) {
    const res = await sql`
      SELECT id, name, email, role FROM users WHERE id = ${id}
    `;
    return res[0] as RUser & { id: number };
  }
}

export default new AuthService();
