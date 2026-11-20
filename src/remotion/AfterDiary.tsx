// DISALIN dari ubnetwork/app/productivity/afterproduksi/VideoDiaryModal.tsx (komposisi saja). Jaga tetap sama.

import React, { useMemo } from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DiaryTaskItem {
  job?: string;
  job_name: string;
  petugas?: string[];
  assigned_members?: string;
  status: string;
}

export interface VideoDiaryData {
  date: string;
  shift: 'RED' | 'WHITE';
  jamPulang: string;
  tasks: DiaryTaskItem[];
}

export const FPS = 30;
export const W = 720;
export const H = 1280;
export const INTRO_FRAMES = 75; // 2.5s
export const PAGE_FRAMES = 90; // 3.0s per page (max 4 jobs/page)
export const OUTRO_FRAMES = 75; // 2.5s
export const JOBS_PER_PAGE = 4;

function getEmoji(name: string): string {
  const n = (name || '').toLowerCase();
  if (n.includes('sampah') || n.includes('5r') || n.includes('5s')) return '🧹';
  if (n.includes('galon') || n.includes('air') || n.includes('dispenser')) return '💧';
  if (n.includes('tamu') || n.includes('guest')) return '🤝';
  if (n.includes('oasis') || n.includes('agv') || n.includes('jalur')) return '🛤️';
  if (n.includes('gun') || n.includes('jig') || n.includes('tpm')) return '🔧';
  if (n.includes('kaizen') || n.includes('robot') || n.includes('pit')) return '🤖';
  if (n.includes('standby') || n.includes('extra')) return '⚡';
  return '📋';
}

function formatTanggalId(dateStr: string): string {
  try {
    return new Date(`${dateStr}T12:00:00`).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function IntroScene({ data }: { data: VideoDiaryData }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const slideUp = interpolate(pop, [0, 1], [40, 0]);
  const isRed = data.shift === 'RED';

  const filled = data.tasks.filter((t) => !(t.status || '').includes('Off')).length;
  const totalMp = data.tasks.reduce((n, t) => n + (Array.isArray(t.petugas) ? t.petugas.length : 0), 0);

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 20% 15%, #0e7490 0%, #020617 55%, #0f172a 100%)',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: 48,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          transform: `translateY(${slideUp}px) scale(${0.92 + pop * 0.08})`,
          opacity: pop,
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 50px rgba(6,182,212,0.45)',
            border: '3px solid rgba(255,255,255,0.35)',
          }}
        >
          <span style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, color: '#020617' }}>UB</span>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#020617' }}>NETWORK</span>
        </div>

        <div
          style={{
            padding: '8px 20px',
            borderRadius: 999,
            background: isRed ? 'rgba(239,68,68,0.2)' : 'rgba(226,232,240,0.16)',
            border: `1.5px solid ${isRed ? 'rgba(248,113,113,0.5)' : 'rgba(226,232,240,0.4)'}`,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 1.5,
          }}
        >
          {isRed ? '🔴 SHIFT RED' : '⚪ SHIFT WHITE'}
        </div>

        <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.15, letterSpacing: -0.5 }}>
          DIARY AFTER PRODUKSI
        </div>

        <div style={{ fontSize: 26, color: '#67e8f9', fontWeight: 700 }}>
          {formatTanggalId(data.date)}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            width: '100%',
            marginTop: 16,
          }}
        >
          {[
            ['JOB TERISI', `${filled}/${data.tasks.length}`],
            ['PETUGAS', `${totalMp} MP`],
            ['TARGET', `${data.jamPulang} WIB`],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                flex: 1,
                background: 'rgba(15,23,42,0.8)',
                border: '1px solid rgba(56,189,248,0.3)',
                borderRadius: 20,
                padding: '18px 12px',
              }}
            >
              <div style={{ fontSize: 14, color: '#94a3b8', fontWeight: 700 }}>{k}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function JobsPageScene({
  data,
  items,
  pageIdx,
  totalPages,
}: {
  data: VideoDiaryData;
  items: DiaryTaskItem[];
  pageIdx: number;
  totalPages: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #020617 0%, #0f172a 60%, #082f49 100%)',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '44px 36px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 18,
          borderBottom: '1px solid rgba(148,163,184,0.2)',
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#22d3ee', letterSpacing: 1.5 }}>
            UNDERBODY ASSY • SHIFT {data.shift}
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 2 }}>{formatTanggalId(data.date)}</div>
        </div>
        <div
          style={{
            background: 'rgba(34,211,238,0.15)',
            border: '1px solid rgba(34,211,238,0.35)',
            borderRadius: 14,
            padding: '8px 14px',
            fontSize: 18,
            fontWeight: 800,
            color: '#67e8f9',
          }}
        >
          {pageIdx + 1} / {totalPages}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
        {items.map((item, idx) => {
          const sp = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 15, stiffness: 130 },
          });
          const isOff = (item.status || '').includes('Off');
          const isSisa = item.status === 'Sisa MP';
          const names =
            Array.isArray(item.petugas) && item.petugas.length > 0
              ? item.petugas.join(' · ')
              : item.assigned_members || (isOff ? 'OFF (Kekurangan MP)' : '-');

          return (
            <div
              key={idx}
              style={{
                transform: `translateX(${interpolate(sp, [0, 1], [60, 0])}px)`,
                opacity: sp,
                background: isOff ? 'rgba(127,29,29,0.32)' : 'rgba(15,23,42,0.88)',
                border: `1.5px solid ${isOff ? 'rgba(248,113,113,0.45)' : isSisa ? 'rgba(251,191,36,0.45)' : 'rgba(56,189,248,0.3)'}`,
                borderRadius: 22,
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <span style={{ fontSize: 30 }}>{getEmoji(item.job || item.job_name)}</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: isOff ? '#fca5a5' : '#e0f2fe' }}>
                    {item.job_name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    padding: '5px 12px',
                    borderRadius: 999,
                    background: isOff ? 'rgba(239,68,68,0.2)' : isSisa ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
                    color: isOff ? '#fca5a5' : isSisa ? '#fde68a' : '#6ee7b7',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.status}
                </span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#cbd5e1', lineHeight: 1.35 }}>
                👷 {names}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', fontSize: 16, color: '#64748b', fontWeight: 700, paddingTop: 12 }}>
        Target Selesai: {data.jamPulang} WIB • UBNETWORK
      </div>
    </AbsoluteFill>
  );
}

