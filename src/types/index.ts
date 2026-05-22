export const role = ["contributor", "maintainer"] as const;

type Role = (typeof role)[number];

export type User = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
};
export type RUser = Omit<
  User,
  "id" | "created_at" | "updated_at" | "password_hash"
>;

export const issueType = ["bug", "feature_request"] as const;
type IssueType = (typeof issueType)[number];

export const issueStatus = ["open", "in_progress", "resolved"] as const;
type IssueStatus = (typeof issueStatus)[number];

export type Issues = {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
};

export type IssueResponseData = Omit<Issues, "reporter_id"> & {
  reporter: {
    id: number;
    name: string;
    role: Role;
  } | null;
};
