import React, { createContext, useContext, useState, useCallback } from 'react';

const A11yContext = createContext();

export const A11yProvider = ({ children }) => {
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Announce accessible messages (for screen reader live regions & braille displays)
  const announce = useCallback((message) => {
    if (!message) return;
    setLiveAnnouncement(message);
  }, []);

  // Backward compatibility alias
  const speak = useCallback((message) => {
    announce(message);
  }, [announce]);

  return (
    <A11yContext.Provider
      value={{
        highContrast: false,
        liveAnnouncement,
        announce,
        speak,
      }}
    >
      {/* Live Region for Screen Readers / Accessibility devices */}
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

