'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint';
import config from '../../config.json';
import ResponsiveAscii from './ui/ascii/ResponsiveAscii';
import ResponsiveLine from './ui/ResponsiveLine';
import Neofetch from './ui/Neofetch';
import GitHubStatus from './ui/GitHubStatus';
import RecruiterQuickScan from './ui/RecruiterQuickScan';
import CoffeeArt from './ui/CoffeeArt';
import HelpMenu from './ui/HelpMenu';
import BoxedHeader from './ui/BoxedHeader';
import UserProfileAscii from './ui/UserProfileAscii';

type OutputLine = {
  content: string | React.ReactNode;
  type: 'text' | 'command' | 'error' | 'banner' | 'link';
  delay?: number;
};

type HistoryEntry = {
  command: string;
  output: OutputLine[];
};

const COMMANDS_BASE = {
  visitor: ['help', 'banner', 'about', 'projects', 'contact', 'neofetch', 'ask', 'whoami', 'clear', 'theme', 'joke', 'quote', 'coffee'],
  recruiter: ['quick', 'focus', 'resume', 'status', 'timeline', 'contact', 'whoami', 'clear']
};

type Role = 'visitor' | 'recruiter';
type Theme = 'matrix' | 'bloomberg' | 'amber';



const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
  "Why did the developer go broke? Because he used up all his cache! 💸",
  "What's a programmer's favorite hangout place? The Foo Bar! 🍺",
  "Why do Java developers wear glasses? Because they don't C#! 👓",
  "What did the React component say to the prop? You complete me! ⚛️",
  "Why did the function break up with the variable? It had too many arguments! 💔",
  "How do you comfort a JavaScript bug? You console it! 🐞"
];

const QUOTES = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Code is like humor. When you have to explain it, it's bad. - Cory House",
  "First, solve the problem. Then, write the code. - John Johnson",
  "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
  "The best error message is the one that never shows up. - Thomas Fuchs",
  "Simplicity is the soul of efficiency. - Austin Freeman",
  "Make it work, make it right, make it fast. - Kent Beck",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler"
];

function SocialLink({ platform, value }: { platform: string; value: string }) {
  const urls: Record<string, string> = {
    email: `mailto:${value}`,
    github: `https://github.com/${value}`,
    linkedin: `https://linkedin.com/in/${value}`,
    resume: `/${value}`,
  };

  const labels: Record<string, string> = {
    email: '✉ EMAIL',
    github: '⚡ GITHUB',
    linkedin: '💼 LINKEDIN',
    resume: '📄 RESUME',
  };

  return (
    <a
      href={urls[platform]}
      target={platform === 'email' ? undefined : '_blank'}
      rel="noopener noreferrer"
      className="social-link"
    >
      <span className="link-label">{labels[platform] || platform.toUpperCase()}</span>
      <span className="link-value">{value}</span>
    </a>
  );
}

type Project = {
  name: string;
  tagline: string;
  problem: string;
  approach: string;
  tech: string;
  challenge: string;
  outcome: string;

  demo: string;
  github: string;
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="project-card" style={{ padding: '12px', border: '1px solid var(--p-border-muted)' }}>
      <div className="project-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
        <div className="project-name" style={{ color: 'var(--text-yellow)', fontWeight: 'bold' }}>{project.name}</div>
        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link" style={{ fontSize: '9px', textDecoration: 'none' }}>
          LIVE ↗
        </a>
      </div>
      <div className="project-tagline" style={{ color: 'var(--p-primary)', fontSize: '10px', fontWeight: 'bold', marginBottom: '8px', opacity: 0.9 }}>
        {project.tagline}
      </div>
      <div className="project-desc" style={{ fontSize: '11px', marginBottom: '8px', lineHeight: '1.4' }}>
        <div style={{ marginBottom: '4px' }}><span style={{ color: 'var(--text-yellow)', fontSize: '9px' }}>🎯 PROBLEM:</span> {project.problem}</div>
        <div><span style={{ color: 'var(--text-yellow)', fontSize: '9px' }}>💡 APPROACH:</span> {project.approach}</div>
      </div>
      <div className="project-tech-stack" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--p-accent)' }}>⚙️ TECH:</span> {project.tech}
      </div>
    </div>
  );
}


