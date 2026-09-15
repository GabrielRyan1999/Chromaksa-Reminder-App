import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Reminder App | Minimalist Planner';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: 80,
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.05em' }}>
            Reminder App
          </div>
        </div>
        <div style={{ fontSize: 48, color: '#8A8F98', lineHeight: 1.4, maxWidth: '80%' }}>
          Bring your daily notes, calendars, and to-do lists into one beautifully simple workspace.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}