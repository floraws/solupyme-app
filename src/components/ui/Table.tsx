import React from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T, index: number) => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: React.ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  emptyMessage = "No hay datos para mostrar",
  emptyIcon,
  emptyAction,
  className = '',
  striped = true,
  hoverable = true,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        {emptyIcon && (
          <div className="mx-auto mb-4 flex justify-center">
            {emptyIcon}
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {emptyMessage}
        </h3>
        {emptyAction && (
          <div className="mt-6">
            {emptyAction}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  ${striped && rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                  ${hoverable ? 'hover:bg-gray-50 transition-colors' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
                onClick={() => onRowClick?.(item, rowIndex)}
              >
                {columns.map((column, colIndex) => {
                  const value = column.key ? item[column.key] : null;
                  const content = column.render ? column.render(value, item, rowIndex) : value;
                  
                  return (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
