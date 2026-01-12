import { addErrorRefAction, removeErrorRefAction } from "./errorRefs.actions";
import type { TicketWithErrorRefs, ErrorCodeOption } from "@/types/errorCode";

export const ErrorCodeItem = ({ canEdit, ticket, errorCodes } : { canEdit: boolean, ticket: TicketWithErrorRefs, errorCodes: ErrorCodeOption[]; }) => {
    return (
        <>
            {canEdit && (
                <section style={{ marginTop: 16 }}>
                    <h3>Error Codes</h3>

                    <form action={addErrorRefAction} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="hidden" name="ticketId" value={ticket.id} />

                    <select name="errorCodeId" defaultValue="" required>
                        <option value="" disabled>Select error code</option>
                        {errorCodes.map(ec => (
                        <option key={ec.id} value={ec.id}>
                            {ec.code} - {ec.label}
                        </option>
                        ))}
                    </select>

                    <input name="note" placeholder="Optional note…" />

                    <button type="submit">Add</button>
                    </form>
                </section>
            )}

            <section style={{ marginTop: 12 }}>
                <h4>Linked Error Codes</h4>
                {ticket.errorRefs.length === 0 ? (
                    <p style={{ opacity: 0.7 }}>No error codes linked.</p>
                    ) : (
                    <ul>
                        {ticket.errorRefs.map((ref) => (
                            <li key={ref.id} style={{ marginBottom: 8 }}>
                                <div>
                                <b>{ref.errorCode.code}</b> — {ref.errorCode.label}
                                </div>
                                {ref.note && <div style={{ opacity: 0.8 }}>Note: {ref.note}</div>}
                                {ref.errorCode.suggestedFix && (
                                <div style={{ opacity: 0.8 }}>Fix: {ref.errorCode.suggestedFix}</div>
                                )}
                                <div style={{ fontSize: 12, opacity: 0.7 }}>
                                Added by {ref.addedBy.email}
                                </div>

                                {canEdit && (
                                <form action={removeErrorRefAction}>
                                    <input type="hidden" name="ticketId" value={ticket.id} />
                                    <input type="hidden" name="errorRefId" value={ref.id} />
                                    <button type="submit">Remove</button>
                                </form>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </>
    )
} 