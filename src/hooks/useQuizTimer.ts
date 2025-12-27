import { useState, useEffect, useCallback } from 'react';

interface UseQuizTimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
}

export function useQuizTimer({ initialTime, onTimeUp, isActive }: UseQuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialTime);
    setIsRunning(true);
  }, [initialTime]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setIsRunning(false);
      return;
    }
    setIsRunning(true);
  }, [isActive]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp]);

  const percentage = (timeLeft / initialTime) * 100;

  return {
    timeLeft,
    percentage,
    isRunning,
    resetTimer,
    pauseTimer,
    resumeTimer,
  };
}
