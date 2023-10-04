import Alert from '@components/Common/Alert'
import { IS_MAINNET } from '@lenstube/constants'
import type { LenstubeCollectModule } from '@lenstube/lens/custom-types'
import { Trans } from '@lingui/macro'
import Link from 'next/link'
import React from 'react'
<<<<<<< HEAD
import type { DragverseCollectModule } from 'utils'
import { IS_MAINNET } from 'utils'
=======
>>>>>>> upstream/main

const getUniswapURL = (amount: number, outputCurrency: string): string => {
  return `https://app.uniswap.org/#/swap?exactField=output&exactAmount=${amount}&outputCurrency=${outputCurrency}&chain=${
    IS_MAINNET ? 'polygon' : 'polygon_mumbai'
  }`
}

type Props = {
  collectModule: DragverseCollectModule
}

const BalanceAlert: React.FC<Props> = ({ collectModule }) => {
  return (
    <div className="flex-1">
      <Alert variant="warning">
        <div className="flex flex-1 items-center justify-between text-sm">
          <span>
            <Trans>Not enough</Trans> {collectModule?.amount?.asset?.symbol}{' '}
            <Trans>token balance</Trans>
          </span>
          <Link
            href={getUniswapURL(
              parseFloat(collectModule?.amount?.value),
              collectModule?.amount?.asset?.address
            )}
            rel="noreferer noreferrer"
            target="_blank"
            className="text-indigo-500"
          >
            <Trans>Swap</Trans>
          </Link>
        </div>
      </Alert>
    </div>
  )
}

export default BalanceAlert
