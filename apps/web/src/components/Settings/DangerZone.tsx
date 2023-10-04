import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import Badge from '@components/Common/Badge'
import { Button } from '@components/UIElements/Button'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import {
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import { formatNumber, getProfilePicture } from '@lenstube/generic'
import type { CreateBurnProfileBroadcastItemResult } from '@lenstube/lens'
import { useCreateBurnProfileTypedDataMutation } from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import { signOut } from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Custom404 from 'src/pages/404'
import { useContractWrite, useWaitForTransaction } from 'wagmi'

const DangerZone: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [txnHash, setTxnHash] = useState<`0x${string}`>()
  const activeChannel = useChannelStore((state) => state.activeChannel)
  const handleWrongNetwork = useHandleWrongNetwork()

  const onError = (error: CustomErrorWithData) => {
    setLoading(false)
    toast.error(error?.data?.message ?? error?.message)
  }

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'burn',
    onError,
    onSuccess: (data) => setTxnHash(data.hash)
  })

  useWaitForTransaction({
    enabled: txnHash && txnHash.length > 0,
    hash: txnHash,
    onSuccess: () => {
      toast.success(t`Channel deleted`)
      setLoading(false)
      signOut()
      location.href = '/'
    },
    onError
  })

  const [createBurnProfileTypedData] = useCreateBurnProfileTypedDataMutation({
    onCompleted: async (data) => {
      const { typedData } =
        data.createBurnProfileTypedData as CreateBurnProfileBroadcastItemResult
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const { tokenId } = typedData.value
        write?.({ args: [tokenId] })
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const onClickDelete = () => {
    if (handleWrongNetwork()) {
      return
    }
    setLoading(true)
    createBurnProfileTypedData({
      variables: {
        request: { profileId: activeChannel?.id }
      }
    })
  }

  if (!activeChannel) {
    return <Custom404 />
  }

  return (
    <div className="bg-theme rounded-lg p-4 dark:divide-gray-900">
      <div className="mb-5 flex flex-wrap items-center justify-between rounded-xl border p-4 dark:border-gray-700">
        <div className="flex items-center">
          <div className="mr-3 mt-0.5 flex-none">
            <img
              src={getProfilePicture(activeChannel, 'AVATAR')}
              className="h-9 w-9 rounded-full"
              draggable={false}
              alt={activeChannel?.handle}
            />
          </div>
          <div className="flex flex-col">
            {activeChannel.name && (
              <h6 className="font-medium">{activeChannel.name}</h6>
            )}
            <span className="flex items-center space-x-1">
              <span className="text-sm">{activeChannel?.handle}</span>
              <Badge id={activeChannel?.id} size="xs" />
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <span>
            {formatNumber(activeChannel.stats.totalPosts)}{' '}
            <small>publications</small>
          </span>
          <span>
            {formatNumber(activeChannel.stats.totalFollowers)}{' '}
            <small>subscribers</small>
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between px-2">
        <div className="mb-4">
          <h1 className="mb-1 text-xl font-semibold">Delete Channel</h1>
          <p className="text-sm opacity-80">
            Delete your channel and its data from Lens.
            <span className="ml-1 text-sm text-red-500">
              It can not be reverted
            </span>
          </p>
        </div>
        <Button
          loading={loading}
          onClick={() => onClickDelete()}
          variant="danger"
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

export default DangerZone
