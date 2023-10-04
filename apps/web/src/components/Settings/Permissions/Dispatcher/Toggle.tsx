import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { Button } from '@components/UIElements/Button'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import usePendingTxn from '@hooks/usePendingTxn'
import { Analytics, TRACK } from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  OLD_LENS_RELAYER_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import { getIsDispatcherEnabled, getSignature } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import {
  useBroadcastMutation,
  useCreateSetDispatcherTypedDataMutation,
  useProfileLazyQuery
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

const Toggle = () => {
  const [loading, setLoading] = useState(false)
  const activeChannel = useChannelStore((state) => state.activeChannel)
  const setActiveChannel = useChannelStore((state) => state.setActiveChannel)
  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)
  const canUseRelay = getIsDispatcherEnabled(activeChannel)
  const usingOldDispatcher =
    activeChannel?.dispatcher?.address?.toLocaleLowerCase() ===
    OLD_LENS_RELAYER_ADDRESS.toLocaleLowerCase()
  const handleWrongNetwork = useHandleWrongNetwork()

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write, data: writeData } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'setDispatcher',
    onSuccess: () => {
      setUserSigNonce(userSigNonce + 1)
    },
    onError: (error) => {
      onError(error)
      setUserSigNonce(userSigNonce - 1)
    }
  })

  const [broadcast, { data: broadcastData }] = useBroadcastMutation({
    onError
  })

  const { indexed } = usePendingTxn({
    txHash: writeData?.hash,
    txId:
      broadcastData?.broadcast.__typename === 'RelayerResult'
        ? broadcastData?.broadcast?.txId
        : undefined
  })

  const [refetchChannel] = useProfileLazyQuery({
    onCompleted: (data) => {
      const channel = data?.profile as Profile
      setActiveChannel(channel)
    }
  })

  useEffect(() => {
    if (indexed) {
      toast.success(`Dispatcher ${canUseRelay ? t`disabled` : t`enabled`}`)
      refetchChannel({
        variables: {
          request: { handle: activeChannel?.handle }
        },
        fetchPolicy: 'no-cache'
      })
      setLoading(false)
      Analytics.track(TRACK.DISPATCHER.TOGGLE)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [createDispatcherTypedData] = useCreateSetDispatcherTypedDataMutation({
    onCompleted: async ({ createSetDispatcherTypedData }) => {
      const { id, typedData } = createSetDispatcherTypedData
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync(getSignature(typedData))
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError') {
          const { profileId, dispatcher } = typedData.value
          return write?.({
            args: [profileId, dispatcher]
          })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })
  const onClick = () => {
    if (handleWrongNetwork()) {
      return
    }
    setLoading(true)
    createDispatcherTypedData({
      variables: {
        request: {
          profileId: activeChannel?.id,
          enable: !canUseRelay
        }
      }
    })
  }

  const getButtonText = () => {
    if (usingOldDispatcher) {
      return t`Upgrade`
    } else if (canUseRelay) {
      return t`Disable`
    } else {
      return t`Enable`
    }
  }

  return (
    <Button
      variant={canUseRelay ? 'danger' : 'primary'}
      onClick={onClick}
      loading={loading}
    >
      {getButtonText()} <Trans>dispatcher</Trans>
    </Button>
  )
}

export default Toggle
