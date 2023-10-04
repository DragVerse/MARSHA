import Tooltip from '@components/UIElements/Tooltip'
import { useAverageColor } from '@lenstube/browser'
import { STATIC_ASSETS } from '@lenstube/constants'
import {
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl,
  trimLensHandle
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import {
  PublicationDetailsDocument,
  useHasTxHashBeenIndexedQuery,
  usePublicationDetailsLazyQuery,
  useTxIdToTxHashLazyQuery
} from '@lenstube/lens'
import { useApolloClient } from '@lenstube/lens/apollo'
import type { QueuedVideoType } from '@lenstube/lens/custom-types'
import useAppStore, { UPLOADED_VIDEO_FORM_DEFAULTS } from '@lib/store'
import useAuthPersistStore from '@lib/store/auth'
import usePersistStore from '@lib/store/persist'
import { t } from '@lingui/macro'
import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'

import Badge from '../Badge'

type Props = {
  queuedVideo: QueuedVideoType
}

const QueuedVideo: FC<Props> = ({ queuedVideo }) => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

  const queuedVideos = usePersistStore((state) => state.queuedVideos)
  const setQueuedVideos = usePersistStore((state) => state.setQueuedVideos)

  const { cache } = useApolloClient()
  const [getTxnHash] = useTxIdToTxHashLazyQuery()

  const thumbnailUrl = imageCdn(
    uploadedVideo.isSensitiveContent
      ? `${STATIC_ASSETS}/images/sensor-blur.png`
      : sanitizeDStorageUrl(queuedVideo.thumbnailUrl),
    uploadedVideo.isByteVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )
  const { color: backgroundColor } = useAverageColor(
    thumbnailUrl,
    uploadedVideo.isByteVideo
  )

  const removeFromQueue = () => {
    setUploadedVideo(UPLOADED_VIDEO_FORM_DEFAULTS)
    if (!queuedVideo.txnId) {
      return setQueuedVideos(
        queuedVideos.filter((q) => q.txnHash !== queuedVideo.txnHash)
      )
    }
    setQueuedVideos(queuedVideos.filter((q) => q.txnId !== queuedVideo.txnId))
  }

  const [getPublication] = usePublicationDetailsLazyQuery({
    onCompleted: (data) => {
      if (data.publication) {
        cache.modify({
          fields: {
            publications() {
              cache.writeQuery({
                data: { publication: data?.publication },
                query: PublicationDetailsDocument
              })
            }
          }
        })
        removeFromQueue()
      }
    }
  })

  const getVideoByTxnId = async () => {
    const { data } = await getTxnHash({
      variables: {
        txId: queuedVideo.txnId
      }
    })
    if (data?.txIdToTxHash) {
      getPublication({
        variables: { request: { txHash: data?.txIdToTxHash } }
      })
    }
  }

  const { stopPolling } = useHasTxHashBeenIndexedQuery({
    variables: {
      request: { txId: queuedVideo?.txnId, txHash: queuedVideo?.txnHash }
    },
    skip: !queuedVideo?.txnId?.length && !queuedVideo?.txnHash?.length,
    pollInterval: 1000,
    notifyOnNetworkStatusChange: true,
    onCompleted: async (data) => {
      if (data.hasTxHashBeenIndexed.__typename === 'TransactionError') {
        return removeFromQueue()
      }
      if (
        data?.hasTxHashBeenIndexed?.__typename === 'TransactionIndexedResult' &&
        data?.hasTxHashBeenIndexed?.indexed
      ) {
        stopPolling()
        if (queuedVideo.txnHash) {
          return getPublication({
            variables: { request: { txHash: queuedVideo?.txnHash } }
          })
        }
        await getVideoByTxnId()
      }
    }
  })

  if (!queuedVideo?.txnId && !queuedVideo?.txnHash) {
    return null
  }

  return (
    <div className="cursor-wait">
      <Tooltip content={t`Indexing, please wait...`} placement="top">
        <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
          <img
            src={thumbnailUrl}
            className={clsx(
              'h-full w-full bg-gray-100 object-center dark:bg-gray-900 md:rounded-xl lg:h-full lg:w-full',
              uploadedVideo.isByteVideo ? 'object-contain' : 'object-cover'
            )}
            style={{
              backgroundColor: backgroundColor && `${backgroundColor}95`
            }}
            alt="thumbnail"
            draggable={false}
          />
        </div>
      </Tooltip>
      <div className="py-2">
        <div className="flex items-start space-x-2.5">
          <img
            className="h-8 w-8 rounded-full"
            src={getProfilePicture(selectedSimpleProfile as Profile)}
            alt={selectedSimpleProfile?.handle}
            draggable={false}
          />
          <div className="grid flex-1">
            <div className="flex w-full min-w-0 items-start justify-between space-x-1.5 pb-1">
              <span
                className="ultrawide:line-clamp-1 ultrawide:break-all line-clamp-2 break-words text-sm font-semibold"
                title={queuedVideo.title}
              >
                {queuedVideo.title}
              </span>
              <div className="p-1">
                <Tooltip content="Indexing" placement="top">
                  <span className="relative flex h-2 w-2 items-center justify-center">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  </span>
                </Tooltip>
              </div>
            </div>
            <span className="flex w-fit items-center space-x-0.5 text-[13px] opacity-70">
              <span>{trimLensHandle(selectedSimpleProfile?.handle)}</span>
              <Badge id={selectedSimpleProfile?.id} size="xs" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QueuedVideo
