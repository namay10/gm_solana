'use client'

import dynamic from 'next/dynamic'

// 🔥 turn off SSR for this component
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  {
    ssr: false,
  },
)

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full shadow-lg bg-transparent">
      <div className="container flex h-16 items-center justify-between px-4">
        <span className="text-2xl font-extrabold text-blue-200 drop-shadow-lg flex items-center gap-2">
          <span role="img" aria-label="gm">
            🌌
          </span>
          Good Morning!
        </span>
        <nav>
          <WalletMultiButton className="!bg-[#232946] !text-blue-200 !border-blue-400/40 shadow-md hover:!bg-[#181c2f] transition-all" />
        </nav>
      </div>
    </header>
  )
}
