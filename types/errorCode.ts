export type ErrorCodeOption = { id: string; code: number; label: string };

export type TicketErrorRefView = {
  id: string;
  note: string | null;
  errorCode: { code: number; label: string; suggestedFix: string | null };
  addedBy: { email: string };
};

export type TicketWithErrorRefs = {
  id: string;
  errorRefs: TicketErrorRefView[];
};
