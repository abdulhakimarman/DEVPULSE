import { sql } from "../../db";
import type { IssueResponseData, Issues } from "../../types";

export const createIssueIntoDB = async (
  payload: Omit<Issues, "id" | "status" | "created_at" | "updated_at">,
) => {
  const [result] = (await sql`
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES (${payload.title}, ${payload.description}, ${payload.type}, ${payload.reporter_id})
    RETURNING *
  `) as Issues[];

  return result;
};

export const getAllIssuesFromDB = async (filters: {
  sort?: string;
  type?: string;
  status?: string;
}) => {
  let query = sql`SELECT * FROM issues WHERE 1=1`;

  if (filters.type) query = sql`${query} AND type = ${filters.type}`;
  if (filters.status) query = sql`${query} AND status = ${filters.status}`;

  if (filters.sort === "oldest") {
    query = sql`${query} ORDER BY created_at ASC`;
  } else {
    query = sql`${query} ORDER BY created_at DESC`;
  }

  const issues = (await query) as Issues[];
  if (issues.length === 0) return [];

  const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];

  const users =
    (await sql`SELECT id, name, role FROM users WHERE id = ANY(${reporterIds})`) as any[];

  const userMap = new Map(users.map((u) => [u.id, u]));

  return issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: userMap.get(issue.reporter_id) || null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));
};

export const getSingleIssueFromDB = async (
  id: number,
): Promise<IssueResponseData | null> => {
  const [issue] =
    (await sql`SELECT * FROM issues WHERE id = ${id}`) as Issues[];
  if (!issue) return null;

  const [user] =
    (await sql`SELECT id, name, role FROM users WHERE id = ${issue.reporter_id}`) as any[];

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: user || null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

export const updateIssueInDB = async (id: number, payload: Partial<Issues>) => {
  const [result] = (await sql`
    UPDATE issues
    SET 
      title = COALESCE(${payload.title}, title),
      description = COALESCE(${payload.description}, description),
      type = COALESCE(${payload.type}, type),
      status = COALESCE(${payload.status}, status),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `) as Issues[];

  return result;
};

export const deleteIssueFromDB = async (id: number) => {
  await sql`DELETE FROM issues WHERE id = ${id}`;
};
