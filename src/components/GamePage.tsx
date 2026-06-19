'use client';

import { useState, useMemo } from 'react';
import { Festival, SkinConfig, DaySquad, HorseCard, JockeyCard, TrainerCard, AnyCard } from '@/types';
import { buildHorseCards, buildJockeyCards, buildTrainerCards, rarityColor, rarityGradient, rarityLabel } from '@/lib/cards';

interface Props {
  festival: Festival;
  skin: SkinConfig;
}

type Tab = 'horses' | 'jockeys' | 'trainers';
const EMPTY_SQUAD = (day: number): DaySquad => ({ day, horse: null, jockey: null, trainer: null, captainType: null });

export function GamePage({ festival, skin }: Props) {
  const [activeDay, setActiveDay] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>('horses');
  const [squads, setSquads] = useState<Record<number, DaySquad>>({});

  const dayRaces = festival.races.filter(r => r.day === activeDay);
  const squad = squads[activeDay] ?? EMPTY_SQUAD(activeDay);

  const horseCards = useMemo(() => buildHorseCards(dayRaces), [activeDay]);
  const jockeyCards = useMemo(() => buildJockeyCards(dayRaces), [activeDay]);
  const trainerCards = useMemo(() => buildTrainerCards(dayRaces), [activeDay]);

  const cards = activeTab === 'horses' ? horseCards : activeTab === 'jockeys' ? jockeyCards : trainerCards;

  function updateSquad(update: Partial<DaySquad>) {
    setSquads(prev => ({ ...prev, [activeDay]: { ...squad, ...update } }));
  }

  function selectCard(card: AnyCard) {
    if (card.type === 'horse') {
      updateSquad({ horse: squad.horse?.id === card.id ? null : card as HorseCard });
    } else if (card.type === 'jockey') {
      const next = squad.jockey?.id === card.id ? null : card as JockeyCard;
      updateSquad({ jockey: next, captainType: next ? squad.captainType : null });
    } else {
      updateSquad({ trainer: squad.trainer?.id === card.id ? null : card as TrainerCard });
    }
  }

  function isSelected(card: AnyCard) {
    if (card.type === 'horse') return squad.horse?.id === card.id;
    if (card.type === 'jockey') return squad.jockey?.id === card.id;
    return squad.trainer?.id === card.id;
  }

  const squadComplete = squad.horse && squad.jockey && squad.trainer;
  const days = Array.from({ length: festival.days }, (_, i) => i + 1);
  const s = skin.branding;

  return (
    <div style={{ background: '#0a0910', color: '#f0ece0', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <span style={{ color: '#c9a84c', fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 18 }}>
          {skin.copy.competitionName}
        </span>
        <a href={skin.monetisation.operatorUrl} target="_blank" rel="noopener noreferrer"
          style={{ background: '#e63946', color: '#fff', padding: '6px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          {skin.monetisation.offerText}
        </a>
      </nav>

      {/* Hero */}
      <div style={{ padding: '36px 24px 28px', textAlign: 'center', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
        <p style={{ color: '#c9a84c', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
          {festival.name} · {skin.influencer.name}
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, color: '#f0ece0', lineHeight: 1.1, marginBottom: 10 }}>
          {skin.copy.heroHeadline}
        </h1>
        <p style={{ color: 'rgba(240,236,224,0.45)', fontSize: 15, maxWidth: 460, margin: '0 auto' }}>
          {skin.copy.heroSubtitle}
        </p>
      </div>

      {/* Day tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '16px 24px', overflowX: 'auto', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
        {days.map(day => {
          const ds = squads[day];
          const filled = ds ? [ds.horse, ds.jockey, ds.trainer].filter(Boolean).length : 0;
          const isActive = day === activeDay;
          return (
            <button key={day} onClick={() => setActiveDay(day)} style={{
              flexShrink: 0, padding: '10px 20px', borderRadius: 8,
              border: `1px solid ${isActive ? '#c9a84c' : 'rgba(201,168,76,0.2)'}`,
              background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
              color: isActive ? '#c9a84c' : 'rgba(240,236,224,0.4)',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <span>Day {day}</span>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{filled}/3 picked</span>
            </button>
          );
        })}
      </div>

      {/* Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Card browser */}
        <div style={{ borderRight: '1px solid rgba(201,168,76,0.1)', padding: 24 }}>
          {/* Race info */}
          <div style={{ marginBottom: 16 }}>
            {dayRaces.map(race => (
              <div key={race.id} style={{ marginBottom: 3 }}>
                <span style={{ color: '#c9a84c', fontSize: 13, fontWeight: 600 }}>{race.name}</span>
                <span style={{ color: 'rgba(240,236,224,0.35)', fontSize: 11, marginLeft: 8 }}>
                  {race.grade} · {race.distance} · {new Date(race.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 4, marginBottom: 20 }}>
            {(['horses', 'jockeys', 'trainers'] as Tab[]).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: '8px 0', borderRadius: 7, border: 'none',
                background: activeTab === tab ? '#c9a84c' : 'transparent',
                color: activeTab === tab ? '#0a0910' : 'rgba(240,236,224,0.45)',
                fontWeight: 600, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize',
              }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
            {cards.map(card => (
              <CollectibleCard key={card.id} card={card} selected={isSelected(card)} onSelect={selectCard} />
            ))}
          </div>
        </div>

        {/* Squad panel */}
        <div style={{ padding: 24, position: 'sticky', top: 0, alignSelf: 'start' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#f0ece0' }}>Day {activeDay} Squad</h2>
          <p style={{ color: 'rgba(240,236,224,0.35)', fontSize: 12, marginBottom: 20 }}>
            Pick a horse, jockey and trainer. Crown your jockey captain for 2× points.
          </p>

          <SquadSlot label="🐎 Horse" card={squad.horse} onRemove={() => updateSquad({ horse: null })} isCaptain={false} showCaptain={false} />
          <SquadSlot
            label="🏇 Jockey" card={squad.jockey}
            onRemove={() => updateSquad({ jockey: null, captainType: null })}
            isCaptain={squad.captainType === 'jockey'}
            showCaptain={!!squad.jockey}
            onToggleCaptain={() => updateSquad({ captainType: squad.captainType === 'jockey' ? null : 'jockey' })}
          />
          <SquadSlot label="🎩 Trainer" card={squad.trainer} onRemove={() => updateSquad({ trainer: null })} isCaptain={false} showCaptain={false} />

          {squadComplete ? (
            <button style={{
              width: '100%', marginTop: 20, padding: '13px 0', borderRadius: 10,
              border: 'none', background: '#c9a84c', color: '#0a0910',
              fontWeight: 700, fontSize: 15, cursor: 'pointer', letterSpacing: '0.02em',
            }}>
              Lock In Day {activeDay} Squad →
            </button>
          ) : (
            <div style={{ marginTop: 20, padding: 14, borderRadius: 10, border: '1px dashed rgba(201,168,76,0.2)', textAlign: 'center' }}>
              <p style={{ color: 'rgba(240,236,224,0.3)', fontSize: 12 }}>Select a horse, jockey and trainer</p>
            </div>
          )}

          {/* Points guide */}
          <div style={{ marginTop: 24, padding: 16, borderRadius: 10, background: '#12111a' }}>
            <p style={{ color: '#c9a84c', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Points Guide</p>
            {[['1st', '100pts'], ['2nd', '50pts'], ['3rd', '25pts'], ['4th', '10pts']].map(([pos, pts]) => (
              <div key={pos} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: 'rgba(240,236,224,0.4)' }}>{pos}</span>
                <span style={{ color: '#f0ece0', fontWeight: 600 }}>{pts}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(201,168,76,0.12)', marginTop: 10, paddingTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'rgba(240,236,224,0.4)' }}>Outsider (10/1+)</span>
                <span style={{ color: '#c9a84c', fontWeight: 600 }}>2× multiplier</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 6 }}>
                <span style={{ color: 'rgba(240,236,224,0.4)' }}>Captain jockey</span>
                <span style={{ color: '#e63946', fontWeight: 600 }}>2× bonus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollectibleCard({ card, selected, onSelect }: { card: AnyCard; selected: boolean; onSelect: (c: AnyCard) => void }) {
  const rColor = rarityColor(card.rarity);
  const rGrad = rarityGradient(card.rarity);
  const rLabel = rarityLabel(card.rarity);
  const icon = card.type === 'horse' ? '🐎' : card.type === 'jockey' ? '🏇' : '🎩';

  return (
    <button onClick={() => onSelect(card)} style={{
      width: '100%', background: rGrad,
      border: `1.5px solid ${selected ? rColor : rColor + '55'}`,
      borderRadius: 14, padding: 0, cursor: 'pointer',
      boxShadow: selected ? `0 0 20px ${rColor}55, 0 0 40px ${rColor}22` : 'none',
      transform: selected ? 'scale(1.04)' : 'scale(1)',
      transition: 'all 0.15s ease', overflow: 'hidden', textAlign: 'left',
    }}>
      {/* Badge */}
      <div style={{
        padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: `1px solid ${rColor}22`,
        background: `${rColor}18`,
        color: rColor, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>
        <span>{rLabel}</span><span>{card.type}</span>
      </div>

      {/* Art area */}
      <div style={{
        height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `radial-gradient(circle at 50% 60%, ${rColor}22, transparent 70%)`,
        fontSize: 48,
      }}>
        {icon}
      </div>

      {/* Body */}
      <div style={{ padding: '10px 10px 12px' }}>
        <div style={{ color: '#f0ece0', fontWeight: 700, fontSize: 13, lineHeight: 1.2, marginBottom: 3, fontFamily: 'Georgia, serif' }}>
          {card.name}
        </div>
        {card.type === 'horse' && (
          <>
            <div style={{ color: 'rgba(240,236,224,0.4)', fontSize: 10, marginBottom: 8 }}>
              {(card as HorseCard).jockeyName}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: 'rgba(240,236,224,0.4)' }}>
                Form <span style={{ color: '#f0ece0', fontFamily: 'monospace' }}>{card.form}</span>
              </span>
              <span style={{ color: rColor, fontWeight: 700, fontSize: 15 }}>{(card as HorseCard).oddsDisplay}</span>
            </div>
          </>
        )}
        {(card.type === 'jockey' || card.type === 'trainer') && (
          <div style={{ color: 'rgba(240,236,224,0.4)', fontSize: 10 }}>
            {(card as JockeyCard | TrainerCard).horseNames.slice(0, 2).join(', ')}
            {(card as JockeyCard | TrainerCard).horseNames.length > 2 && ` +${(card as JockeyCard | TrainerCard).horseNames.length - 2}`}
          </div>
        )}
      </div>

      {selected && (
        <div style={{ background: rColor, padding: '5px 0', textAlign: 'center', color: '#0a0910', fontSize: 10, fontWeight: 700 }}>
          ✓ Selected
        </div>
      )}
    </button>
  );
}

function SquadSlot({ label, card, onRemove, isCaptain, showCaptain, onToggleCaptain }: {
  label: string; card: AnyCard | null; onRemove: () => void;
  isCaptain: boolean; showCaptain: boolean; onToggleCaptain?: () => void;
}) {
  const rColor = card ? rarityColor(card.rarity) : 'rgba(201,168,76,0.25)';

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(240,236,224,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>
        {label}
      </div>
      {card ? (
        <div style={{
          borderRadius: 10, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10,
          border: `1px solid ${isCaptain ? '#e63946' : rColor + '55'}`,
          background: isCaptain ? 'rgba(230,57,70,0.06)' : `${rColor}08`,
          boxShadow: isCaptain ? '0 0 12px rgba(230,57,70,0.2)' : 'none',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece0' }}>{card.name}</div>
            {isCaptain && <div style={{ fontSize: 10, fontWeight: 700, color: '#e63946', marginTop: 2 }}>⭐ CAPTAIN · 2× POINTS</div>}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {showCaptain && (
              <button onClick={onToggleCaptain} style={{
                fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
                border: `1px solid ${isCaptain ? '#e63946' : 'rgba(230,57,70,0.35)'}`,
                background: isCaptain ? '#e63946' : 'transparent',
                color: isCaptain ? '#fff' : 'rgba(230,57,70,0.6)',
              }}>⭐</button>
            )}
            <button onClick={onRemove} style={{ background: 'transparent', border: 'none', color: 'rgba(240,236,224,0.3)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
        </div>
      ) : (
        <div style={{ border: '1px dashed rgba(201,168,76,0.2)', borderRadius: 10, padding: 13, textAlign: 'center', color: 'rgba(240,236,224,0.25)', fontSize: 12 }}>
          None selected
        </div>
      )}
    </div>
  );
}
