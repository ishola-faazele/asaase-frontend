// src/sampleData.js

export const sampleLands = [
    {
      id: '1',
      landName: 'Green Valley',
      size: 1000,
      value: 2.5,
      region: 'Eastern',
      city: 'Koforidua',
      boundaryPoints: [{ latitude: '6.0925', longitude: '-0.2156' }],
    },
    {
      id: '2',
      landName: 'Blue Mountain',
      size: 2000,
      value: 5.0,
      region: 'Western',
      city: 'Takoradi',
      boundaryPoints: [{ latitude: '4.8925', longitude: '-1.7741' }],
    },
    {
      id: '3',
      landName: 'Sunset Ridge',
      size: 1500,
      value: 3.2,
      region: 'Central',
      city: 'Cape Coast',
      boundaryPoints: [{ latitude: '5.1053', longitude: '-1.2467' }],
    },
  ];
  
  export const sampleTransactions = [
    {
      id: 'tx1',
      from: '0x123...',
      to: '0x456...',
      value: 1.5,
      timestamp: '1693456789',
    },
    {
      id: 'tx2',
      from: '0x789...',
      to: '0xabc...',
      value: 2.0,
      timestamp: '1693456790',
    },
  ];
  
  export const sampleAccountData = {
    account: '0x1234567890abcdef',
    landTokenBalance: 100,
    totalLandValue: 10.7,
  };
  
  export const sampleTotalSupply = 1000;
  export const sampleMostTokensAccount = {
    id: '0x1234567890abcdef',
    tokenBalance: 150,
  };
  export const sampleTopExpensiveTokens = [
    {
      id: '1',
      value: 5.0,
    },
    {
      id: '2',
      value: 4.5,
    },
    {
      id: '3',
      value: 4.2,
    },
  ];
  