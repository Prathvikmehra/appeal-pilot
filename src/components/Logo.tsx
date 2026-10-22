import React from 'react';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 24 | 32 | 48;
  showWordmark?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
}

export const LogoMark: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Rounded geometry container in muted teal-600 */}
      <rect width="32" height="32" rx="7.5" fill="#0D9488" />

      {/* Action Checkmark Tick in lower-left launch trail */}
      <path
        d="M6 22.5L9.5 26L15.5 20"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Paper Plane: Main Left Wing */}
      <path
        d="M25.5 6.5L6.8 15.2C5.9 15.6 5.9 16.9 6.8 17.3L13.8 20.3L25.5 6.5Z"
        fill="#FFFFFF"
      />

      {/* Paper Plane: Right Wing Fold */}
      <path
        d="M25.5 6.5L13.8 20.3L16.8 25.4C17.2 26.2 18.4 26.2 18.8 25.3L25.5 6.5Z"
        fill="#99F6E4"
      />

      {/* Keel fold accent in deep teal-700 */}
      <path
        d="M13.8 20.3L16.2 24.1L17.5 21.5L13.8 20.3Z"
        fill="#0F766E"
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showWordmark = true,
  showBadge = false,
  badgeText = 'Health Advocacy',
  className = '',
}) => {
  const pixelSize = typeof size === 'number' ? size : size === 'sm' ? 24 : size === 'lg' ? 48 : 32;

  const textClasses =
    pixelSize <= 24
      ? 'text-base'
      : pixelSize >= 48
      ? 'text-2xl'
      : 'text-lg';

  const badgeSizeClasses =
    pixelSize <= 24
      ? 'text-[10px] px-1.5 py-0.2'
      : 'text-xs px-2 py-0.5';

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <LogoMark size={pixelSize} />

      {showWordmark && (
        <div className="flex items-center">
          <span className={`font-semibold tracking-tight text-slate-900 leading-none ${textClasses}`}>
            Appeal
          </span>
          <span className={`font-semibold tracking-tight text-teal-700 leading-none ml-1 ${textClasses}`}>
            Pilot
          </span>

          {showBadge && (
            <span
              className={`hidden sm:inline-block ml-2 font-medium text-teal-700 bg-teal-50 rounded-full border border-teal-200 whitespace-nowrap flex-shrink-0 ${badgeSizeClasses}`}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
