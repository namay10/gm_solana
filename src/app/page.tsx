'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet, useConnection, AnchorWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import {
  fetchGmState,
  submitEntry,
  pickWinner,
  getCountdown,
  MAX_ENTRIES_PER_ROUND,
  initializeRaffle,
  OWNER_PUBKEY,
} from '@/components/contract-interaction'
import { SparklesIcon } from '@heroicons/react/24/solid'
import '@/app/globals.css'
import toast from 'react-hot-toast'
import { BN } from '@coral-xyz/anchor'

const ENTRY_PRICE_USDC = 250_000 // 0.25 USDC (6 decimals)
const USDC_MINT = process.env.NEXT_PUBLIC_USDC_MINT

export default function HomePage() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const [gmState, setGmState] = useState<null | {
    authority: PublicKey
    totalEntries: BN
    deadlineTs: BN
    participants: PublicKey[]
    bump: number
  }>(null)
  const [usdcBalance, setUsdcBalance] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(0)

  // Fetch on-chain state
  const loadGmState = useCallback(async () => {
    if (!wallet.connected || !wallet.publicKey) return
    try {
      const state = await fetchGmState(connection, wallet as AnchorWallet)
      setGmState(state)
    } catch (e: any) {
      toast.error('Failed to fetch raffle state')
      setGmState(null)
    }
  }, [connection, wallet, refresh])

  // Fetch USDC balance
  const loadUsdcBalance = useCallback(async () => {
    if (!wallet.publicKey || !USDC_MINT) return
    try {
      const ata = await getAssociatedTokenAddress(new PublicKey(USDC_MINT), wallet.publicKey)
      const bal = await connection.getTokenAccountBalance(ata, 'confirmed')
      setUsdcBalance(bal?.value?.uiAmount ?? 0)
    } catch (error) {
      console.log('error', error)
      setUsdcBalance(0)
    }
  }, [connection, wallet.publicKey])

  // Refresh state on wallet connect or refresh
  useEffect(() => {
    if (wallet.connected) {
      loadGmState()
      loadUsdcBalance()
    }
  }, [wallet.connected, loadGmState, loadUsdcBalance, refresh])

  // Countdown
  const countdown = useMemo(() => {
    if (!gmState) return null
    return getCountdown(gmState.deadlineTs)
  }, [gmState])

  // Winner (after deadline)
  const winner = useMemo(() => {
    if (!gmState) return null
    const now = Math.floor(Date.now() / 1000)
    if (gmState.deadlineTs.toNumber() < now && gmState.participants.length > 0) {
      return pickWinner(gmState.participants)
    }
    return null
  }, [gmState])

  // Can enter?
  const canEnter = useMemo(() => {
    if (!gmState || !wallet.connected) return false
    const now = Math.floor(Date.now() / 1000)
    return (
      gmState.deadlineTs.toNumber() > now &&
      usdcBalance >= ENTRY_PRICE_USDC / 1e6 &&
      gmState.totalEntries.toNumber() < MAX_ENTRIES_PER_ROUND
    )
  }, [gmState, wallet.connected, usdcBalance])

  // Is owner?
  const isOwner = useMemo(() => {
    return wallet.publicKey && OWNER_PUBKEY && wallet.publicKey.equals(OWNER_PUBKEY)
  }, [wallet.publicKey])

  // Handle entry
  const handleEnter = async () => {
    if (!wallet.connected || !wallet.publicKey || !USDC_MINT) {
      toast.error('Connect your wallet to participate!')
      return
    }
    setLoading(true)
    try {
      await submitEntry(connection, wallet as AnchorWallet, new PublicKey(USDC_MINT))
      setRefresh((r) => r + 1)
      toast.success('GM! Entry submitted successfully 🚀')
    } catch (e: any) {
      toast.error(e.message || 'Failed to submit entry')
    } finally {
      setLoading(false)
    }
  }

  // Handle initialize
  const [initLoading, setInitLoading] = useState(false)
  const handleInitialize = async () => {
    if (!wallet.connected || !wallet.publicKey) return
    setInitLoading(true)
    try {
      await initializeRaffle(connection, wallet as any)
      setRefresh((r) => r + 1)
    } catch (e: any) {
      toast.error(e.message || 'Failed to initialize raffle')
    } finally {
      setInitLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden">
      <div
        className="backdrop-blur-2xl bg-white/20 shadow-2xl rounded-3xl p-10 max-w-lg w-full mx-4 border border-white/30 relative animate-fade-in"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.10) 100%)',
          border: '1.5px solid rgba(255,255,255,0.25)',
          borderRadius: '1.5rem',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <button
            className="btn btn-primary btn-lg rounded-full px-10 py-6 text-4xl font-extrabold shadow-xl hover:scale-105 transition-transform duration-300 flex items-center gap-2 animate-bounce"
            onClick={handleEnter}
            disabled={loading || !wallet.connected}
            style={{
              background: 'linear-gradient(90deg, #232946 0%, #a18cd1 100%)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 0 32px 4px #a18cd1aa',
            }}
          >
            <span role="img" aria-label="gm">
              🌅
            </span>{' '}
            GM
            <SparklesIcon className="w-8 h-8 text-blue-300 animate-spin-slow" />
          </button>
        </div>
        <div className="mt-16 text-center">
          <h1
            className="text-3xl font-bold mb-2 tracking-tight text-blue-200 drop-shadow-lg"
            style={{ letterSpacing: '0.04em' }}
          >
            GM Raffle
          </h1>
          {gmState && (
            <>
              <div className="mb-6">
                <p className="text-lg font-semibold text-blue-100">
                  <b>Deadline:</b> {new Date(gmState.deadlineTs.toNumber() * 1000).toLocaleString()} (UTC)
                </p>
                {countdown && (
                  <p className="text-md mt-2 text-blue-200">
                    <b>Time left:</b> {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                  </p>
                )}
              </div>
              <div className="mb-4">
                <b className="block mb-2 text-blue-300">Participants ({gmState.participants.length}):</b>
                <ul
                  className="text-xs sm:text-sm max-h-[8.5rem] overflow-y-auto scroll-smooth bg-white/10 dark:bg-black/30 rounded-xl p-2 sm:p-3 shadow-inner backdrop-blur-md border border-blue-100/20 dark:border-blue-700/40"
                  style={{ minHeight: '2.5rem' }}
                >
                  {gmState.participants.map((pk, i) => (
                    <li key={pk.toBase58() + '-' + i} className="mb-1 text-blue-100 break-all">
                      {i + 1}. {pk.toBase58()}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
