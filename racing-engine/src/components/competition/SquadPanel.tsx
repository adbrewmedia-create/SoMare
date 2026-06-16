'use client';

import { HorseCard, SkinConfig } from '@/types';

interface Props {
  picks: HorseCard[];
  skin: SkinConfig;
  onRemove: (card: HorseCard) => void;
  maxSize: number;
}

export function SquadPanel({ picks, skin, onRemove, maxSize }: Props) {
  const slots = Array.from({ length: maxSize });

  return (
    <div
      className="rounded-2xl p-5 h-fit sticky top-6"
      style={{
        background: skin.branding.primaryColor,
        border: `1px solid ${skin.branding.secondaryColor}33`,
        fontFamily: skin.branding.fontBody,
        color: skin.branding.textColor,
      }}
    >
      <h2
        className="text-lg font-bold mb-1"
        style={{ fontFamily: skin.branding.fontDisplay, color: skin.branding.secondaryColor }}
      >
        {skin.copy.squadLabel}
      </h2>
      <p className="text-xs opacity-50 mb-4">
        {picks.length}/{maxSize} picks · pick 2 per day max
      </p>

      <div className="space-y-2">
        {slots.map((_, i) => {
          const pick = picks[i];
          if (pick) {
            return (
              <div
                key={pick.horse.id}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
                style={{ background: `${skin.branding.secondaryColor}15` }}
              >
                <div>
                  <div className="font-semibold">{pick.horse.name}</div>
                  <div className="text-xs opacity-50">Day {pick.raceDay} · {pick.horse.oddsDisplay}</div>
                </div>
                <button
                  onClick={() => onRemove(pick)}
                  className="text-xs opacity-40 hover:opacity-100 transition-opacity ml-2"
                >
                  ✕
                </button>
              </div>
            );
          }
          return (
            <div
              key={i}
              className="rounded-lg px-3 py-3 text-xs opacity-20 border border-dashed text-center"
              style={{ borderColor: skin.branding.secondaryColor }}
            >
              Empty slot
            </div>
          );
        })}
      </div>

      {picks.length === maxSize && (
        <button
          className="w-full mt-5 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
          style={{ background: skin.branding.secondaryColor, color: '#0f0f1a' }}
        >
          Lock Squad & Compete
        </button>
      )}

      {/* Operator CTA */}
      <a
        href={skin.monetisation.operatorUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-4 text-center text-xs py-2 px-3 rounded-lg transition-opacity hover:opacity-80"
        style={{
          background: skin.branding.accentColor,
          color: '#fff',
        }}
      >
        {skin.monetisation.offerText}
      </a>
    </div>
  );
}
