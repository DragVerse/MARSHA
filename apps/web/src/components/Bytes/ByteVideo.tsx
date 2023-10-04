import CollectVideo from '@components/Watch/CollectVideo'
import { Analytics, TRACK, useAverageColor } from '@lenstube/browser'
import {
  getPublicationHlsUrl,
  getPublicationRawMediaUrl,
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import VideoPlayer from '@lenstube/ui/VideoPlayer'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
<<<<<<< HEAD
import { Analytics, TRACK } from 'utils'
import {
  getPublicationHlsUrl,
  getPublicationRawMediaUrl
} from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeDStorageUrl from 'utils/functions/sanitizeDStorageUrl'
import useAverageColor from 'utils/hooks/useAverageColor'
import VideoPlayer from 'web-ui/VideoPlayer'
=======
>>>>>>> upstream/main

import BottomOverlay from './BottomOverlay'
import ByteActions from './ByteActions'
import TopOverlay from './TopOverlay'

type Props = {
  video: Publication
  currentViewingId: string
  intersectionCallback: (id: string) => void
}

const ByteVideo: FC<Props> = ({
  video,
  currentViewingId,
  intersectionCallback
}) => {
  const videoRef = useRef<HTMLMediaElement>()
  const intersectionRef = useRef<HTMLDivElement>(null)
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(video, true)),
    'THUMBNAIL_V'
  )
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, true)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const playVideo = () => {
    if (!videoRef.current) {
      return
    }
    videoRef.current.currentTime = 0
    videoRef.current.volume = 1
    videoRef.current.autoplay = true
    videoRef.current?.play().catch(() => {})
    Analytics.track(TRACK.PLAY_BYTE_VIDEO)
  }

  const observer = new IntersectionObserver((data) => {
    if (data[0].target.id && data[0].isIntersecting) {
      intersectionCallback(data[0].target.id)
      const nextUrl = `${location.origin}/bytes/${video?.id}`
      history.replaceState({ path: nextUrl }, '', nextUrl)
    }
  })

  useEffect(() => {
    if (intersectionRef.current) {
      observer.observe(intersectionRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pauseVideo = () => {
    if (!videoRef.current) {
      return
    }
    videoRef.current.volume = 0
    videoRef.current?.pause()
    videoRef.current.autoplay = false
  }

  const onClickVideo = () => {
    if (videoRef.current?.paused) {
      playVideo()
    } else {
      pauseVideo()
    }
  }

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) {
      return
    }
    videoRef.current = ref
    playVideo()
  }

  if (!video) {
    return null
  }

  return (
    <div
      className="flex snap-center justify-center md:mt-6"
      data-testid="byte-video"
    >
      <div className="relative">
        <div
          className="ultrawide:w-[650px] flex h-screen w-screen min-w-[250px] items-center overflow-hidden bg-black md:h-[calc(100vh-145px)] md:w-[400px] md:rounded-xl"
          style={{
            backgroundColor: backgroundColor ? backgroundColor : undefined
          }}
        >
          <div
            className="absolute top-[50%]"
            ref={intersectionRef}
            id={video?.id}
          />
          {currentViewingId === video.id ? (
            <VideoPlayer
              address={selectedSimpleProfile?.ownedBy}
              refCallback={refCallback}
              permanentUrl={getPublicationRawMediaUrl(video)}
              hlsUrl={getPublicationHlsUrl(video)}
              posterUrl={thumbnailUrl}
              ratio="9to16"
              showControls={false}
              options={{
                autoPlay: false,
                muted: false,
                loop: true,
                loadingSpinner: false,
                isCurrentlyShown: currentViewingId === video.id
              }}
              isLivestream={'false'}
            />
          ) : (
            <div className="h-full w-full">
              <img
                className="w-full object-cover"
                src={thumbnailUrl}
                alt="thumbnail"
                draggable={false}
              />
              <span className="invisible absolute">
                <VideoPlayer
                  permanentUrl={getPublicationRawMediaUrl(video)}
                  hlsUrl={getPublicationHlsUrl(video)}
                  showControls={false}
                  options={{
                    autoPlay: false,
                    muted: true,
                    loadingSpinner: false,
                    isCurrentlyShown: currentViewingId === video.id
                  }}
                  isLivestream={'false'}
                />
              </span>
            </div>
          )}
        </div>
        <TopOverlay onClickVideo={onClickVideo} />
        <BottomOverlay video={video} />
        <div className="absolute bottom-[15%] right-2 z-[1] md:hidden">
          <ByteActions video={video} />
          {video?.collectModule?.__typename !==
            'RevertCollectModuleSettings' && (
            <div className="pt-3 text-center text-white md:text-gray-500">
              <CollectVideo video={video} variant="none" />
              <div className="text-xs">
                {video.stats?.totalAmountOfCollects || t`Collect`}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="hidden md:flex">
        <ByteActions video={video} />
      </div>
    </div>
  )
}

export default React.memo(ByteVideo)
