export type Role = "ADMIN" | "SUPPORT" | "USER";

export const canViewAllTickets = (role: Role) => {
  return role === "ADMIN" || role === "SUPPORT";
}

export const canCreateTicket = (role: Role) => {
  return role === "ADMIN" || role === "USER"; 
}

export const canUpdateTicket = (role: Role) =>{
  return role === "ADMIN" || role === "SUPPORT";
}

type UserLike = {
  id: string;
  role: Role;
}

type TicketLike = {
  ownerId: string;
}

export const canViewTicket = (user: UserLike, ticket: TicketLike) => {
  // ADMIN / SUPPORT can view any ticket
  if (user.role === "ADMIN" || user.role === "SUPPORT") return true;

  // USER can only view their own tickets
  return ticket.ownerId === user.id;
};