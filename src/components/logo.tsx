import type { SVGProps } from 'react';

type LogoProps = SVGProps<SVGSVGElement> & {
  animated?: boolean;
};

export function Logo({ animated = true, ...props }: LogoProps) {
  return (
    <svg
      width="1024"
      height="1024"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Jule Logo"
      role="img"
      {...props}
    >
      {animated ? (
        <style>{`
          .jule-logo__bg {
            transform-origin: 512px 512px;
            animation: jule-logo-bg 3600ms ease-in-out infinite;
          }

          .jule-logo__dot {
            transform-origin: 512px 288px;
            animation: jule-logo-dot 1200ms cubic-bezier(.2,.9,.25,1) infinite;
          }

          .jule-logo__face {
            transform-origin: 512px 618px;
            animation: jule-logo-face 1200ms cubic-bezier(.2,.9,.25,1) infinite;
          }

          @keyframes jule-logo-bg {
            0%, 100% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.01); filter: brightness(1.02); }
          }

          @keyframes jule-logo-dot {
            0%, 100% { transform: translateY(0) scaleX(1) scaleY(1); }
            35% { transform: translateY(-34px) scaleX(.98) scaleY(1.05); }
            55% { transform: translateY(0) scaleX(1.06) scaleY(.94); }
            70% { transform: translateY(-10px) scaleX(.99) scaleY(1.02); }
          }

          @keyframes jule-logo-face {
            0%, 100% { transform: translateY(0); }
            35% { transform: translateY(8px); }
            55% { transform: translateY(-2px); }
            70% { transform: translateY(3px); }
          }

          @media (prefers-reduced-motion: reduce) {
            .jule-logo__bg,
            .jule-logo__dot,
            .jule-logo__face {
              animation: none !important;
              filter: none !important;
            }
          }
        `}</style>
      ) : null}

      <rect
        className={animated ? 'jule-logo__bg' : undefined}
        width="1024"
        height="1024"
        rx="220"
        fill="#ff5500"
      />

      <g fill="#FFFFFF">
        <circle
          className={animated ? 'jule-logo__dot' : undefined}
          cx="512"
          cy="288"
          r="95"
        />
        <path
          className={animated ? 'jule-logo__face' : undefined}
          d="M285,512 L285,650 C285,830 739,830 739,650 L739,406 L598,406 L598,620 C598,700 425,700 425,620 L425,512 Z"
        >
          {animated ? (
            <animate
              attributeName="d"
              dur="1200ms"
              repeatCount="indefinite"
              values="
                M285,512 L285,650 C285,830 739,830 739,650 L739,406 L598,406 L598,620 C598,700 425,700 425,620 L425,512 Z;
                M285,512 L285,650 C285,852 739,852 739,650 L739,420 L598,420 L598,634 C598,732 425,732 425,634 L425,512 Z;
                M285,512 L285,650 C285,830 739,830 739,650 L739,406 L598,406 L598,620 C598,700 425,700 425,620 L425,512 Z
              "
            />
          ) : null}
        </path>
      </g>
    </svg>
  );
}
