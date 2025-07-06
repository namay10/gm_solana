// utils/raffle.ts
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { getProgram } from '../utils/solana'
import type { AnchorWallet } from '@solana/wallet-adapter-react'

// Must match your on-chain seed
export const GM_STATE_SEED = 'gm_state'
// Must match your on-chain constant
export const MAX_ENTRIES_PER_ROUND = 100
export const OWNER_PUBKEY = new PublicKey(process.env.NEXT_PUBLIC_OWNER_PUBKEY!)

// ==== PDA Derivation Helpers ===============================================

/**
 * Derive the PDA and bump for the GmState account
 */
export async function deriveGmStatePDA(
  connection: any,
  authority: PublicKey,
  wallet: AnchorWallet,
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(GM_STATE_SEED), authority.toBuffer()],
    getProgram(connection, wallet).programId,
  )
}

/**
 * Derive the raffle's USDC ATA (owned by the program PDA).
 */
export async function deriveProgramUsdcAta(gmStatePda: PublicKey, usdcMint: PublicKey): Promise<PublicKey> {
  return await getAssociatedTokenAddress(
    usdcMint,
    gmStatePda,
    true, // program PDA is owner
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )
}

// ==== On-chain Calls =======================================================

export async function initializeRaffle(connection: any, wallet: AnchorWallet): Promise<string> {
  if (!wallet.publicKey) throw new Error('Wallet not connected')
  const program = getProgram(connection, wallet)

  // Derive PDA
  const [gmStatePda, bump] = await deriveGmStatePDA(connection, OWNER_PUBKEY, wallet)

  // Call initialize
  const tx = await program.methods
    .initialize()
    .accountsStrict({
      gmState: gmStatePda,
      authority: OWNER_PUBKEY,
      systemProgram: SystemProgram.programId,
    })
    .rpc()
  console.log('initialize tx:', tx)
  return tx
}

/**
 * Submit an entry (pay 0.25 USDC).
 * Assumes user has a USDC ATA and program ATA is already created.
 */
export async function submitEntry(connection: Connection, wallet: AnchorWallet, usdcMint: PublicKey): Promise<string> {
  if (!wallet.publicKey) throw new Error('Wallet not connected')
  const program = getProgram(connection, wallet)

  // Derive PDAs & ATAs
  const [gmStatePda, bump] = await deriveGmStatePDA(connection, OWNER_PUBKEY, wallet)
  const programUsdcAta = await deriveProgramUsdcAta(gmStatePda, usdcMint)
  const userUsdcAta = await getAssociatedTokenAddress(usdcMint, wallet.publicKey)
  const programAuthority = gmStatePda // PDA is the program authority
  const associatedTokenProgram = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')

  // Debug logs
  // console.log('gmStatePda:', gmStatePda.toBase58())
  // console.log('programUsdcAta:', programUsdcAta.toBase58())
  // console.log('userUsdcAta:', userUsdcAta.toBase58())
  // console.log('usdcMint:', usdcMint.toBase58())
  // console.log('programAuthority:', programAuthority.toBase58())
  // console.log('OWNER_PUBKEY:', OWNER_PUBKEY.toBase58())

  // Fire CPI to submit_entry
  const tx = await program.methods
    .submitEntry()
    .accountsStrict({
      gmState: gmStatePda,
      user: wallet.publicKey,
      userTokenAccount: userUsdcAta,
      programTokenAccount: programUsdcAta,
      programAuthority: programAuthority,
      authority: OWNER_PUBKEY,
      usdcMint,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      associatedTokenProgram: associatedTokenProgram,
    })
    .rpc()
  console.log('submitEntry tx:', tx)
  return tx
}

/**
 * Fetch the on-chain GmState account.
 */
export async function fetchGmState(
  connection: any,
  wallet: AnchorWallet,
): Promise<{
  authority: PublicKey
  totalEntries: BN
  deadlineTs: BN
  participants: PublicKey[]
  bump: number
}> {
  if (!wallet.publicKey) throw new Error('Wallet not connected')
  const program = getProgram(connection, wallet)
  const [gmStatePda] = await deriveGmStatePDA(connection, OWNER_PUBKEY, wallet)
  const state = await program.account.gmState.fetch(gmStatePda)
  return {
    authority: state.authority,
    totalEntries: state.totalEntries,
    deadlineTs: state.deadlineTs,
    participants: state.participants,
    bump: state.bump,
  }
}

// ==== Front-end Utilities =================================================

/**
 * Pick a random winner from a list of Pubkeys.
 */
export function pickWinner(participants: PublicKey[]): PublicKey | null {
  if (participants.length === 0) return null
  const idx = Math.floor(Math.random() * participants.length)
  return participants[idx]
}

/**
 * Given a UNIX timestamp, compute days/hours/minutes/seconds left.
 */
export function getCountdown(deadlineTs: BN | number): {
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const now = Math.floor(Date.now() / 1000)
  const dl = typeof deadlineTs === 'number' ? deadlineTs : deadlineTs.toNumber()
  const secsLeft = Math.max(0, dl - now)
  const days = Math.floor(secsLeft / 86400)
  const hours = Math.floor((secsLeft % 86400) / 3600)
  const minutes = Math.floor((secsLeft % 3600) / 60)
  const seconds = secsLeft % 60
  return { days, hours, minutes, seconds }
}
