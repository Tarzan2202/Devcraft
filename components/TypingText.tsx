'use client';

import React, { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  delay?: number;
}

export default function TypingText({ 
  text, 
  speed = 100, 
  className = "",
  onComplete,
  delay = 0
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsFinished(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete, started]);

  return (
    <span className={className}>
      {displayedText}
      {!isFinished && (
        <span className="inline-block w-[3px] h-[0.8em] ml-1 bg-indigo-500 animate-blink align-middle" />
      )}
    </span>
  );
}
