export type Role = "ADMIN" | "SUPPORT" | "USER";
export type UserLike = {
  id: string;
  role: Role;
}
export type TicketLike = {
  ownerId: string;
}
