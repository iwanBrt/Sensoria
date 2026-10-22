import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const A11yContext = createContext();

export const A11yProvider = ({ children }) => {
  // Load initial preferences from localStorage or defaults
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('sensoria_high_contrast') === 'true';
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('sensoria_font_size') || 'normal'; // 'normal' | 'large' | 'xlarge'
  });

  const [screenReaderAssist, setScreenReaderAssist] = useState(() => {
    return localStorage.getItem('sensoria_sr_assist') !== 'false'; // default on for inclusivity
  });

  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Synchronize High Contrast class with document root
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
      document.body.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('sensoria_high_contrast', highContrast.toString());
  }, [highContrast]);

  // Synchronize Root HTML Font Size so all Tailwind rem units scale immediately!
  useEffect(() => {
    document.documentElement.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-xlarge');
    document.documentElement.classList.add(`font-scale-${fontSize}`);

    let sizePercent = '100%';
    if (fontSize === 'large') sizePercent = '125%';
    if (fontSize === 'xlarge') sizePercent = '150%';

    document.documentElement.style.fontSize = sizePercent;
    localStorage.setItem('sensoria_font_size', fontSize);
  }, [fontSize]);

  // Save Screen Reader Assist preference
  useEffect(() => {
    localStorage.setItem('sensoria_sr_assist', screenReaderAssist.toString());
  }, [screenReaderAssist]);

  // Screen Reader Speech Vocalization via Web Speech API
  const speak = useCallback((text) => {
    if (!text) return;
    // Update live announcement for native screen readers
    setLiveAnnouncement(text);

    // If Screen Reader Assist is enabled and browser supports speech synthesis
    if (screenReaderAssist && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID'; // Indonesian speech
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [screenReaderAssist]);

  // Announce specifically for screen reader aria-live without voice if preferred
  const announce = useCallback((message) => {
    setLiveAnnouncement(message);
    if (screenReaderAssist) {
      speak(message);
    }
  }, [speak, screenReaderAssist]);

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      speak(next ? 'Mode Kontras Tinggi diaktifkan' : 'Mode Kontras Normal diaktifkan');
      return next;
    });
  };

  const increaseFontSize = () => {
    setFontSize((prev) => {
      let next = 'large';
      if (prev === 'normal') next = 'large';
      else if (prev === 'large') next = 'xlarge';
      else next = 'xlarge';
      speak(`Ukuran teks diperbesar ke tingkat ${next}`);
      return next;
    });
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => {
      let next = 'normal';
      if (prev === 'xlarge') next = 'large';
      else if (prev === 'large') next = 'normal';
      else next = 'normal';
      speak(`Ukuran teks diperkecil ke tingkat ${next}`);
      return next;
    });
  };

  const toggleScreenReaderAssist = () => {
    setScreenReaderAssist((prev) => {
      const next = !prev;
      speak(next ? 'Asisten Suara diaktifkan' : 'Asisten Suara dinonaktifkan');
      return next;
    });
  };

  return (
    <A11yContext.Provider
      value={{
        highContrast,
        fontSize,
        screenReaderAssist,
        liveAnnouncement,
        toggleHighContrast,
        increaseFontSize,
        decreaseFontSize,
        toggleScreenReaderAssist,
        speak,
        announce,
      }}
    >
      {/* Live Region for Screen Readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="a11y-live-region"
      >
        {liveAnnouncement}
      </div>
      {children}
    </A11yContext.Provider>
  );
};

export const useA11y = () => {
  const context = useContext(A11yContext);
  if (!context) {
    throw new Error('useA11y must be used within an A11yProvider');
  }
  return context;
};
