import { Festival, Horse } from '@/types';
import { getRarity } from '@/lib/scoring/cards';

// Shaped to match The Racing API response structure
// Replace with real API call once key is available

function makeHorse(
  id: string,
  name: string,
  jockey: string,
  trainer: string,
  oddsDisplay: string,
  decimalOdds: number,
  form: string,
  number: number
): Horse {
  return {
    id,
    name,
    jockey,
    trainer,
    odds: decimalOdds,
    oddsDisplay,
    rarity: getRarity(decimalOdds),
    form,
    number,
  };
}

export const MOCK_CHELTENHAM: Festival = {
  id: 'cheltenham-2025',
  name: 'Cheltenham Festival 2025',
  course: 'Cheltenham',
  startDate: '2025-03-11',
  endDate: '2025-03-14',
  days: 4,
  races: [
    {
      id: 'race-day1-1',
      name: 'Supreme Novices\' Hurdle',
      time: '2025-03-11T13:30:00Z',
      course: 'Cheltenham',
      day: 1,
      distance: '2m87y',
      grade: 'Grade 1',
      runners: [
        makeHorse('h1', 'Brightwater', 'P. Townend', 'W. Mullins', '5/2', 3.5, '1-1-2', 1),
        makeHorse('h2', 'Lark In The Morn', 'R. Blackmore', 'H. de Bromhead', '4/1', 5.0, '1-1-1', 2),
        makeHorse('h3', 'Dysart Dynamo', 'D. Jacob', 'W. Mullins', '9/2', 5.5, '2-1-1', 3),
        makeHorse('h4', 'Facile Vega', 'P. Townend', 'W. Mullins', '7/1', 8.0, '1-3-1', 4),
        makeHorse('h5', 'The Shunter', 'J. Burke', 'E. Bolger', '12/1', 13.0, '1-1-4', 5),
        makeHorse('h6', 'Redemption Day', 'H. Skelton', 'D. Skelton', '20/1', 21.0, '2-2-3', 6),
        makeHorse('h7', 'Stage Star', 'H. Cobden', 'P. Nicholls', '25/1', 26.0, '1-1-5', 7),
      ],
    },
    {
      id: 'race-day1-2',
      name: 'Arkle Challenge Trophy',
      time: '2025-03-11T14:10:00Z',
      course: 'Cheltenham',
      day: 1,
      distance: '1m7f199y',
      grade: 'Grade 1',
      runners: [
        makeHorse('h8', 'El Fabiolo', 'P. Townend', 'W. Mullins', '2/1', 3.0, '1-1-1', 1),
        makeHorse('h9', 'Jonbon', 'N. de Boinville', 'N. Henderson', '3/1', 4.0, '1-1-2', 2),
        makeHorse('h10', 'Riviere D\'etel', 'R. Blackmore', 'H. de Bromhead', '7/2', 4.5, '1-2-1', 3),
        makeHorse('h11', 'Edwardstone', 'T. Cannon', 'A. King', '8/1', 9.0, '1-1-3', 4),
        makeHorse('h12', 'Blue Lord', 'P. Townend', 'W. Mullins', '14/1', 15.0, '2-1-4', 5),
      ],
    },
    {
      id: 'race-day2-1',
      name: 'Ballymore Novices\' Hurdle',
      time: '2025-03-12T13:30:00Z',
      course: 'Cheltenham',
      day: 2,
      distance: '2m5f',
      grade: 'Grade 1',
      runners: [
        makeHorse('h13', 'Corbetts Cross', 'R. Blackmore', 'H. de Bromhead', '3/1', 4.0, '1-1-1', 1),
        makeHorse('h14', 'Impaire Et Passe', 'M. Peltier', 'E. Leenders', '4/1', 5.0, '1-2-1', 2),
        makeHorse('h15', 'Stay Away Fay', 'P. Townend', 'W. Mullins', '9/2', 5.5, '1-1-2', 3),
        makeHorse('h16', 'Might I', 'D. Jacob', 'W. Mullins', '10/1', 11.0, '2-1-3', 4),
        makeHorse('h17', 'The Real Whacker', 'H. Cobden', 'P. Nicholls', '16/1', 17.0, '1-3-2', 5),
      ],
    },
    {
      id: 'race-day3-1',
      name: 'Ryanair Chase',
      time: '2025-03-13T14:50:00Z',
      course: 'Cheltenham',
      day: 3,
      distance: '2m4f127y',
      grade: 'Grade 1',
      runners: [
        makeHorse('h18', 'Envoi Allen', 'R. Blackmore', 'H. de Bromhead', '7/4', 2.75, '1-2-1', 1),
        makeHorse('h19', 'Allaho', 'P. Townend', 'W. Mullins', '5/2', 3.5, '1-1-3', 2),
        makeHorse('h20', 'Conflated', 'D. Mullins', 'G. Elliott', '6/1', 7.0, '2-1-2', 3),
        makeHorse('h21', 'Imperial Aura', 'D. Jacob', 'K. Bailey', '9/1', 10.0, '1-3-1', 4),
        makeHorse('h22', 'Janidil', 'A. Zucchini', 'W. Mullins', '20/1', 21.0, '2-2-4', 5),
      ],
    },
    {
      id: 'race-day4-1',
      name: 'Cheltenham Gold Cup',
      time: '2025-03-14T15:30:00Z',
      course: 'Cheltenham',
      day: 4,
      distance: '3m2f46y',
      grade: 'Grade 1',
      runners: [
        makeHorse('h23', 'Galopin Des Champs', 'P. Townend', 'W. Mullins', '6/4', 2.5, '1-1-1', 1),
        makeHorse('h24', 'Bravemansgame', 'H. Cobden', 'P. Nicholls', '4/1', 5.0, '1-2-1', 2),
        makeHorse('h25', 'Gerri Colombe', 'J. Codd', 'G. Elliott', '5/1', 6.0, '1-1-2', 3),
        makeHorse('h26', 'Royal Kahala', 'R. Blackmore', 'H. de Bromhead', '8/1', 9.0, '2-1-3', 4),
        makeHorse('h27', 'Conflated', 'D. Mullins', 'G. Elliott', '10/1', 11.0, '1-3-2', 5),
        makeHorse('h28', 'Ahoy Senor', 'D. Jacob', 'L. Russell', '14/1', 15.0, '2-2-1', 6),
        makeHorse('h29', 'Kildisart', 'S. Bowen', 'B. Pauling', '33/1', 34.0, '3-2-4', 7),
      ],
    },
  ],
};
