import { addErrorRefAction, removeErrorRefAction } from "./errorRefs.actions";
import type { TicketWithErrorRefs, ErrorCodeOption } from "@/types/errorCode";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const ErrorCodeItem = ({ canEdit, ticket, errorCodes } : { canEdit: boolean, ticket: TicketWithErrorRefs, errorCodes: ErrorCodeOption[]; }) => {
    return (
        <>
            {canEdit && (
                <section className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Codes</h3>

                    <form action={addErrorRefAction} className="flex gap-3 flex-wrap items-end">
                        <input type="hidden" name="ticketId" value={ticket.id} />

                        <Select
                            name="errorCodeId"
                            label="Error Code"
                            defaultValue=""
                            required
                        >
                            <option value="" disabled>Select error code</option>
                            {errorCodes.map(ec => (
                                <option key={ec.id} value={ec.id}>
                                    {ec.code} - {ec.label}
                                </option>
                            ))}
                        </Select>

                        <Input
                            name="note"
                            label="Note"
                            placeholder="Optional note…"
                            className="flex-1 min-w-[200px]"
                        />

                        <Button type="submit" variant="primary">
                            Add
                        </Button>
                    </form>
                </section>
            )}

            <section className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Linked Error Codes</h3>
                {ticket.errorRefs.length === 0 ? (
                    <p className="text-sm text-gray-600">No error codes linked.</p>
                ) : (
                    <ul className="space-y-4">
                        {ticket.errorRefs.map((ref) => (
                            <li key={ref.id} className="rounded-md border border-gray-200 bg-gray-50 p-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{ref.errorCode.code}</p>
                                        <p className="text-sm text-gray-700">{ref.errorCode.label}</p>
                                        {ref.note && (
                                            <p className="mt-1 text-sm text-gray-600">
                                                <span className="font-medium">Note:</span> {ref.note}
                                            </p>
                                        )}
                                        {ref.errorCode.suggestedFix && (
                                            <p className="mt-1 text-sm text-gray-600">
                                                <span className="font-medium">Fix:</span> {ref.errorCode.suggestedFix}
                                            </p>
                                        )}
                                        <p className="mt-2 text-xs text-gray-500">
                                            Added by {ref.addedBy.email}
                                        </p>
                                    </div>
                                    {canEdit && (
                                        <form action={removeErrorRefAction} className="inline">
                                            <input type="hidden" name="ticketId" value={ticket.id} />
                                            <input type="hidden" name="errorRefId" value={ref.id} />
                                            <button
                                                type="submit"
                                                className="text-xs font-medium text-red-600 hover:text-red-900 whitespace-nowrap"
                                            >
                                                Remove
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </>
    )
} 