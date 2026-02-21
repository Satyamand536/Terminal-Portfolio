export default function AsciiTablet() {
  const ascii = [
    "  ___    __   ____  _  _   __    __  __ ",
    " / __)  /__\\ (_  _)( \\/ ) /__\\  (  \\/  )",
    " \\__ \\ /(__)\\  )(   )  / /(__)\\  )    ( ",
    " (___/(__)(__)(__) (__/ (__)(__)(_/\\/\\_)",
    "                                        ",
    "  ____   __   _  _  _   __    ____   __ ",
    " (_  _) (  ) ( \\/ \\/ ) /__\\  (  _ \\ (  )",
    "   )(    )(   \\  /\\  / /(__)\\  )   /  )( ",
    "  (__)  (__)   \\/  \\/ (__)(__)(_ \\_) (__)"
  ];

  return (
    <div style={{ 
      whiteSpace: 'pre', 
      lineHeight: '1.1', 
      fontVariantLigatures: 'none', 
      overflowX: 'hidden', 
      textAlign: 'center',
      fontWeight: 'bold', 
      color: 'var(--p-primary)',
      fontSize: 'clamp(10px, 1.8vw, 14px)'
    }}>
      {ascii.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
