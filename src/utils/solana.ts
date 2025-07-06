// utils/solana.ts
import { Program, AnchorProvider } from '@coral-xyz/anchor'
import { Anchor, IDL } from '../lib/idl'
import type { AnchorWallet } from '@solana/wallet-adapter-react'

export function getProvider(connection: any, wallet: AnchorWallet): AnchorProvider {
  return new AnchorProvider(connection, wallet as any, AnchorProvider.defaultOptions())
}

/**
 * Get your Anchor Program client
 */
export function getProgram(connection: any, wallet: AnchorWallet): Program<IDL> {
  const provider = getProvider(connection, wallet)
  return new Program<IDL>(Anchor, provider)
}

export const ASSOCIATED_TOKEN_PROGRAM_ID = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
