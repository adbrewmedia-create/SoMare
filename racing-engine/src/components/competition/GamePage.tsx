'use client';

import { useState, useMemo } from 'react';
import { HorseCard, SkinConfig, Festival } from '@/types';
import { HorseCardComponent } from '@/components/card/HorseCard';
import { SquadPanel } from '@/components/competition/SquadPanel';
import { buildHorseCards, MAX_PICKS_PER_DAY, MAX_SQUAD_SIZE } from '@/lib/scoring/cards';

interface Props {
  festival: Festival;
  skin: SkinConfig;
}

export function GamePage({ festival, skin }: Props) {
  const [picks, setPicks] = useState<HorseCard[]>([]);
  const [activeDay, setActiveDay] = useState(1);

  const allCards = useMemo(() => buildHorseCards(festival.races), [festival]);
  const dayCards = allCards.filter(c => c.raceDay === activeDay);

  const picksPerDay = useMemo(() => {
    const map: Record<number, number> = {};
    for (const pick of picks) {
      map[pick.raceDay] = (map[pick.raceDay] ?? 0) + 1;
    }
    return map;
  }, [picks]);

  function isSelected(card: HorseCard) {
    return picks.some(p => p.horse.id === card.horse.id);
  }

  function canPick(card: HorseCard) {
    if (isSelected(card)) return true;
    if (picks.length >= MAX_SQUAD_SIZE) return false;
    if ((picksPerDay[card.raceDay] ?? 0) >= MAX_PICKS_PER_DAY) return false;
    return true;
  }

  function handleSelect(card: HorseCard) {
    if (isSelected(card)) {
      setPicks(prev => prev.filter(p => p.horse.id !== card.horse.id));
    } else if (canPick(card)) {
      setPicks(prev => [...prev, card]);
    }
  }

  const days = Array.from({ length: festival.days }, (_, i) => i + 1);

  return (
    <div
      className="min-h-screen"
      style={{
        background: skin.branding.backgroundColor,
        color: skin.branding.textColor,
        fontFamily: skin.branding.fontBody,
      }}
    >
      {/* Hero */}
      <div
        className="px-6 py-12 text-center"
        style={{
          background: `linear-gradient(180deg, ${skin.branding.primaryColor} 0%, ${skin.branding.backgroundColor} 100%)`,
          borderBottom: `1px solid ${skin.branding.secondaryColor}22`,
        }}
      >
        <p className="text-xs font-bold tracking-widest uppercase mb-3 opacity-50">
          {skin.copy.competitionName}
        </p>
        <h1
          className="text-4xl md:text-6xl font-bold mb-4"
          style={{ fontFamily: skin.branding.fontDisplay, color: skin.branding.secondaryColor }}
        >
          {skin.copy.heroHeadline}
        </h1>
        <p className="text-base opacity-70 max-w-xl mx-auto">
          {skin.copy.heroSubtitle}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3 text-sm">
          <img
            src={skin.influencer.avatar}
            alt={skin.influencer.name}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="opacity-60">{skin.influencer.name} · {skin.influencer.tagline}</span>
        </div>
      </div>

      {/* Day selector */}
      <div
        className="flex gap-2 px-6 py-4 overflow-x-auto"
        style={{ borderBottom: `1px solid ${skin.branding.secondaryColor}22` }}
      >
        {days.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className="shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              background: activeDay === day ? skin.branding.secondaryColor : `${skin.branding.secondaryColor}15`,
              color: activeDay === day ? '#0f0f1a' : skin.branding.textColor,
            }}
          >
            Day {day}
            {(picksPerDay[day] ?? 0) > 0 && (
              <span className="ml-1 opacity-60">·{picksPerDay[day]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Main layout */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Race cards */}
        <div className="lg:col-span-2 space-y-8">
          {festival.races
            .filter(r => r.day === activeDay)
            .map(race => (
              <div key={race.id}>
                <div className="mb-4">
                  <div className="flex items-baseline gap-3">
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: skin.branding.fontDisplay }}
                    >
                      {race.name}
                    </h3>
                    <span className="text-xs opacity-40">{race.grade}</span>
                  </div>
                  <p className="text-sm opacity-50 mt-1">
                    {race.distance} ·{' '}
                    {new Date(race.time).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {(picksPerDay[activeDay] ?? 0) >= MAX_PICKS_PER_DAY && (
                      <span
                        className="ml-3 text-xs font-semibold"
                        style={{ color: skin.branding.accentColor }}
                      >
                        Day {activeDay} picks full
                      </span>
                    )}
                  </p>
                </div>
                <div className="space-y-3">
                  {race.runners.map(horse => {
                    const card = dayCards.find(
                      c => c.horse.id === horse.id && c.raceId === race.id
                    );
                    if (!card) return null;
                    return (
                      <HorseCardComponent
                        key={horse.id}
                        card={card}
                        skin={skin}
                        selected={isSelected(card)}
                        onSelect={handleSelect}
                        disabled={!canPick(card)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

        {/* Squad panel */}
        <div>
          <SquadPanel
            picks={picks}
            skin={skin}
            onRemove={card => handleSelect(card)}
            maxSize={MAX_SQUAD_SIZE}
          />
        </div>
      </div>
    </div>
  );
}