export default function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draftInput, setDraftInput] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [role, setRole] = useState<Role>('visitor');
  const [theme, setTheme] = useState<Theme>('matrix');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [githubData, setGithubData] = useState<any>(null);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [bootMessages, setBootMessages] = useState<string[]>([]);
  const [showMatrixRain, setShowMatrixRain] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Theme handler
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const currentCommands = role === 'visitor' ? COMMANDS_BASE.visitor : COMMANDS_BASE.recruiter;

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Screen size state - REMOVED (Handled by ResponsiveAscii)

  // Show banner on initial load
  useEffect(() => {
    const bannerOutput = getBannerOutput();
    setHistory([{ command: '', output: bannerOutput }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  function getBannerOutput(): OutputLine[] {
    const banner: OutputLine[] = [
      {
        content: <ResponsiveAscii />,
        type: 'banner',
        delay: 0,
      },
      { content: '', type: 'text', delay: 20 },
      { content: `[CURRENT MODE: ${role.toUpperCase()}] | Type 'help' to see available commands`, type: 'text', delay: 40 }
    ];
    
    return banner;
  }

  function getHelpOutput(): OutputLine[] {
    return [
      {
        content: <HelpMenu role={role} />,
        type: 'text'
      },
      { content: '', type: 'text' },
      { 
        content: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-yellow)' }}>💡 TIP:</span>
            <span>AI Assistant usage: ask [your question]</span>
          </div>
        ), 
        type: 'text' 
      },
      { content: '   Example: ask about your tech stack', type: 'text' }
    ];
  }

  function getAboutOutput(): OutputLine[] {
    return [
      { content: <BoxedHeader title="ABOUT" />, type: 'text' },
      { content: '', type: 'text' },
      { content: <UserProfileAscii />, type: 'text' },
      { content: '', type: 'text' },
      { content: config.identity.greeting, type: 'text' },
      { content: '', type: 'text' },
      { content: 'Passionate Web Developer & Computer Science Student.', type: 'text' },
      { content: 'Creating dynamic, responsive web apps with modern technologies.', type: 'text' },
      { content: 'Focused on React, Node.js, and building cool things.', type: 'text' },
      { content: '', type: 'text' },
      { content: <ResponsiveLine />, type: 'text' },
      { content: '', type: 'text' },
      {
        content: (
          <div className="social-grid">
            {Object.entries(config.content.social).map(([platform, value]) => (
              <SocialLink key={platform} platform={platform} value={value} />
            ))}
          </div>
        ),
        type: 'link',
      },
    ];
  }

  function getProjectsOutput(): OutputLine[] {
    return [
      { content: <BoxedHeader title="PORTFOLIO PROJECTS" />, type: 'text' },
      {
        content: (
          <div className="projects-grid">
            {config.content.projects.map((project) => (
              <ProjectCard
                key={project.name}
                project={project}
              />
            ))}
          </div>
        ),
        type: 'link',
      },
    ];
  }

  function getNeofetchOutput(): OutputLine[] {
    return [
      {
        content: <Neofetch />,
        type: 'text'
      }
    ];
  }

  function getTimelineOutput(): OutputLine[] {
    return [
      { content: <BoxedHeader title="CAREER JOURNEY" />, type: 'text' },
      {
        content: (
          <div className="timeline-container" style={{ marginTop: '10px' }}>
            {config.content.timeline.map((item, i) => (
              <div key={i} style={{ marginBottom: '15px', borderLeft: '2px solid var(--p-primary)', paddingLeft: '15px' }}>
                <div style={{ color: 'var(--p-accent)', fontWeight: 'bold' }}>{item.year}</div>
                <div style={{ color: 'var(--text-white)', fontWeight: 'bold' }}>{item.role}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{item.description}</div>
              </div>
            ))}
            <div style={{ 
              marginTop: '20px', 
              paddingTop: '15px', 
              borderTop: '1px solid var(--border-muted)',
              fontSize: '12px',
              lineHeight: '1.5'
            }}>
              <span style={{ color: 'var(--p-primary)', fontWeight: 'bold' }}>CORE IDENTITY:</span><br/>
              {(config.content as any).identity_summary}
            </div>
          </div>
        ),
        type: 'text'
      }
    ];
  }

  function getQuickOutput(): OutputLine[] {
    return [
      {
        content: <RecruiterQuickScan />,
        type: 'text'
      }
    ];
  }

  function getFocusOutput(): OutputLine[] {
    return [
      { content: <BoxedHeader title="ARCHITECTURAL FOCUS" />, type: 'text' },
      { content: '', type: 'text' },
      {
        content: (
          <div className="focus-grid" style={{ display: 'grid', gap: '20px' }}>
            {config.content.projects.map((p, i) => (
              <div key={i} className="focus-item" style={{ 
                borderBottom: '1px solid var(--border-muted)', 
                paddingBottom: '15px' 
              }}>
                <div style={{ color: 'var(--p-primary)', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>
                  {p.name.toUpperCase()}
                </div>
                <div style={{ display: 'grid', gap: '8px', fontSize: '12px' }}>
                  <div><span style={{ color: 'var(--text-yellow)' }}>🎯 PROBLEM:</span> {p.problem}</div>
                  <div><span style={{ color: 'var(--text-yellow)' }}>💡 APPROACH:</span> {p.approach}</div>
                  <div><span style={{ color: 'var(--text-cyan)' }}>⚙️ TECH:</span> {p.tech}</div>
                  <div><span style={{ color: 'var(--text-red)' }}>🔧 CHALLENGE:</span> {p.challenge}</div>
                  <div><span style={{ color: 'var(--text-green)' }}>✅ RESULT:</span> {p.outcome}</div>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '4px', fontSize: '10px' }}>
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--p-accent)', textDecoration: 'none' }}>🌐 LIVE DEMO ↗</a>
                    <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--p-primary)', textDecoration: 'none' }}>🐙 GITHUB REPO ↗</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ),
        type: 'text'
      }
    ];
  }

  function getStatusOutput(): OutputLine[] {
    if (!githubData && !isLoadingGithub) {
      // Trigger GitHub API fetch
      fetchGithubData();
    }

    return [
      {
        content: <GitHubStatus data={githubData} loading={isLoadingGithub} />,
        type: 'text'
      }
    ];
  }

  async function fetchGithubData() {
    if (isLoadingGithub || githubData) return;
    
    setIsLoadingGithub(true);
    try {
      const username = config.content.social.github;
      const [profileRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/events/public?per_page=10`)
      ]);
      
      const profile = await profileRes.json();
      const events = await eventsRes.json();
      
      setGithubData({ profile, events });
    } catch (error) {
      console.error('GitHub API error:', error);
      setGithubData({ 
        profile: { login: 'Satyamand536', public_repos: 0, followers: 0, bio: 'Web Developer' },
        events: [] 
      });
    } finally {
      setIsLoadingGithub(false);
    }
  }

  function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  function getContactOutput(): OutputLine[] {
    return [
      { content: <BoxedHeader title="CONTACT" />, type: 'text' },
      { content: '', type: 'text' },
      { content: 'Always open to new opportunities and collaborations.', type: 'text' },
      { content: 'Feel free to reach out via email or social media.', type: 'text' },
      { content: '', type: 'text' },
      {
        content: (
          <div className="social-grid">
            {Object.entries(config.content.social).map(([platform, value]) => (
              <SocialLink key={platform} platform={platform} value={value} />
            ))}
          </div>
        ),
        type: 'link',
      },
    ];
  }

  function getErrorOutput(cmd: string): OutputLine[] {
    return [
      { content: `Command not found: ${cmd}`, type: 'error' },
      { content: 'Type \'help\' to see available commands.', type: 'text' },
    ];
  }

  function executeCommand(cmd: string) {
    const fullCmd = cmd.trim();
    const parts = fullCmd.split(' ');
    const trimmedCmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    let output: OutputLine[] = [];
    
    // Role Switching logic
    if (trimmedCmd === 'role') {
      const targetRole = args[0] as Role;
      if (['visitor', 'recruiter'].includes(targetRole)) {
        setRole(targetRole);
        output = [{ content: `Session evolved to [${targetRole.toUpperCase()}] status.`, type: 'text' }];
      } else {
        output = [{ content: 'Invalid role. Valid roles: [visitor, recruiter]', type: 'error' }];
      }
    } else {
      switch (trimmedCmd) {
        case 'help':
          output = getHelpOutput();
          break;
        case 'banner':
          output = getBannerOutput();
          break;
        case 'about':
          output = getAboutOutput();
          break;
        case 'projects':
          output = getProjectsOutput();
          break;
        case 'contact':
          output = getContactOutput();
          break;
        case 'neofetch':
          output = getNeofetchOutput();
          break;
        case 'timeline':
          output = getTimelineOutput();
          break;
        case 'status':
          output = getStatusOutput();
          break;
        case 'quick':
          output = getQuickOutput();
          break;
        case 'focus':
          output = getFocusOutput();
          break;
        case 'resume':
          output = [{ content: 'Opening resume.pdf...', type: 'text' }];
          if (typeof window !== 'undefined') window.open('/resume.pdf', '_blank');
          break;
        case 'theme':
          if (args[0] && ['matrix', 'bloomberg', 'amber'].includes(args[0])) {
            setTheme(args[0] as Theme);
            output = [{ content: `Theme set to ${args[0].toUpperCase()}`, type: 'text' }];
          } else {
            output = [{ content: 'Available themes: matrix, bloomberg, amber', type: 'text' }];
          }
          break;
        case 'whoami':
          output = [
            { content: <UserProfileAscii />, type: 'text' },
            { content: `Current User: ${config.identity.username}`, type: 'text' },
            { content: `Active Mode: ${role.toUpperCase()}`, type: 'text' },
            { content: `Theme: ${theme.toUpperCase()}`, type: 'text' },
            { content: `Session: Active`, type: 'text' }
          ];
          break;
        case 'ask':
          if (args.length === 0) {
            output = [
              { content: '🤖 AI Assistant - How to use:', type: 'text' },
              { content: '', type: 'text' },
              { content: 'Usage: ask [your question]', type: 'text' },
              { content: '', type: 'text' },
              { content: 'Try asking about:', type: 'text' },
              { content: '  • Experience & background', type: 'text' },
              { content: '  • Tech stack & skills', type: 'text' },
              { content: '  • Hiring availability', type: 'text' },
              { content: '  • Specific technologies (React, Node, etc.)', type: 'text' },
              { content: '  • Projects & portfolio', type: 'text' },
              { content: '  • How to contact', type: 'text' }
            ];
          } else {
            const query = args.join(' ').toLowerCase();
            let response = "";
            let suggestedCommand = "";
            
            // Hiring & Availability
            if (query.includes('hire') || query.includes('hiring') || query.includes('available') || query.includes('job') || query.includes('work')) {
              response = "✅ Satyam is currently OPEN to full-stack opportunities! He's looking for remote or global positions.";
              suggestedCommand = "Try: 'contact' to reach out directly";
            }
            // Tech Stack
            else if (query.includes('tech') || query.includes('stack') || query.includes('technologies') || query.includes('skills') || query.includes('know')) {
              response = "💻 Satyam specializes in the MERN stack (MongoDB, Express, React, Node.js) + Next.js and TypeScript.";
              suggestedCommand = "Try: 'neofetch' for full system info";
            }
            // Experience
            else if (query.includes('experience') || query.includes('work') || query.includes('background') || query.includes('career')) {
              response = "📚 Satyam has built several production-grade web applications with focus on scalable architecture and modern UX.";
              suggestedCommand = "Try: 'timeline' for career journey or 'focus' for project deep-dives";
            }
            // React
            else if (query.includes('react')) {
              response = "⚛️ React is Satyam's primary frontend library. Used in BlogYam, Preseejan, LinkSafe, Pokédex, and this terminal portfolio!";
              suggestedCommand = "Try: 'projects' to see React projects";
            }
            // Node.js
            else if (query.includes('node') || query.includes('backend') || query.includes('server')) {
              response = "🟢 Satyam is proficient in Node.js and Express for backend development, with experience in REST APIs and database integration.";
              suggestedCommand = "Try: 'focus' to see backend architectures";
            }
            // Projects
            else if (query.includes('project') || query.includes('portfolio') || query.includes('built') || query.includes('made')) {
              response = "🚀 Satyam has built 4 production-grade apps — BlogYam (AI-Powered Blog), Preseejan (Precision Watch Ecommerce), LinkSafe (Security-First URL Shortener SaaS with analytics, QR codes & HttpOnly JWT auth), and Pokédex.";
              suggestedCommand = "Try: 'projects' or 'focus' for detailed breakdowns";
            }
            // Contact
            else if (query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('message')) {
              response = "📧 Best way to reach Satyam: satyamand536@gmail.com";
              suggestedCommand = "Try: 'contact' for all social links";
            }
            // TypeScript
            else if (query.includes('typescript') || query.includes('type')) {
              response = "📘 Satyam uses TypeScript for type safety and better developer experience, especially in larger React projects.";
            }
            // Next.js
            else if (query.includes('next')) {
              response = "▲ Next.js is Satyam's go-to framework for production React apps. This terminal portfolio is built with Next.js!";
            }
            // MongoDB/Database
            else if (query.includes('mongo') || query.includes('database') || query.includes('data')) {
              response = "🍃 Satyam works with MongoDB for NoSQL databases and has experience with data modeling and queries.";
            }
            // GitHub/Git
            else if (query.includes('github') || query.includes('git') || query.includes('code')) {
              response = "🐙 Check out Satyam's GitHub: github.com/Satyamand536";
              suggestedCommand = "Try: 'status' for live GitHub activity";
            }
            // General fallback with suggestions
            else {
              response = "🤔 I'm not sure about that. I can help with: experience, tech stack, hiring, projects, or specific technologies.";
              suggestedCommand = "Try: 'ask about your tech stack' or 'ask are you hiring'";
            }
            
            output = [
              { content: `[AI]: ${response}`, type: 'text' }
            ];
            
            if (suggestedCommand) {
              output.push(
                { content: '', type: 'text' },
                { content: `💡 ${suggestedCommand}`, type: 'text' }
              );
            }
          }
          break;
        case 'joke':
          const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
          output = [
            { content: '😄 Random Dev Joke:', type: 'text' },
            { content: '', type: 'text' },
            { content: randomJoke, type: 'text' }
          ];
          break;
        case 'quote':
          const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
          output = [
            { content: '💡 Motivational Quote:', type: 'text' },
            { content: '', type: 'text' },
            { content: randomQuote, type: 'text' }
          ];
          break;
        case 'coffee':
          output = [
            { content: <CoffeeArt />, type: 'text' }
          ];
          break;
        case 'matrix':
          setShowMatrixRain(true);
          setTimeout(() => setShowMatrixRain(false), 5000);
          output = [
            { content: '>> INITIALIZING MATRIX PROTOCOL...', type: 'text' },
            { content: 'Wake up, Neo...', type: 'text' },
            { content: 'The Matrix has you...', type: 'text' },
            { content: '', type: 'text' },
            { content: '(Watch the screen for 5 seconds)', type: 'text' }
          ];
          break;
        case 'hack':
        case 'hacking':
          output = [
            { content: '>> INITIATING HACKING SEQUENCE...', type: 'text' },
            { content: 'Bypassing firewall... [████████████] 100%', type: 'text' },
            { content: 'Decrypting mainframe... [████████████] 100%', type: 'text' },
            { content: 'Accessing database... [████████████] 100%', type: 'text' },
            { content: 'Downloading files... [████████████] 100%', type: 'text' },
            { content: '', type: 'text' },
            { content: '✓ HACK COMPLETE', type: 'text' },
            { content: '', type: 'text' },
            { content: 'Just kidding! This is just a portfolio 😄', type: 'text' }
          ];
          break;
        case 'sudo':
          const sudoCmd = args.join(' ');
          output = [
            { content: `[sudo] password for ${config.identity.username}:`, type: 'text' },
            { content: '', type: 'text' },
            { content: 'sudo: you are not in the sudoers file. This incident will be reported.', type: 'error' },
            { content: '', type: 'text' },
            { content: '(To the department of awesome portfolios 😎)', type: 'text' }
          ];
          break;
        case '':
          output = [];
          break;
        default:
          // Natural language detection for portfolio questions
          const fullInput = fullCmd.toLowerCase();
          const portfolioKeywords = ['experience', 'work', 'project', 'skill', 'tech', 'stack', 'hire', 'hiring', 'available', 'resume', 'contact', 'email', 'react', 'node', 'javascript', 'typescript', 'next', 'github', 'portfolio', 'background', 'about', 'who'];
          
          const isPortfolioQuestion = portfolioKeywords.some(keyword => fullInput.includes(keyword)) && 
            (fullInput.includes('?') || fullInput.includes('what') || fullInput.includes('how') || fullInput.includes('where') || fullInput.includes('tell') || fullInput.includes('show'));
          
          if (isPortfolioQuestion) {
            // Route to AI assistant
            const query = fullInput;
            let response = "";
            let suggestedCommand = "";
            
            if (query.includes('hire') || query.includes('hiring') || query.includes('available') || query.includes('job')) {
              response = "✅ Satyam is currently OPEN to full-stack opportunities! He's looking for remote or global positions.";
              suggestedCommand = "Try: 'contact' to reach out directly";
            } else if (query.includes('tech') || query.includes('stack') || query.includes('skill')) {
              response = "💻 Satyam specializes in the MERN stack (MongoDB, Express, React, Node.js) + Next.js and TypeScript.";
              suggestedCommand = "Try: 'neofetch' for full system info";
            } else if (query.includes('experience') || query.includes('work') || query.includes('background')) {
              response = "📚 Satyam has built several production-grade web applications with focus on scalable architecture and modern UX.";
              suggestedCommand = "Try: 'timeline' for career journey or 'focus' for project deep-dives";
            } else if (query.includes('project')) {
              response = "🚀 Satyam has built 4 production-grade apps — BlogYam (AI-Powered Blog), Preseejan (Precision Watch Ecommerce), LinkSafe (Security-First URL Shortener SaaS with analytics, QR codes & HttpOnly JWT auth), and Pokédex.";
              suggestedCommand = "Try: 'projects' or 'focus' for detailed breakdowns";
              
              // Add project links if specifically asked
              if (query.includes('link') || query.includes('url') || query.includes('github') || query.includes('demo') || query.includes('show')) {
                output = [
                  { content: '[AI]: 🚀 Here are Satyam\'s projects with links:', type: 'text' },
                  { content: '', type: 'text' }
                ];
                config.content.projects.forEach(p => {
                  output.push(
                    { content: `▸ ${p.name.toUpperCase()}`, type: 'text' },
                    { content: `  ${p.tagline}`, type: 'text' },
                    { content: `  🎯 PROBLEM: ${p.problem}`, type: 'text' },
                    { content: `  💡 APPROACH: ${p.approach}`, type: 'text' },
                    { content: `  🔗 GitHub: ${p.github}`, type: 'link' },
                    { content: `  🌐 Demo: ${p.demo}`, type: 'link' },
                    { content: '', type: 'text' }
                  );
                });
                output.push({ content: '💡 Try: \'focus\' for technical deep-dives', type: 'text' });
                break; // Skip the default response
              }
            } else if (query.includes('contact') || query.includes('email') || query.includes('reach')) {
              response = "📧 Best way to reach Satyam: satyamand536@gmail.com";
              suggestedCommand = "Try: 'contact' for all social links";
            } else if (query.includes('react')) {
              response = "⚛️ React is Satyam's primary frontend library, used in all major projects.";
            } else if (query.includes('github')) {
              response = "🐙 Check Satyam's GitHub: github.com/Satyamand536";
              suggestedCommand = "Try: 'status' for live GitHub activity";
              
              if (query.includes('link') || query.includes('project')) {
                output = [
                  { content: '[AI]: 🐙 Satyam\'s GitHub Profile & Projects:', type: 'text' },
                  { content: '', type: 'text' },
                  { content: '📌 Profile: https://github.com/Satyamand536', type: 'link' },
                  { content: '', type: 'text' },
                  { content: 'Project Repositories:', type: 'text' }
                ];
                config.content.projects.forEach(p => {
                  output.push({ content: `  • ${p.name}: ${p.github}`, type: 'link' });
                });
                output.push(
                  { content: '', type: 'text' },
                  { content: '💡 Try: \'status\' for live GitHub activity', type: 'text' }
                );
                // No break needed here as we are inside if block, but we need to stop further processing
                // We'll use a flag or return if this was a function, but in switch case, we just break form switch
              }
            } else {
              response = "🤔 I understand you're asking about Satyam's portfolio. Try 'help' to see available commands!";
            }
            
            if (!output.length) { // Only set output if it wasn't already set by the link handlers
                output = [{ content: `[AI]: ${response}`, type: 'text' }];
                if (suggestedCommand) {
                  output.push(
                    { content: '', type: 'text' },
                    { content: `💡 ${suggestedCommand}`, type: 'text' }
                  );
                }
            }
          } else {
            output = [
              { content: `Command not found: ${trimmedCmd}`, type: 'error' },
              { content: 'Type \'help\' to see available commands', type: 'text' }
            ];
          }
          break; // Break for case default (which handles natural language)
      }
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Tab auto-complete
    if (e.key === 'Tab') {
      e.preventDefault();
      const matches = currentCommands.filter((cmd) => cmd.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      }
      return;
    }

    // Enter to execute
    if (e.key === 'Enter') {
      executeCommand(input);
      setHistoryIndex(-1);
      setDraftInput('');
      setInput('');
      return;
    }

    // Escape or Cmd+C to clear input
    if (e.key === 'Escape' || (e.key === 'c' && e.metaKey)) {
      e.preventDefault();
      setInput('');
      return;
    }

    // Arrow up - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commandHistory = history.filter((h) => h.command).map((h) => h.command);
      if (commandHistory.length === 0) return;
      
      if (historyIndex === -1) {
        setDraftInput(input);
      }
      
      const newIndex = historyIndex + 1;
      if (newIndex < commandHistory.length) {
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
      return;
    }

    // Arrow down - next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const commandHistory = history.filter((h) => h.command).map((h) => h.command);
      
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput(draftInput);
      }
      return;
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="terminal-wrapper" ref={terminalRef} onClick={focusInput}>
      {/* Header Bar */}
      <header className="terminal-header">
        <div className="header-left">
          <div className="window-controls">
            <span className="control close" onClick={() => toggleTheme('bloomberg')} title="Bloomberg Red"></span>
            <span className="control minimize" onClick={() => toggleTheme('amber')} title="Amber Theme"></span>
            <span className="control maximize" onClick={() => toggleTheme('matrix')} title="Matrix Green"></span>
          </div>
          <div className="header-title">
            <span className="title-primary">SATYAM TIWARI</span>
            <span className="title-divider">│</span>
            <span className="title-secondary">TERMINAL v1.1 [INTEL]</span>
          </div>
        </div>
        <div className="header-center">
          <div className="status-indicators">
            <span className="status-dot active"></span>
            <span className="status-text">{role === 'visitor' ? 'VISITOR MODE' : 'RECRUITER ACCESS'}</span>
            <span className="status-divider">│</span>
            <span className="status-text">{theme.toUpperCase()} CORE</span>
          </div>
        </div>
        <div className="header-right">
          <span className="header-time">{isMounted ? formatTime(currentTime) : '--:--:--'}</span>
          <span className="header-date">{isMounted ? formatDate(currentTime) : '--- --, ----'}</span>
        </div>
      </header>

      {/* Main Terminal Area */}
       <main className="terminal-main">
        {/* Mobile Sidebar Toggle */}
        <button 
          className="mobile-sidebar-toggle" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            position: 'absolute',
            bottom: '100px',
            right: '25px',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: 'var(--p-primary)',
            color: 'var(--p-bg)',
            border: 'none',
            zIndex: 100,
            display: 'none', // Managed by responsive CSS
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            boxShadow: '0 0 15px var(--p-primary)'
          }}
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>

        {/* Side Panel - Stats */}
        <aside className={`terminal-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-section">
            <div className="sidebar-header">SYSTEM</div>
            <div className="sidebar-content">
              <div className="stat-row">
                <span className="stat-label">UPTIME</span>
                <span className="stat-value blink">●</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">SHELL</span>
                <span className="stat-value">ZSH</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">NODE</span>
                <span className="stat-value">v20.x</span>
              </div>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{role === 'visitor' ? 'VISITOR CMDS' : 'RECRUITER CMDS'}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setRole(role === 'visitor' ? 'recruiter' : 'visitor');
                }}
                className="role-toggle-btn"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--p-primary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '0 4px',
                  lineHeight: 1
                }}
                title={role === 'visitor' ? 'Switch to Recruiter Mode' : 'Switch to Visitor Mode'}
              >
                ⇄
              </button>
            </div>
            <div className="sidebar-content">
              {currentCommands.filter(c => !['clear', 'help', 'banner', 'about'].includes(c)).map((cmd) => (
                <button
                  key={cmd}
                  className="quick-cmd"
                  onClick={(e) => {
                    e.stopPropagation();
                    executeCommand(cmd);
                  }}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-header">LINKS</div>
          <div className="sidebar-content links">
              <a href={`https://github.com/${config.content.social.github}`} target="_blank" rel="noopener noreferrer">
                ◈ GitHub
              </a>
              <a href={`https://linkedin.com/in/${config.content.social.linkedin}`} target="_blank" rel="noopener noreferrer">
                ◈ LinkedIn
              </a>
              <a href={`/${config.content.social.resume}`} target="_blank" rel="noopener noreferrer">
                ◈ Resume
              </a>
            </div>
          </div>
        </aside>

        {/* Terminal Output */}
        <div className="terminal-output-wrapper">
          <div className="output-header">
            <span>OUTPUT</span>
            <span className="output-scroll-indicator">↓ SCROLL</span>
          </div>
          <div className="terminal-output" ref={outputRef} aria-label="Terminal output">
            {history.map((entry, entryIndex) => (
              <div key={entryIndex} className="history-entry">
                {entry.command && (
                  <div className="command-line">
                    <span className="prompt">
                      <span className="prompt-user">{config.identity.username}</span>
                      <span className="prompt-at">@</span>
                      <span className="prompt-host">{config.identity.hostname}</span>
                      <span className="prompt-symbol"> $ </span>
                    </span>
                    <span className="command-text">{entry.command}</span>
                  </div>
                )}
                <div className="output-lines">
                  {entry.output.map((line, lineIndex) => (
                    <div
                      key={lineIndex}
                      className={`output-line ${line.type} typewriter`}
                      style={{ animationDelay: `${(line.delay || lineIndex * 40)}ms` }}
                    >
                      {line.content}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="terminal-input-area">
            <div className="input-line">
              <label className="prompt" aria-label="Command prompt">
                <span className="prompt-user">{config.identity.username}</span>
                <span className="prompt-at">@</span>
                <span className="prompt-host">{config.identity.hostname}</span>
                <span className="prompt-symbol"> $ </span>
              </label>
              <div className="input-wrapper">
                <input
                  ref={inputRef}
                  type="text"
                  className="terminal-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                />
                <span className={`cursor ${showCursor ? 'visible' : ''}`}>█</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="terminal-footer">
        <div className="footer-left">
          <span className="footer-hint">TAB</span> <span className="footer-hint-text">autocomplete</span>
          <span className="footer-divider">│</span>
          <span className="footer-hint">↑↓</span> <span className="footer-hint-text">history</span>
          <span className="footer-divider">│</span>
          <span className="footer-hint">ESC</span> <span className="footer-hint-text">clear</span>
        </div>
        <div className="footer-right">
          <span className="footer-status">● READY</span>
        </div>
      </footer>
    </div>
  );
}
