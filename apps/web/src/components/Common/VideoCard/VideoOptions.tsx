import { LENS_PERIPHERY_ABI } from '@abis/LensPeriphery'
import Confirm from '@components/UIElements/Confirm'
import DropMenu from '@components/UIElements/DropMenu'
import { Menu } from '@headlessui/react'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { Analytics, TRACK } from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENS_PERIPHERY_ADDRESS,
  LENSTUBE_APP_ID,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import {
  getChannelCoverPicture,
  getSignature,
  getValueFromKeyInAttributes,
  uploadToAr
} from '@lenstube/generic'
import type {
  Attribute,
  CreatePublicSetProfileMetadataUriRequest,
  Publication
} from '@lenstube/lens'
import {
  PublicationMetadataDisplayTypes,
  useAddPublicationNotInterestedMutation,
  useAddPublicationToBookmarkMutation,
  useBroadcastMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation,
  useHidePublicationMutation,
  useRemovePublicationFromBookmarkMutation,
  useRemovePublicationNotInterestedMutation
} from '@lenstube/lens'
import { useApolloClient } from '@lenstube/lens/apollo'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import clsx from 'clsx'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'

import FlagOutline from '../Icons/FlagOutline'
import ForbiddenOutline from '../Icons/ForbiddenOutline'
import PinOutline from '../Icons/PinOutline'
import SaveToListOutline from '../Icons/SaveToListOutline'
import ShareOutline from '../Icons/ShareOutline'
import ThreeDotsOutline from '../Icons/ThreeDotsOutline'
import TrashOutline from '../Icons/TrashOutline'

type Props = {
  video: Publication
  setShowShare: React.Dispatch<boolean>
  setShowReport: React.Dispatch<boolean>
  showOnHover?: boolean
}

