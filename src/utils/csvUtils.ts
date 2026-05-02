import type { Transaction } from '../types';

const CSV_HEADERS = [
  'id',
  'date',
  'type',
  'category',
  'asset',
  'amount',
  'price',
  'currency',
  'fee',
  'notes',
  'broker'
];

export const exportToCSV = (transactions: Transaction[]): void => {
  const csvRows = [
    CSV_HEADERS.join(','),
    ...transactions.map(tx => [
      tx.id,
      tx.date,
      tx.type,
      tx.category,
      `"${tx.asset.replace(/"/g, '""')}"`, // Handle commas in asset names
      tx.amount,
      tx.price,
      tx.currency,
      tx.fee,
      `"${(tx.notes || '').replace(/"/g, '""')}"`,
      `"${(tx.broker || '').replace(/"/g, '""')}"`
    ].join(','))
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `planto_tlog_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCSV = (csvContent: string): Transaction[] => {
  const lines = csvContent.split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const transactions: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parser (handle basic quoted strings)
    const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const cleanValues = values.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));

    if (cleanValues.length < 8) continue;

    const tx: any = {};
    headers.forEach((header, index) => {
      const val = cleanValues[index];
      if (header === 'amount' || header === 'price' || header === 'fee') {
        tx[header] = parseFloat(val) || 0;
      } else {
        tx[header] = val;
      }
    });

    // Basic validation
    if (tx.id && tx.date && tx.asset) {
      transactions.push(tx as Transaction);
    }
  }

  return transactions;
};
