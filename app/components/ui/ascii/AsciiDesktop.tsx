export default function AsciiDesktop() {
  const ascii = [
    " ____    _  _____ __   __    _    __  __        _____  ___ __        __   _    ____   ___ ",
    "/ ___|  / \\|_   _\\\\ \\ / /   / \\  |  \\/  |      |_   _||_ _|\\ \\      / /  / \\  |  _ \\ |_ _|",
    "\\___ \\ / _ \\ | |   \\ V /   / _ \\ | |\\/| |        | |   | |  \\ \\ /\\ / /  / _ \\ | |_) | | | ",
    " ___) / ___ \\| |    | |   / ___ \\| |  | |        | |   | |   \\ V  V /  / ___ \\|  _ <  | | ",
    "|____/_/   \\_\\_|    |_|  /_/   \\_\\_|  |_|        |_|  |___|   \\_/\\_/  /_/   \\_\\_| \\_\\|___|"
  ];

  return (
    <div style={{ whiteSpace: 'pre', overflowX: 'hidden', lineHeight: '1.2', fontWeight: 'bold', color: 'var(--p-primary)' }}>
      {ascii.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
