/**
 * Exports data to CSV format and triggers download
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions with field and header properties
 * @param {String} fileName - Name of the CSV file (without extension)
 */
export function exportToCSV(data, columns, fileName = 'export') {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create CSV header
  const headers = columns.map(col => `"${col.header}"`).join(',');

  // Create CSV rows
  const rows = data.map(item => {
    return columns.map(col => {
      let value = item[col.field];

      // Handle null/undefined values
      if (value === null || value === undefined) {
        return '""';
      }

      // Convert value to string and escape quotes
      value = String(value).replace(/"/g, '""');

      // Wrap in quotes if contains comma, newline, or quotes
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        return `"${value}"`;
      }

      return `"${value}"`;
    }).join(',');
  });

  // Combine header and rows
  const csvContent = [headers, ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
