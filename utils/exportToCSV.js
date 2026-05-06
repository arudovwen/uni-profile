/**
 * Converts an array of objects to CSV format and triggers download
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column objects with header and key properties
 * @param {String} fileName - Name of the file (without extension)
 */
export function exportToCSV(data, columns, fileName = 'export') {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create CSV headers from column headers
  const headers = columns.map(col => col.header).join(',');

  // Create CSV rows from data
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key] ?? '';
      // Escape quotes and wrap in quotes if contains comma, newline, or quote
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });

  // Combine headers and rows
  const csv = [headers, ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}
