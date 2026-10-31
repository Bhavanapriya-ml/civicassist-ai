import React from 'react';
import { STATUS_CONFIG } from '../data/demoData';

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Open'];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block" style={{ backgroundColor: config.color }} />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const styles = {
    High:   'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low:    'bg-green-100 text-green-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[priority] || styles.Medium}`}>
      {priority}
    </span>
  );
}
