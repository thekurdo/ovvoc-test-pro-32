function parseCSV(text, delimiter = ',') {
  const lines = text.trim().split('\n');
  if (lines.length === 0) return [];

  const headers = lines[0].split(delimiter).map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim());
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || '';
    });
    rows.push(row);
  }

  return rows;
}

function toCSV(data, delimiter = ',') {
  if (!Array.isArray(data) || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const lines = [headers.join(delimiter)];

  for (const row of data) {
    const values = headers.map(h => {
      const val = String(row[h] ?? '');
      return val.includes(delimiter) ? `"${val}"` : val;
    });
    lines.push(values.join(delimiter));
  }

  return lines.join('\n');
}

module.exports = { parseCSV, toCSV };
