import { cx } from '~/lib/utils';

export const AudioWave = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <svg
      className={cx('h-7 w-7', isPlaying ? 'fill-amber-100' : 'fill-stone-500')}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26 38.05"
    >
      <path
        d="M0.91,15L0.78,15A1,1,0,0,0,0,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H0.91Z"
        className={cx(isPlaying ? 'animate-wave [animation-delay:0ms]' : '')}
      />
      <path
        d="M6.91,9L6.78,9A1,1,0,0,0,6,10V28a1,1,0,1,0,2,0s0,0,0,0V10A1,1,0,0,0,7,9H6.91Z"
        className={cx(isPlaying ? 'animate-wave [animation-delay:300ms]' : '')}
      />
      <path
        d="M12.91,0L12.78,0A1,1,0,0,0,12,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H12.91Z"
        className={cx(isPlaying ? 'animate-wave [animation-delay:600ms]' : '')}
      />
      <path
        d="M18.91,10l-0.12,0A1,1,0,0,0,18,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H18.91Z"
        className={cx(isPlaying ? 'animate-wave [animation-delay:900ms]' : '')}
      />
      <path
        d="M24.91,15l-0.12,0A1,1,0,0,0,24,16v6a1,1,0,0,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H24.91Z"
        className={cx(isPlaying ? 'animate-wave [animation-delay:1200ms]' : '')}
      />
    </svg>
  );
};
