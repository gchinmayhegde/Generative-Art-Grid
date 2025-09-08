// src/hooks/useAnimationLoop.js
import { useState, useEffect, useRef } from 'react';

export function useAnimationLoop(isPlaying = true, speed = 1.0) {
  const [time, setTime] = useState(0);
  const startTimeRef = useRef(performance.now());
  const pausedTimeRef = useRef(0);
  const animationIdRef = useRef();

  useEffect(() => {
    if (!isPlaying) {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }

    function updateTime() {
      const now = performance.now();
      const elapsed = (now - startTimeRef.current - pausedTimeRef.current) / 1000;
      setTime(elapsed * speed);
      animationIdRef.current = requestAnimationFrame(updateTime);
    }

    updateTime();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isPlaying, speed]);

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = performance.now();
      pausedTimeRef.current = 0;
    } else {
      pausedTimeRef.current = performance.now() - startTimeRef.current;
    }
  }, [isPlaying]);

  const reset = () => {
    startTimeRef.current = performance.now();
    pausedTimeRef.current = 0;
    setTime(0);
  };

  return { time, reset };
}