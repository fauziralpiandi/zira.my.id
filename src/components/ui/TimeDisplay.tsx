'use client';

import { useState, useEffect } from 'react';
import { constant } from '~/lib/constant';

export const TimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState<{
    day: string;
    time: string;
  }>({ day: '.....', time: '...' });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedDay = now.toLocaleString(constant.locale, {
        weekday: 'long',
      });
      const formattedTime = now.toLocaleString(constant.locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      setCurrentDateTime({ day: formattedDay, time: formattedTime });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-end font-display text-xs md:flex-row md:items-center md:gap-1.5">
      <span className="text-amber-100">{currentDateTime.time}</span>
      <span className="text-stone-300">{currentDateTime.day}</span>
    </div>
  );
};
