'use client';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import config from '../../../config.json';

export default function Neofetch() {
  const breakpoint = useBreakpoint();
  const data = config.content.neofetch;
  
  const ascii = [
    "  _________________ ",
    " /                /|",
    "/________________/ |",
    "|                | |",
    "|    >_ SATYAM   | |",
    "|                | |",
    "|________________|/ ",
    "    |________|      "
  ];

  const isMobile = breakpoint === 'mobile';

  return (
    <div 
      className="neofetch-container" 
      style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '12px' : '20px', 
        alignItems: isMobile ? 'center' : 'center',
        padding: '10px 0'
      }}
    >
      {!isMobile && (
        <pre style={{ color: 'var(--p-primary)', fontSize: '10px', margin: 0 }}>
          {ascii.join('\n')}
        </pre>
      )}
      
      {isMobile && (
        <div style={{ color: 'var(--p-primary)', fontSize: '10px', textAlign: 'center', marginBottom: '8px' }}>
          <pre style={{ margin: 0 }}>{ascii.join('\n')}</pre>
        </div>
      )}

      <div className="neofetch-info" style={{ width: isMobile ? '100%' : 'auto' }}>
        <div style={{ 
          color: 'var(--p-primary)', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          textAlign: isMobile ? 'center' : 'left',
          fontSize: isMobile ? '14px' : '12px',
          borderBottom: isMobile ? '1px solid var(--border-muted)' : 'none',
          paddingBottom: isMobile ? '4px' : '0'
        }}>
          {config.identity.username}@{config.identity.hostname}
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} style={{ 
              fontSize: isMobile ? '11px' : '12px',
              display: 'flex',
              justifyContent: isMobile ? 'space-between' : 'flex-start',
              gap: isMobile ? '0' : '8px'
            }}>
              <span style={{ color: 'var(--p-primary)', fontWeight: 'bold' }}>{key}</span>
              <span style={{ color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
