'use client';

import { HorseCard, SkinConfig } from '@/types';
import { rarityColor, rarityLabel } from '@/lib/scoring/cards';

interface Props {
  card: HorseCard;
  skin: SkinConfig;
  selected: boolean;
  onSelect: (card: HorseCard) => void;
  disabled?: boolean;
}

export function HorseCardComponent({ card, skin, selected, onSelect, disabled }: Props) {
  const { horse } = card;
  const rColor = rarityColor(horse.rarity);
  const rLabel = rarityLabel(horse.rarity);

  return (
    <button
      onClick={() => !disabled && onSelect(card)}
      disabled={disabled}
      style={{
        background: selected
          ? `linear-gradient(135deg, ${skin.branding.primaryColor}, ${skin.branding.secondaryColor}22)`
          : skin.branding.primaryColor,
        borderColor: selected ? skin.branding.secondaryColor : rColor,
        fontFamily: skin.branding.fontBody,
        color: skin.branding.textColor,
      }}
      className={`
        relative w-full text-left rounded-xl border-2 p-4 transition-all duration-200
        ${selected ? 'ring-2 ring-offset-1' : 'hover:scale-[1.02]'}
        ${disabled && !selected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Rarity badge */}
      <span
        className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ background: rColor, color: '#0f0f1a' }}
      >
        {rLabel}
      </span>

      {/* Horse number + name */}
      <div className="flex items-start gap-3 mb-3">
        <span
          className="text-2xl font-bold w-8 text-center shrink-0"
          style={{ color: skin.branding.secondaryColor }}
        >
          {horse.number}
        </span>
        <div>
          <div
            className="font-bold text-lg leading-tight"
            style={{ fontFamily: skin.branding.fontDisplay }}
          >
            {horse.name}
          </div>
          <div className="text-sm opacity-70 mt-0.5">
            {horse.jockey} · {horse.trainer}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4">
          <span>
            <span className="opacity-50 mr-1">Form</span>
            <span className="font-mono">{horse.form}</span>
          </span>
        </div>
        <span
          className="text-xl font-bold"
          style={{ color: skin.branding.secondaryColor }}
        >
          {horse.oddsDisplay}
        </span>
      </div>

      {/* Odds multiplier hint */}
      {horse.odds >= 10 && (
        <div
          className="mt-2 text-xs font-semibold"
          style={{ color: skin.branding.accentColor }}
        >
          ★ 2× points multiplier
        </div>
      )}
      {horse.odds >= 4 && horse.odds < 10 && (
        <div className="mt-2 text-xs font-semibold opacity-60">
          1.5× points multiplier
        </div>
      )}

      {selected && (
        <div
          className="mt-3 text-xs font-bold text-center py-1 rounded-lg"
          style={{ background: skin.branding.secondaryColor, color: '#0f0f1a' }}
        >
          ✓ In Your Squad
        </div>
      )}
    </button>
  );
}
