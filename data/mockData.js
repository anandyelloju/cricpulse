import { generateId } from '../js/core/utils.js';

export const mockMatch = {
  id: generateId('match'),

  teamA: {
    id: generateId('team'),
    name: 'India',

    players: [
      {
        id: generateId('player'),
        name: 'Rohit Sharma',
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false
      },

      {
        id: generateId('player'),
        name: 'Virat Kohli',
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false
      }
    ]
  },

  teamB: {
    id: generateId('team'),
    name: 'Australia',

    players: [
      {
        id: generateId('player'),
        name: 'Starc'
      },

      {
        id: generateId('player'),
        name: 'Cummins'
      }
    ]
  }
};