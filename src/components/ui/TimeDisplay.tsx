'use client';

import { useState, useEffect } from 'react';

import { constant } from '~/lib/constant';

export const TimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState<{
    day: string;
    time: string;
  }>({ day: '[ day ]', time: '[ time ]' });

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
    <div className="font-display flex flex-col items-end text-xs md:flex-row md:items-center md:gap-1.5 md:text-sm">
      <span className="order-2 text-neutral-400 md:order-1">
        {currentDateTime.day}
      </span>
      <span className="text-accent order-1 md:order-2">
        {currentDateTime.time}
      </span>
    </div>
  );
};
