'use client';

export default function ResponsiveLine({ 
  char = '─', 
  className = '', 
  style = {} 
}: { 
  char?: string; 
  className?: string; 
  style?: React.CSSProperties 
}) {
  return (
    <div 
      className={`responsive-line ${className}`}
      style={{
        width: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        color: 'var(--text-muted)',
        opacity: 0.5,
        userSelect: 'none',
        ...style
      }}
    >
      {char.repeat(200)}
    </div>
  );
}
