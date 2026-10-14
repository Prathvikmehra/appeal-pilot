import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Appeal Pilot — Turn Insurance Denials Into Action';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8FAFC',
          border: '16px solid #F1F5F9',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative corner accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            backgroundColor: '#0D9488',
          }}
        />

        {/* Category Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#CCFBF1',
            border: '1px solid #99F6E4',
            borderRadius: '9999px',
            padding: '8px 20px',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#0F766E',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Health Insurance Denial Advocate • Build With AI: Basics
          </span>
        </div>

        {/* Brand Lockup: Logo Mark + Wordmark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '28px',
          }}
        >
          {/* Logo Mark (72px) */}
          <svg
            width="72"
            height="72"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: '20px' }}
          >
            <rect width="32" height="32" rx="7.5" fill="#0D9488" />
            <path
              d="M6 22.5L9.5 26L15.5 20"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M25.5 6.5L6.8 15.2C5.9 15.6 5.9 16.9 6.8 17.3L13.8 20.3L25.5 6.5Z"
              fill="#FFFFFF"
            />
            <path
              d="M25.5 6.5L13.8 20.3L16.8 25.4C17.2 26.2 18.4 26.2 18.8 25.3L25.5 6.5Z"
              fill="#99F6E4"
            />
            <path
              d="M13.8 20.3L16.2 24.1L17.5 21.5L13.8 20.3Z"
              fill="#0F766E"
            />
          </svg>

          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span
              style={{
                fontSize: '64px',
                fontWeight: 700,
                color: '#0F172A',
                letterSpacing: '-0.03em',
              }}
            >
              Appeal
            </span>
            <span
              style={{
                fontSize: '64px',
                fontWeight: 700,
                color: '#0D9488',
                letterSpacing: '-0.03em',
                marginLeft: '12px',
              }}
            >
              Pilot
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: '32px',
            fontWeight: 600,
            color: '#334155',
            textAlign: 'center',
            maxWidth: '960px',
            lineHeight: 1.35,
            margin: '0 0 40px 0',
          }}
        >
          Turn a confusing denial letter into a plan you can act on today.
        </p>

        {/* Feature Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {[
            'Plain-English Breakdown',
            'Deterministic Deadline Math',
            'Formal Dispute Letter',
            'Calendar Reminders (.ics)',
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '12px',
                padding: '10px 18px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#475569',
              }}
            >
              <span style={{ color: '#0D9488', marginRight: '8px' }}>✓</span>
              {feature}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
