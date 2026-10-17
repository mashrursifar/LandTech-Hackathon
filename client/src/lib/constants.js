export const RULES = [
  { id: 'R1', name: 'Potential Double-Selling', short: 'Double-sale' },
  { id: 'R2', name: 'Seller / Owner Conflict', short: 'Seller conflict' },
  { id: 'R3', name: 'Registry / Mutation Mismatch', short: 'Mutation mismatch' },
  { id: 'R4', name: 'Duplicate Deed Reference', short: 'Duplicate deed' },
  { id: 'R5', name: 'Inconsistent Transfer Sequence', short: 'Broken chain' },
];

export const SCENARIOS = [
  { id: 'PLOT-1042', tone: 'high', tag: 'Double-sale' },
  { id: 'PLOT-2001', tone: 'ok', tag: 'Clean transfer' },
  { id: 'PLOT-3005', tone: 'ok', tag: 'Cancelled deed' },
  { id: 'PLOT-4010', tone: 'high', tag: 'Seller conflict' },
  { id: 'PLOT-5020', tone: 'review', tag: 'Mutation mismatch' },
  { id: 'PLOT-6030', tone: 'high', tag: 'Duplicate deed' },
  { id: 'PLOT-7040', tone: 'review', tag: 'Broken chain' },
];

export const REVIEW_STATUSES = [
  { value: 'Open', label: 'Open', hint: 'Pending inspection' },
  { value: 'Under Review', label: 'Under review', hint: 'Hold for registry inquiry' },
  { value: 'Resolved', label: 'Resolved', hint: 'Ownership verified' },
  { value: 'Dismissed', label: 'Dismissed', hint: 'Exception justified' },
];

export function severityTone(severity) {
  return severity === 'High' ? 'high' : 'review';
}

export function statusTone(status) {
  switch (status) {
    case 'Open':
      return 'info';
    case 'Under Review':
      return 'review';
    case 'Resolved':
      return 'ok';
    default:
      return 'muted';
  }
}
