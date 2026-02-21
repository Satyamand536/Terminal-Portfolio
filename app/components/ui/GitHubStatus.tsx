'use client';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import BoxedHeader from './BoxedHeader';

export default function GitHubStatus({ data, loading }: { data: any, loading: boolean }) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  if (!data && !loading) return null;

  if (loading) {
    return (
      <div style={{ padding: '10px 0' }}>
        <div style={{ color: 'var(--p-primary)' }}>&gt;&gt; LOADING GITHUB DATA...</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Please wait while we connect to the mainframe...</div>
      </div>
    );
  }

  const recentEvents = data.events?.slice(0, 3) || [];
  
  function getTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  return (
    <div className="github-status-container" style={{ padding: '10px 0' }}>
      <BoxedHeader title="LIVE GITHUB STATUS" />
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '10px' : '20px',
        marginTop: '15px'
      }}>
        <div className="profile-info" style={{ 
          border: '1px solid var(--border-muted)', 
          padding: '12px',
          background: 'rgba(0, 255, 136, 0.02)'
        }}>
          <div style={{ color: 'var(--p-primary)', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid var(--border-muted)', paddingBottom: '4px' }}>
            PROFILE METRICS
          </div>
          <div style={{ display: 'grid', gap: '4px', fontSize: '12px' }}>
            <div><span style={{ color: 'var(--text-muted)' }}>User:</span> <span style={{ color: 'var(--text-white)' }}>{data.profile?.login || 'N/A'}</span></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Repos:</span> <span style={{ color: 'var(--text-white)' }}>{data.profile?.public_repos || '0'}</span></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Followers:</span> <span style={{ color: 'var(--text-white)' }}>{data.profile?.followers || '0'}</span></div>
            <div style={{ marginTop: '4px', fontStyle: 'italic', color: 'var(--p-accent)', fontSize: '11px' }}>
              &quot;{data.profile?.bio || 'Web Developer'}&quot;
            </div>
          </div>
        </div>

        <div className="activity-info" style={{ 
          border: '1px solid var(--border-muted)', 
          padding: '12px',
          background: 'rgba(0, 255, 136, 0.02)'
        }}>
          <div style={{ color: 'var(--p-primary)', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid var(--border-muted)', paddingBottom: '4px' }}>
            RECENT ACTIVITY
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            {recentEvents.length > 0 ? recentEvents.map((event: any, i: number) => {
              let action = 'Activity';
              if (event.type === 'PushEvent') action = `Pushed to ${event.repo.name.split('/')[1]}`;
              else if (event.type === 'CreateEvent') action = `Created ${event.payload.ref_type} in ${event.repo.name.split('/')[1]}`;
              else if (event.type === 'WatchEvent') action = `Starred ${event.repo.name.split('/')[1]}`;
              
              return (
                <div key={i} style={{ fontSize: '11px' }}>
                  <div style={{ color: 'var(--text-white)' }}>{action}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{getTimeAgo(event.created_at)}</div>
                </div>
              );
            }) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>No recent activity found.</div>
            )}
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '15px', 
        padding: '8px', 
        border: '1px dashed var(--p-primary)', 
        color: 'var(--p-primary)',
        fontSize: '11px',
        textAlign: 'center',
        background: 'rgba(0, 255, 136, 0.05)'
      }}>
        AVAILABLE FOR FULL-STACK OPPORTUNITIES | GLOBAL / REMOTE
      </div>
    </div>
  );
}
