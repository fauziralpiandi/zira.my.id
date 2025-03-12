'use client';

import { useEffect, useState } from 'react';
import { constant } from '~/lib/constant';

const { locale } = constant;

export const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setCurrentDay(now.toLocaleString(locale, { weekday: 'long' }));
    setCurrentTime(
      now.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    );

    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-display flex flex-col items-end text-xs md:flex-row md:items-center md:gap-1.5 md:text-sm">
      <span className="order-2 text-neutral-400 md:order-1">
        {currentDay ?? 'currentDay'}
      </span>
      <span className="text-accent order-1 md:order-2">
        {currentTime ?? 'currentTime'}
      </span>
    </div>
  );
};
