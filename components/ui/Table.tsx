import { ReactNode } from "react";

type TableProps = {
  children: ReactNode;
  className?: string;
};

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className={`w-full divide-y divide-gray-200 ${className}`.trim()}>
        {children}
      </table>
    </div>
  );
}

type TableHeadProps = {
  children: ReactNode;
};

export function TableHead({ children }: TableHeadProps) {
  return (
    <thead className="bg-gray-50">
      {children}
    </thead>
  );
}

type TableBodyProps = {
  children: ReactNode;
};

export function TableBody({ children }: TableBodyProps) {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {children}
    </tbody>
  );
}

type TableRowProps = {
  children: ReactNode;
};

export function TableRow({ children }: TableRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {children}
    </tr>
  );
}

type TableHeaderCellProps = {
  children: ReactNode;
  className?: string;
};

export function TableHeaderCell({ children, className = "" }: TableHeaderCellProps) {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 ${className}`.trim()}>
      {children}
    </th>
  );
}

type TableCellProps = {
  children: ReactNode;
  className?: string;
};

export function TableCell({ children, className = "" }: TableCellProps) {
  return (
    <td className={`whitespace-nowrap px-6 py-4 text-sm text-gray-900 ${className}`.trim()}>
      {children}
    </td>
  );
}
