'use client'

import { useState } from 'react'
import { X, Zap, AlertCircle } from 'lucide-react'

interface Position {
  protocol: 'Aave V3' | 'Compound V3'
  collateral: string
  collateralAmount: string
  debt: string
  debtAmount: string
  healthFactor: number
}

export default function RebalanceModal({ position, onClose }: { position: Position; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleRebalance = async () => {
    setLoading(true)
    // Simulate rebalancing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    setSuccess(true)
    setTimeout(onClose, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-white/10 rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Rebalance Position</h3>
              <p className="text-sm text-gray-400">{position.protocol}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!success ? (
          <>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-200 font-medium mb-1">Current Health Factor: {position.healthFactor.toFixed(2)}</p>
                  <p className="text-yellow-200/80 text-sm">
                    This position is at risk. AI recommends adding collateral or repaying debt.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">Suggested Action</p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-white font-medium">Repay 2,000 USDC</p>
                  <p className="text-gray-400 text-sm mt-1">Using Aave V3 flash loan</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Expected Result</p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-200 font-medium">New Health Factor: ~1.85</p>
                  <p className="text-green-200/80 text-sm mt-1">Position will be safe</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleRebalance}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Executing Rebalance...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Execute Rebalance
                </>
              )}
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">Rebalance Successful!</h4>
            <p className="text-gray-400">Your position is now safe</p>
          </div>
        )}
      </div>
    </div>
  )
}
