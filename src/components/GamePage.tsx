'use client';

import { useState, useMemo } from 'react';
import { Festival, SkinConfig, DaySquad, HorseCard, JockeyCard, TrainerCard, AnyCard } from '@/types';
import { buildHorseCards, buildJockeyCards, buildTrainerCards, rarityColor, rarityGlow, rarityGradient, rarityLabel } from '@/lib/cards';

interface Props {
  festival: Festival;
  skin: SkinConfig;
}

type Tab = 'horses' | 'jockeys' | 'trainers';

const EMPTY_SQUAD: DaySquad = { day: 1, horse: null, jockey: null, trainer: null, captainType: null };

export function GamePage({ festival, skin }: Props) {
  const [activeDay, setActiveDay] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>('horses');
  const [squads, setSquads] = useState<Record<number, DaySquad>>({});

  const dayRaces = festival.races.filter(r => r.day === activeDay);
  const squad = squads[activeDay] ?? { ...EMPTY_SQUAD, day: activeDay };

  const horseCards = useMemo(() => buildHorseCards(dayRaces), [activeDay]);
  const jockeyCards = useMemo(() => buildJockeyCards(dayRaces), [activeDay]);
  const trainerCards = useMemo(() => buildTrainerCards(dayRaces), [activeDay]);

  function updateSquad(update: Partial<DaySquad>) {
    setSquads(prev => ({ ...prev, [activeDay]: { ...squad, ...update } }));
  }

  function selectCard(card: AnyCard) {
    if (card.type === 'horse') {
      updateSquad({ horse: squad.horse?.id === card.id ? null : card as HorseCard });
    } else if (card.type === 'jockey') {
      const next = squad.jockey?.id === card.id ? null : card as JockeyCard;
      updateSquad({ jockey: next, captainType: next ? squad.captainType : null });
    } else if (card.type === 'trainer') {
      updateSquad({ trainer: squad.trainer?.id === card.id ? null : card as TrainerCard });
    }
  }

  function toggleCaptain() {
    if (!squad.jockey) return;
    updateSquad({ captainType: squad.captainType === 'jockey' ? null : 'jockey' });
  }

  function isSelected(card: AnyCard): boolean {
    if (card.type === 'horse') return squad.horse?.id === card.id;
    if (card.type === 'jockey') return squad.jockey?.id === card.id;
    if (card.type === 'trainer') return squad.trainer?.id === card.id;
    return false;
  }

  const days = Array.from({ length: festival.days }, (_, i) => i + 1);
  const cards = activeTab === 'horses' ? horseCards : activeTab === 'jockeys' ? jockeyCards : trainerCards;
  const squadComplete = squad.horse && squad.jockey && squad.trainer;

  const s = skin.branding;

  return (
    <div style={{ background: s.backgroundColor, color: s.textColor, minHeight: '100vh', fontFamily: s.fontBody }}>

      {/* Top nav */}
      <nav style={{ borderBottom: `1px solid ${s.secondaryColor}22`, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: s.secondaryColor, fontFamily: s.fontDisplay, fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px' }}>
            {skin.copy.competitionName}
          </span>
        </div>
        <a
          href={skin.monetisation.operatorUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: s.accentColor, color: '#fff', padding: '6px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
        >
          {skin.monetisation.offerText}
        </a>
      </nav>

      {/* Hero */}
      <div style={{ padding: '40px 24px 32px', textAlign: 'center', borderBottom: `1px solid ${s.secondaryColor}15` }}>
        <p style={{ color: s.secondaryColor, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
          {festival.name} · {skin.influencer.name}
        </p>
        <h1 style={{ fontFamily: s.fontDisplay, fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 700, color: s.textColor, lineHeight: 1.1, marginBottom: 12 }}>
          {skin.copy.heroHeadline}
        </h1>
        <p style={{ color: s.subtleText, fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
          {skin.copy.heroSubtitle}
        </p>
      </div>

      {/* Day selector */}
      <div style={{ display: 'flex', gap: 8, padding: '20px 24px', overflowX: 'auto', borderBottom: `1px solid ${s.secondaryColor}15` }}>
        {days.map(day => {
          const daySquad = squads[day];
          const filled = daySquad ? [daySquad.horse, daySquad.jockey, daySquad.trainer].filter(Boolean).length : 0;
          const isActive = day === activeDay;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              style={{
                flexShrink: 0,
                padding: '10px 20px',
                borderRadius: 8,
                border: `1px solid ${isActive ? s.secondaryColor : s.secondaryColor + '30'}`,
                background: isActive ? `${s.secondaryColor}15` : 'transparent',
                color: isActive ? s.secondaryColor : s.subtleText,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>Day {day}</span>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{filled}/3 picked</span>
            </button>
          );
        })}
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 0, maxWidth: 1200, margin: '0 auto', padding: '0 0 80px' }}>

        {/* Left: card browser */}
        <div style={{ borderRight: `1px solid ${s.secondaryColor}15`, padding: 24 }}>

          {/* Race info */}
          <div style={{ marginBottom: 20 }}>
            {dayRaces.map(race => (
              <div key={race.id} style={{ marginBottom: 4 }}>
                <span style={{ color: s.secondaryColor, fontSize: 13, fontWeight: 600 }}>{race.name}</span>
                <span style={{ color: s.subtleText, fontSize: 12, marginLeft: 8 }}>{race.grade} · {race.distance} · {new Date(race.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>

          {/* Tab selector */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: s.primaryColor, borderRadius: 8, padding: 4 }}>
            {(['horses', 'jockeys', 'trainers'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 6,
                  border: 'none',
                  background: activeTab === tab ? s.secondaryColor : 'transparent',
                  color: activeTab === tab ? '#0a0910' : s.subtleText,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {cards.map(card => (
              <CollectibleCard
                key={card.id}
                card={card}
                skin={skin}
                selected={isSelected(card)}
                onSelect={selectCard}
              />
            ))}
          </div>
        </div>

        {/* Right: squad builder */}
        <div style={{ padding: 24, position: 'sticky', top: 0, height: 'fit-content' }}>
          <h2 style={{ fontFamily: s.fontDisplay, fontSize: 18, fontWeight: 700, color: s.textColor, marginBottom: 4 }}>
            Day {activeDay} Squad
          </h2>
          <p style={{ color: s.subtleText, fontSize: 12, marginBottom: 24 }}>
            Pick one horse, jockey and trainer. Crown your captain jockey for 2× points.
          </p>

          <SquadSlot
            label="Horse"
            card={squad.horse}
            skin={skin}
            onRemove={() => updateSquad({ horse: null })}
            isCaptain={false}
            showCaptain={false}
          />
          <SquadSlot
            label="Jockey"
            card={squad.jockey}
            skin={skin}
            onRemove={() => updateSquad({ jockey: null, captainType: null })}
            isCaptain={squad.captainType === 'jockey'}
            showCaptain={!!squad.jockey}
            onToggleCaptain={toggleCaptain}
          />
          <SquadSlot
            label="Trainer"
            card={squad.trainer}
            skin={skin}
            onRemove={() => updateSquad({ trainer: null })}
            isCaptain={false}
            showCaptain={false}
          />

          {squadComplete && (
            <button
              style={{
                width: '100%',
                marginTop: 24,
                padding: '14px 0',
                borderRadius: 10,
                border: 'none',
                background: s.secondaryColor,
                color: '#0a0910',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                letterSpacing: '0.02em',
              }}
            >
              Lock In Day {activeDay} Squad
            </button>
          )}

          {!squadComplete && (
            <div style={{ marginTop: 24, padding: 16, borderRadius: 10, border: `1px dashed ${s.secondaryColor}30`, textAlign: 'center' }}>
              <p style={{ color: s.subtleText, fontSize: 13 }}>
                Select a horse, jockey and trainer to complete your squad
              </p>
            </div>
          )}

          {/* Points guide */}
          <div style={{ marginTop: 28, padding: 16, borderRadius: 10, background: s.primaryColor }}>
            <p style={{ color: s.secondaryColor, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Points Guide</p>
            {[['1st', '100pts'], ['2nd', '50pts'], ['3rd', '25pts'], ['4th', '10pts']].map(([pos, pts]) => (
              <div key={pos} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: s.subtleText }}>{pos}</span>
                <span style={{ color: s.textColor, fontWeight: 600 }}>{pts}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${s.secondaryColor}20`, marginTop: 10, paddingTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: s.subtleText }}>Outsider (10/1+)</span>
                <span style={{ color: s.secondaryColor, fontWeight: 600 }}>2× multiplier</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}>
                <span style={{ color: s.subtleText }}>Captain jockey</span>
                <span style={{ color: s.accentColor, fontWeight: 600 }}>2× bonus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Collectible Card Component ───────────────────────────────────────────────

function CollectibleCard({ card, skin, selected, onSelect }: {
  card: AnyCard;
  skin: SkinConfig;
  selected: boolean;
  onSelect: (card: AnyCard) => void;
}) {
  const s = skin.branding;
  const rColor = rarityColor(card.rarity);
  const rGlow = rarityGlow(card.rarity);
  const rGrad = rarityGradient(card.rarity);

  return (
    <button
      onClick={() => onSelect(card)}
      style={{
        width: '100%',
        background: rGrad,
        border: `1.5px solid ${selected ? rColor : rColor + '55'}`,
        borderRadius: 12,
        padding: 0,
        cursor: 'pointer',
        boxShadow: selected ? rGlow : 'none',
        transform: selected ? 'scale(1.03)' : 'scale(1)',
        transition: 'all 0.15s ease',
        overflow: 'hidden',
        textAlign: 'left',
      }}
    >
      {/* Card header bar */}
      <div style={{ background: rColor + '22', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${rColor}33` }}>
        <span style={{ color: rColor, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {rarityLabel(card.rarity)}
        </span>
        <span style={{ color: rColor, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>
          {card.type}
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 12px 14px' }}>
        {/* Icon */}
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: rColor + '20', border: `1.5px solid ${rColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, fontSize: 22 }}>
          {card.type === 'horse' ? '🐎' : card.type === 'jockey' ? '🏇' : '🎩'}
        </div>

        {/* Name */}
        <div style={{ color: s.textColor, fontWeight: 700, fontSize: 14, lineHeight: 1.2, marginBottom: 4, fontFamily: s.fontDisplay }}>
          {card.name}
        </div>

        {/* Sub info */}
        {card.type === 'horse' && (
          <>
            <div style={{ color: s.subtleText, fontSize: 11, marginBottom: 8 }}>
              {(card as HorseCard).jockeyName}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: s.subtleText, fontSize: 11 }}>Form: <span style={{ color: s.textColor, fontFamily: 'monospace' }}>{card.form}</span></span>
              <span style={{ color: rColor, fontWeight: 700, fontSize: 15 }}>{(card as HorseCard).oddsDisplay}</span>
            </div>
          </>
        )}

        {(card.type === 'jockey' || card.type === 'trainer') && (
          <div style={{ color: s.subtleText, fontSize: 11 }}>
            {(card as JockeyCard | TrainerCard).horseNames.slice(0, 2).join(', ')}
            {(card as JockeyCard | TrainerCard).horseNames.length > 2 && ` +${(card as JockeyCard | TrainerCard).horseNames.length - 2}`}
          </div>
        )}
      </div>

      {/* Selected indicator */}
      {selected && (
        <div style={{ background: rColor, padding: '6px 0', textAlign: 'center' }}>
          <span style={{ color: '#0a0910', fontSize: 11, fontWeight: 700 }}>✓ Selected</span>
        </div>
      )}
    </button>
  );
}

// ─── Squad Slot Component ─────────────────────────────────────────────────────

function SquadSlot({ label, card, skin, onRemove, isCaptain, showCaptain, onToggleCaptain }: {
  label: string;
  card: AnyCard | null;
  skin: SkinConfig;
  onRemove: () => void;
  isCaptain: boolean;
  showCaptain: boolean;
  onToggleCaptain?: () => void;
}) {
  const s = skin.branding;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: s.subtleText, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
        {label}
      </div>
      {card ? (
        <div style={{
          background: rarityGradient(card.rarity),
          border: `1.5px solid ${isCaptain ? skin.branding.accentColor : rarityColor(card.rarity) + '66'}`,
          borderRadius: 10,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: isCaptain ? `0 0 16px ${skin.branding.accentColor}44` : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>
              {card.type === 'horse' ? '🐎' : card.type === 'jockey' ? '🏇' : '🎩'}
            </span>
            <div>
              <div style={{ color: s.textColor, fontWeight: 600, fontSize: 13 }}>{card.name}</div>
              {isCaptain && <div style={{ color: s.accentColor, fontSize: 10, fontWeight: 700 }}>⭐ CAPTAIN · 2× POINTS</div>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {showCaptain && (
              <button
                onClick={onToggleCaptain}
                title="Set as captain"
                style={{
                  background: isCaptain ? s.accentColor : 'transparent',
                  border: `1px solid ${isCaptain ? s.accentColor : s.subtleText}`,
                  borderRadius: 4,
                  color: isCaptain ? '#fff' : s.subtleText,
                  fontSize: 11,
                  padding: '3px 7px',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ⭐
              </button>
            )}
            <button
              onClick={onRemove}
              style={{ background: 'transparent', border: 'none', color: s.subtleText, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          border: `1px dashed ${s.secondaryColor}30`,
          borderRadius: 10,
          padding: '14px',
          textAlign: 'center',
          color: s.subtleText,
          fontSize: 12,
        }}>
          No {label.toLowerCase()} selected
        </div>
      )}
    </div>
  );
}
