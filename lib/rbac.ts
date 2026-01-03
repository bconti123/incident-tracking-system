export type Role = "ADMIN" | "SUPPORT" | "USER";

export const canViewAllTickets = (role: Role) => {
  return role === "ADMIN" || role === "SUPPORT";
}

export const canCreateTicket = (role: Role) => {
  return role === "ADMIN" || role === "USER"; // per your Day 2 rules
}

export const canUpdateTicket = (role: Role) =>{
  return role === "ADMIN" || role === "SUPPORT";
}
