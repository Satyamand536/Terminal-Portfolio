'use client';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import config from '../../../config.json';
import ResponsiveLine from './ResponsiveLine';

export default function RecruiterQuickScan() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  return (
    <div className="recruiter-quick-scan" style={{ padding: '10px 0' }}>
      <div style={{ color: 'var(--p-primary)', fontWeight: 'bold', marginBottom: '8px' }}>
        &gt;&gt; INITIALIZING RECRUITER QUICK-SCAN...
      </div>
      
      <div style={{ display: 'grid', gap: '4px', marginBottom: '12px' }}>
        <div><span style={{ color: 'var(--text-muted)' }}>NAME:</span> <span style={{ color: 'var(--text-white)' }}>{config.identity.title}</span></div>
        <div><span style={{ color: 'var(--text-muted)' }}>EMAIL:</span> <span style={{ color: 'var(--text-cyan)' }}>{config.content.social.email}</span></div>
      </div>

      <ResponsiveLine />

      <div style={{ margin: '12px 0' }}>
        <div style={{ color: 'var(--text-yellow)', fontWeight: 'bold', marginBottom: '8px' }}>[TOP PROJECTS]</div>
        <div style={{ display: 'grid', gap: '8px' }}>
          {config.content.projects.slice(0, 2).map((p, i) => (
            <div key={i} style={{ 
              borderLeft: '2px solid var(--p-primary)', 
              paddingLeft: '12px',
              paddingBottom: '4px'
            }}>
              <div style={{ color: 'var(--p-primary)', fontWeight: 'bold' }}>▣ {p.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{p.tagline}</div>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveLine />

      <div style={{ marginTop: '12px', color: 'var(--p-accent)', fontSize: '11px', fontStyle: 'italic' }}>
        Type &apos;focus&apos; for a deeper architectural breakdown.
      </div>
    </div>
  );
}
