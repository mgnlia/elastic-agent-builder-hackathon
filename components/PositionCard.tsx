'use client'

interface Position {
  protocol: 'Aave V3' | 'Compound V3'
  collateral: string
  collateralAmount: string
  debt: string
  debtAmount: string
  healthFactor: number
  liquidationThreshold: number
  address: string
}

export default function PositionCard({ position, onRebalance }: { position: Position; onRebalance: () => void }) {
  const getHealthColor = (hf: number) => {
    if (hf >= 2.0) return 'text-green-400'
    if (hf >= 1.5) return 'text-blue-400'
    if (hf >= 1.2) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-white">{position.protocol}</h4>
          <p className="text-sm text-gray-400">{position.address}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Health Factor</p>
          <p className={`text-2xl font-bold ${getHealthColor(position.healthFactor)}`}>
            {position.healthFactor.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-400 mb-1">Collateral</p>
          <p className="text-white font-medium">{position.collateralAmount} {position.collateral}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-1">Debt</p>
          <p className="text-white font-medium">{position.debtAmount} {position.debt}</p>
        </div>
      </div>

      <button
        onClick={onRebalance}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Rebalance Position
      </button>
    </div>
  )
}
