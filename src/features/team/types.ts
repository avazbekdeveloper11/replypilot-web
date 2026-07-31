/** Mirrors backend/internal/delivery/http/v1/dto.go's Team* response
 * shapes exactly, same convention as every other features/*\/types.ts. */
export interface Role {
  id: string;
  name: string;
}

export interface TeamMemberUser {
  id: string;
  email: string;
  full_name: string;
}

export interface TeamMember {
  id: string;
  user: TeamMemberUser;
  role: Role;
  status: "invited" | "active" | "suspended" | "removed";
  invited_at: string;
  joined_at?: string;
}
