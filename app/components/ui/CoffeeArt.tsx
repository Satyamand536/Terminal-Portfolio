'use client';

import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function CoffeeArt() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  const ascii = [
    '        (  )   (   )  )',
    '         ) (   )  (  (',
    '         ( )  (    ) )',
    '         _____________',
    '        <_____________> ___',
    '        |             |/ _ \\',
    '        |               | | |',
    '        |               |_| |',
    '     ___|             |\\___/',
    '    /    \\___________/    \\',
    '    \\_____________________/'
  ];

  return (
    <div className="coffee-art" style={{ padding: '15px 0' }}>
      <div style={{ color: 'var(--text-white)', marginBottom: '10px' }}>☕ Brewing coffee...</div>
      <pre style={{ 
        color: 'var(--p-primary)', 
        fontSize: isMobile ? '8px' : '10px',
        lineHeight: '1.2',
        margin: '0 auto',
        textAlign: isMobile ? 'left' : 'left',
        overflowX: 'auto',
        maxWidth: '100%'
      }}>
        {ascii.join('\n')}
      </pre>
      <div style={{ color: 'var(--text-green)', marginTop: '10px' }}>✓ Here&apos;s your coffee! Stay caffeinated! ☕</div>
    </div>
  );
}