const VideoOptions: FC<Props> = ({
  video,
  setShowShare,
  setShowReport,
  showOnHover = true
}) => {
  const { openConnectModal } = useConnectModal()
  const handleWrongNetwork = useHandleWrongNetwork()
  const [showConfirm, setShowConfirm] = useState(false)

  const { cache } = useApolloClient()

  const activeChannel = useChannelStore((state) => state.activeChannel)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const isVideoOwner = activeChannel?.id === video?.profile?.id
  const pinnedVideoId = getValueFromKeyInAttributes(
    activeChannel?.attributes,
    'pinnedPublicationId'
  )

  const [hideVideo] = useHidePublicationMutation({
    update(cache) {
      const normalizedId = cache.identify({ id: video?.id, __typename: 'Post' })
      cache.evict({ id: normalizedId })
      cache.gc()
    },
    onCompleted: () => {
      toast.success(t`Video deleted`)
      Analytics.track(TRACK.PUBLICATION.DELETE, {
        publication_type: video.__typename?.toLowerCase()
      })
    }
  })

  const onHideVideo = () => {
    hideVideo({ variables: { request: { publicationId: video?.id } } })
  }

  const onClickReport = () => {
    if (!selectedSimpleProfile?.id) {
      return openConnectModal?.()
    }
    if (handleWrongNetwork()) {
      return
    }

    setShowReport(true)
  }

  const otherAttributes =
    (activeChannel?.attributes as Attribute[])
      ?.filter((attr) => !['pinnedPublicationId', 'app'].includes(attr.key))
      .map(({ traitType, key, value, displayType }) => ({
        traitType,
        key,
        value,
        displayType
      })) ?? []

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return
    }
    toast.success(t`Transaction submitted`)
    Analytics.track(TRACK.PUBLICATION.PIN)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    address: LENS_PERIPHERY_ADDRESS,
    abi: LENS_PERIPHERY_ABI,
    functionName: 'setProfileMetadataURI',
    onError,
    onSuccess: () => onCompleted()
  })

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  })

  const [createSetProfileMetadataViaDispatcher] =
    useCreateSetProfileMetadataViaDispatcherMutation({
      onError,
      onCompleted: ({ createSetProfileMetadataViaDispatcher }) =>
        onCompleted(createSetProfileMetadataViaDispatcher.__typename)
    })

  const [createSetProfileMetadataTypedData] =
    useCreateSetProfileMetadataTypedDataMutation({
      onCompleted: async (data) => {
        const { typedData, id } = data.createSetProfileMetadataTypedData
        try {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)
          const signature = await signTypedDataAsync(getSignature(typedData))
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.__typename === 'RelayError') {
            const { profileId, metadata } = typedData.value
            return write?.({ args: [profileId, metadata] })
          }
        } catch {}
      },
      onError
    })

  const createTypedData = (
    request: CreatePublicSetProfileMetadataUriRequest
  ) => {
    createSetProfileMetadataTypedData({
      variables: { request }
    })
  }

  const createViaDispatcher = async (
    request: CreatePublicSetProfileMetadataUriRequest
  ) => {
    const { data } = await createSetProfileMetadataViaDispatcher({
      variables: { request }
    })
    if (
      data?.createSetProfileMetadataViaDispatcher.__typename === 'RelayError'
    ) {
      createTypedData(request)
    }
  }

  const onPinVideo = async () => {
    if (!activeChannel) {
      return openConnectModal?.()
    }
    if (handleWrongNetwork()) {
      return
    }

    try {
      toast.loading(t`Pinning video...`)
      const metadataUri = await uploadToAr({
        version: '1.0.0',
        metadata_id: uuidv4(),
        name: activeChannel?.name ?? '',
        bio: activeChannel?.bio ?? '',
        cover_picture: getChannelCoverPicture(activeChannel),
        attributes: [
          ...otherAttributes,
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'pinnedPublicationId',
            key: 'pinnedPublicationId',
            value: video.id
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'app',
            key: 'app',
            value: LENSTUBE_APP_ID
          }
        ]
      })
      const request = {
        profileId: activeChannel?.id,
        metadata: metadataUri
      }
      const canUseDispatcher =
        activeChannel?.dispatcher?.canUseRelay &&
        activeChannel.dispatcher.sponsor
      if (!canUseDispatcher) {
        return createTypedData(request)
      }
      createViaDispatcher(request)
    } catch {}
  }

  const modifyInterestCache = (notInterested: boolean) => {
    cache.modify({
      id: `Post:${video?.id}`,
      fields: { notInterested: () => notInterested }
    })
    toast.success(
      notInterested
        ? t`Video marked as not interested`
        : t`Video removed from not interested`
    )
    Analytics.track(TRACK.PUBLICATION.TOGGLE_INTEREST)
  }

  const modifyListCache = (saved: boolean) => {
    cache.modify({
      id: `Post:${video?.id}`,
      fields: { bookmarked: () => saved }
    })
    toast.success(
      saved ? t`Video added to your list` : t`Video removed from your list`
    )
    Analytics.track(TRACK.PUBLICATION.TOGGLE_INTEREST)
  }

  const [addNotInterested] = useAddPublicationNotInterestedMutation({
    onError,
    onCompleted: () => modifyInterestCache(true)
  })

  const [removeNotInterested] = useRemovePublicationNotInterestedMutation({
    onError,
    onCompleted: () => modifyInterestCache(false)
  })

  const [saveVideoToList] = useAddPublicationToBookmarkMutation({
    onError,
    onCompleted: () => modifyListCache(true)
  })

  const [removeVideoFromList] = useRemovePublicationFromBookmarkMutation({
    onError,
    onCompleted: () => modifyListCache(false)
  })

  const notInterested = () => {
    if (!selectedSimpleProfile?.id) {
      return openConnectModal?.()
    }

    if (video.notInterested) {
      removeNotInterested({
        variables: {
          request: {
            profileId: selectedSimpleProfile?.id,
            publicationId: video.id
          }
        }
      })
    } else {
      addNotInterested({
        variables: {
          request: {
            profileId: selectedSimpleProfile?.id,
            publicationId: video.id
          }
        }
      })
    }
  }

  const saveToList = () => {
    if (!selectedSimpleProfile?.id) {
      return openConnectModal?.()
    }
    if (video.bookmarked) {
      removeVideoFromList({
        variables: {
          request: {
            profileId: selectedSimpleProfile?.id,
            publicationId: video.id
          }
        }
      })
    } else {
      saveVideoToList({
        variables: {
          request: {
            profileId: selectedSimpleProfile?.id,
            publicationId: video.id
          }
        }
      })
    }
  }

  return (
    <>
      <Confirm
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        action={onHideVideo}
      />
      <DropMenu
        trigger={
          <div
            className={clsx(
              'py-1 group-hover:visible dark:text-white md:text-inherit',
              showOnHover && 'lg:invisible'
            )}
            role="button"
          >
            <ThreeDotsOutline className="h-3.5 w-3.5" />
          </div>
        }
      >
        <div className="bg-secondary mt-0.5 w-40 overflow-hidden rounded-xl border border-gray-200 p-1 shadow dark:border-gray-800">
          <div className="flex flex-col rounded-lg text-sm transition duration-150 ease-in-out">
            {isVideoOwner && (
              <>
                {pinnedVideoId !== video.id && (
                  <Menu.Item
                    as="button"
                    className="flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => onPinVideo()}
                  >
                    <PinOutline className="h-3.5 w-3.5" />
                    <span className="whitespace-nowrap">
                      <Trans>Pin Video</Trans>
                    </span>
                  </Menu.Item>
                )}
                <Menu.Item
                  as="button"
                  className="inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 text-red-500 opacity-100 hover:bg-red-100 dark:hover:bg-red-900"
                  onClick={() => setShowConfirm(true)}
                >
                  <TrashOutline className="h-3.5 w-3.5" />
                  <span className="whitespace-nowrap">
                    <Trans>Delete</Trans>
                  </span>
                </Menu.Item>
              </>
            )}
            <Menu.Item
              as="button"
              onClick={() => setShowShare(true)}
              className="inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ShareOutline className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">
                <Trans>Share</Trans>
              </span>
            </Menu.Item>

            {!isVideoOwner && (
              <>
                <Menu.Item
                  as="button"
                  onClick={() => onClickReport()}
                  className="hhover:opacity-100 inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FlagOutline className="h-3.5 w-3.5" />
                  <span className="whitespace-nowrap">
                    <Trans>Report</Trans>
                  </span>
                </Menu.Item>
                <Menu.Item
                  as="button"
                  onClick={() => saveToList()}
                  className="inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <SaveToListOutline className="h-3.5 w-3.5 flex-none" />
                  <span className="truncate whitespace-nowrap">
                    {video.bookmarked ? (
                      <Trans>Remove from List</Trans>
                    ) : (
                      <Trans>Save to List</Trans>
                    )}
                  </span>
                </Menu.Item>
                <Menu.Item
                  as="button"
                  onClick={() => notInterested()}
                  className="inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ForbiddenOutline className="h-3.5 w-3.5" />
                  <span className="whitespace-nowrap">
                    {video.notInterested ? (
                      <Trans>Undo Interest</Trans>
                    ) : (
                      <Trans>Not Interested</Trans>
                    )}
                  </span>
                </Menu.Item>
              </>
            )}
          </div>
        </div>
      </DropMenu>
    </>
  )
}

export default VideoOptions
