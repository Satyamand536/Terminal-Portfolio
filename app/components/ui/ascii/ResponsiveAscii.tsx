import { useBreakpoint } from '../../../hooks/useBreakpoint';
import AsciiDesktop from './AsciiDesktop';
import AsciiTablet from './AsciiTablet';
import AsciiMobile from './AsciiMobile';

export default function ResponsiveAscii() {
  const breakpoint = useBreakpoint();

  switch (breakpoint) {
    case 'mobile':
      return <AsciiMobile />;
    case 'tablet':
      return <AsciiTablet />;
    case 'desktop':
    default:
      return <AsciiDesktop />;
  }
}
