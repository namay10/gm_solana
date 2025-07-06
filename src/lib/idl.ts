export type IDL = {
  address: 'GZ4YiFzakh4EhhHwSUFoAoLFsr9yHBbPBQwJMzx5nv37'
  metadata: {
    name: 'anchor'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'initialize'
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237]
      accounts: [
        {
          name: 'gmState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [103, 109, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'authority'
              },
            ]
          }
        },
        {
          name: 'authority'
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: []
    },
    {
      name: 'submitEntry'
      discriminator: [150, 212, 114, 178, 207, 212, 216, 222]
      accounts: [
        {
          name: 'gmState'
          writable: true
        },
        {
          name: 'user'
          writable: true
          signer: true
        },
        {
          name: 'userTokenAccount'
          writable: true
        },
        {
          name: 'programTokenAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'programAuthority'
              },
              {
                kind: 'const'
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ]
              },
              {
                kind: 'account'
                path: 'usdcMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'programAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [103, 109, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'authority'
              },
            ]
          }
        },
        {
          name: 'authority'
        },
        {
          name: 'usdcMint'
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
      ]
      args: []
    },
  ]
  accounts: [
    {
      name: 'gmState'
      discriminator: [14, 31, 106, 6, 7, 158, 72, 179]
    },
  ]
  errors: [
    {
      code: 6000
      name: 'roundClosed'
      msg: 'Round is closed; cannot accept more entries.'
    },
    {
      code: 6001
      name: 'tooManyEntries'
      msg: 'Too many entries; counter overflow or capacity reached.'
    },
  ]
  types: [
    {
      name: 'gmState'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'authority'
            type: 'pubkey'
          },
          {
            name: 'totalEntries'
            type: 'u64'
          },
          {
            name: 'deadlineTs'
            type: 'i64'
          },
          {
            name: 'participants'
            type: {
              vec: 'pubkey'
            }
          },
          {
            name: 'bump'
            type: 'u8'
          },
        ]
      }
    },
  ]
}
export const Anchor: IDL = {
  address: 'GZ4YiFzakh4EhhHwSUFoAoLFsr9yHBbPBQwJMzx5nv37',
  metadata: {
    name: 'anchor',
    version: '0.1.0',
    spec: '0.1.0',
    description: 'Created with Anchor',
  },
  instructions: [
    {
      name: 'initialize',
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        {
          name: 'gmState',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [103, 109, 95, 115, 116, 97, 116, 101],
              },
              {
                kind: 'account',
                path: 'authority',
              },
            ],
          },
        },
        {
          name: 'authority',
          writable: true,
          signer: true,
        },
        {
          name: 'systemProgram',
          address: '11111111111111111111111111111111',
        },
      ],
      args: [],
    },
    {
      name: 'submitEntry',
      discriminator: [150, 212, 114, 178, 207, 212, 216, 222],
      accounts: [
        {
          name: 'gmState',
          writable: true,
        },
        {
          name: 'user',
          writable: true,
          signer: true,
        },
        {
          name: 'userTokenAccount',
          writable: true,
        },
        {
          name: 'programTokenAccount',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'account',
                path: 'programAuthority',
              },
              {
                kind: 'const',
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206, 235, 121, 172, 28, 180, 133, 237, 95,
                  91, 55, 145, 58, 140, 245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: 'account',
                path: 'usdcMint',
              },
            ],
            program: {
              kind: 'const',
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16,
                132, 4, 142, 123, 216, 219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: 'programAuthority',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [103, 109, 95, 115, 116, 97, 116, 101],
              },
              {
                kind: 'account',
                path: 'authority',
              },
            ],
          },
        },
        {
          name: 'authority',
        },
        {
          name: 'usdcMint',
        },
        {
          name: 'tokenProgram',
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          name: 'systemProgram',
          address: '11111111111111111111111111111111',
        },
        {
          name: 'associatedTokenProgram',
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'gmState',
      discriminator: [14, 31, 106, 6, 7, 158, 72, 179],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'roundClosed',
      msg: 'Round is closed; cannot accept more entries.',
    },
    {
      code: 6001,
      name: 'tooManyEntries',
      msg: 'Too many entries; counter overflow or capacity reached.',
    },
  ],
  types: [
    {
      name: 'gmState',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'pubkey',
          },
          {
            name: 'totalEntries',
            type: 'u64',
          },
          {
            name: 'deadlineTs',
            type: 'i64',
          },
          {
            name: 'participants',
            type: {
              vec: 'pubkey',
            },
          },
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
  ],
}
