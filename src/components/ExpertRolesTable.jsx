import React from 'react';

const columns = [
  { key: 'role', label: 'Role' },
  { key: 'coreResponsibilities', label: 'Core Responsibilities' },
  { key: 'automationTools', label: 'Automation Tools' },
  { key: 'learningGoals', label: 'Learning Goals' },
  { key: 'progressionStage', label: 'Progression' },
  { key: 'reviewCadenceDays', label: 'SRS Cadence (Days)' },
  { key: 'status', label: 'Status' },
];

function listOrDash(value) {
  if (!value) return '—';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  return value;
}

export default function ExpertRolesTable({ rows = [] }) {
  if (!rows.length) {
    return <p>No expert roles available yet.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              style={{ textAlign: 'left', borderBottom: '1px solid #334155', padding: '8px' }}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.id || `${row.role || 'role'}-${index}`}>
            <td style={{ padding: '8px', borderBottom: '1px solid #1e293b' }}>{listOrDash(row.role)}</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #1e293b' }}>{listOrDash(row.coreResponsibilities)}</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #1e293b' }}>{listOrDash(row.automationTools)}</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #1e293b' }}>{listOrDash(row.learningGoals)}</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #1e293b' }}>{listOrDash(row.progressionStage)}</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #1e293b' }}>{listOrDash(row.reviewCadenceDays)}</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #1e293b' }}>{listOrDash(row.status)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
