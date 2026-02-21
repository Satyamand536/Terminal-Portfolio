'use client';

import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function BoxedHeader({ title }: { title: string }) {
  const breakpoint = useBreakpoint();
  
  if (breakpoint === 'mobile') {
    return (
      <div className="mobile-boxed-header" style={{
        border: '1px solid var(--p-primary)',
        padding: '4px 12px',
        margin: '10px 0',
        color: 'var(--p-primary)',
        fontWeight: 'bold',
        textAlign: 'center',
        background: 'rgba(0, 255, 136, 0.05)',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        {title}
      </div>
    );
  }

  return (
    <div className="boxed-header-desktop" style={{ margin: '15px 0' }}>
      <div>╔══════════════════════════════════════════════════════════════╗</div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span>║  {title.padEnd(59)} ║</span>
      </div>
      <div>╚══════════════════════════════════════════════════════════════╝</div>
    </div>
  );
}