function OutroScene({ data }: { data: VideoDiaryData }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 80% 80%, #065f46 0%, #020617 65%)',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 48,
        textAlign: 'center',
      }}
    >
      <div style={{ opacity: pop, transform: `scale(${0.92 + pop * 0.08})`, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <div style={{ fontSize: 52 }}>✅</div>
        <div style={{ fontSize: 38, fontWeight: 900, color: '#6ee7b7' }}>TERIMA KASIH</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#e2e8f0' }}>
          5R &amp; Safety First · Shift {data.shift}
        </div>
        <div style={{ fontSize: 18, color: '#94a3b8', marginTop: 8 }}>
          Underbody Assembly Plant #1 • PT TMMIN
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function AfterProductionDiaryComposition({ data }: { data: VideoDiaryData }) {
  const pages = useMemo(() => {
    const chunks: DiaryTaskItem[][] = [];
    for (let i = 0; i < data.tasks.length; i += JOBS_PER_PAGE) {
      chunks.push(data.tasks.slice(i, i + JOBS_PER_PAGE));
    }
    return chunks.length > 0 ? chunks : [[]];
  }, [data.tasks]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Sequence from={0} durationInFrames={INTRO_FRAMES}>
        <IntroScene data={data} />
      </Sequence>
      {pages.map((items, idx) => (
        <Sequence key={idx} from={INTRO_FRAMES + idx * PAGE_FRAMES} durationInFrames={PAGE_FRAMES}>
          <JobsPageScene data={data} items={items} pageIdx={idx} totalPages={pages.length} />
        </Sequence>
      ))}
      <Sequence from={INTRO_FRAMES + pages.length * PAGE_FRAMES} durationInFrames={OUTRO_FRAMES}>
        <OutroScene data={data} />
      </Sequence>
    </AbsoluteFill>
  );
}

export function diaryDurationInFrames(taskCount: number): number {
  const pages = Math.max(1, Math.ceil(taskCount / JOBS_PER_PAGE));
  return INTRO_FRAMES + pages * PAGE_FRAMES + OUTRO_FRAMES;
}

