export type Role = "ADMIN" | "SUPPORT" | "USER";

export const permissions = {
  ADMIN: {
    manageUsers: true,
    viewAllTickets: true,
    updateTicketStatus: true,
    assignTickets: true,
    commentAny: true,
    createTicket: true,
    viewOwnTickets: true,
    commentOwn: true,
  },
  SUPPORT: {
    manageUsers: false,
    viewAllTickets: true,
    updateTicketStatus: true,
    assignTickets: true,
    commentAny: true,
    createTicket: false,     // optional — set true if you want Support to create too
    viewOwnTickets: true,
    commentOwn: true,
  },
  USER: {
    manageUsers: false,
    viewAllTickets: false,
    updateTicketStatus: false,
    assignTickets: false,
    commentAny: false,
    createTicket: true,
    viewOwnTickets: true,
    commentOwn: true,
  },
} as const;

export function can(role: Role, action: keyof typeof permissions.ADMIN) {
  return permissions[role][action] === true;
}
