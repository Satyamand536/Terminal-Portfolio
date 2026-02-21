'use client';

import { useBreakpoint } from '../../hooks/useBreakpoint';

type Role = 'visitor' | 'recruiter';

export default function HelpMenu({ role }: { role: Role }) {
  const breakpoint = useBreakpoint();
  const roleCommands = role === 'visitor' 
    ? [
        { cmd: 'help', desc: 'Show this menu' },
        { cmd: 'about', desc: 'Learn about Satyam' },
        { cmd: 'projects', desc: 'View projects' },
        { cmd: 'neofetch', desc: 'System info' },
        { cmd: 'ask [question]', desc: 'Ask AI assistant' },
        { cmd: 'whoami', desc: 'Show current mode' },
        { cmd: 'role recruiter', desc: 'Switch to Recruiter Mode' },
        { cmd: 'theme [name]', desc: 'Change UI theme' }
      ]
    : [
        { cmd: 'quick', desc: 'Recruiter scan' },
        { cmd: 'focus', desc: 'Deep-dive projects' },
        { cmd: 'timeline', desc: 'Career journey' },
        { cmd: 'status', desc: 'Live status' },
        { cmd: 'resume', desc: 'Open resume PDF' },
        { cmd: 'whoami', desc: 'Show current mode' },
        { cmd: 'role visitor', desc: 'Back to Visitor Mode' }
      ];

  if (breakpoint === 'mobile') {
    return (
      <div className="mobile-help-menu" style={{ margin: '10px 0' }}>
        <div style={{ color: 'var(--text-yellow)', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid var(--border-muted)', paddingBottom: '4px' }}>
          AVAILABLE COMMANDS [{role.toUpperCase()}]
        </div>
        {roleCommands.map(c => (
          <div key={c.cmd} style={{ marginBottom: '8px' }}>
            <span style={{ color: 'var(--p-primary)', fontWeight: 'bold' }}>{c.cmd}</span>
            <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>│ {c.desc}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="help-menu-desktop" style={{ margin: '15px 0' }}>
      <div>┌─────────────────────────────────────────────────────────────┐</div>
      <div>│  AVAILABLE COMMANDS [{role.toUpperCase()} MODE]            │</div>
      <div>├───────────────────┬─────────────────────────────────────────┤</div>
      {roleCommands.map(c => (
        <div key={c.cmd}>
          │  {c.cmd.padEnd(16)} │  {c.desc.padEnd(38)} │
        </div>
      ))}
      <div>└───────────────────┴─────────────────────────────────────────┘</div>
    </div>
  );
}
