import { useEffect, useRef } from 'react';

type UseAutoLogoutOptions = {
  onLogout: () => void;
  timeout?: number; // in milliseconds
};

const useAutoLogout = ({
  onLogout,
  timeout = 20 * 60 * 1000,
}: UseAutoLogoutOptions): void => {
  // To store the timer id between renders without causing re-rendering
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      // Clear the existing logout timer if any
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Starts a new logout timer after inactivity timeout
      timerRef.current = setTimeout(() => {
        onLogout();
      }, timeout);
    };

    // List of common events on webpage
    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    const handleEvent = () => resetTimer();

    // restart the timer whenever the list of events happens. This means as long as the user interacts with the page, the logout timer keeps getting extended.
    events.forEach((event) => window.addEventListener(event, handleEvent));
    resetTimer(); // Start timer initially

    // Clean up function
    return () => {
      events.forEach((event) => window.removeEventListener(event, handleEvent));
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [onLogout, timeout]);
};

export default useAutoLogout;
