import { useAverageColor } from '@lenstube/browser'
import { LENSTUBE_BYTES_APP_ID, STATIC_ASSETS } from '@lenstube/constants'
import {
  getPublicationHlsUrl,
  getPublicationMediaUrl,
  getPublicationRawMediaUrl,
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl,
  truncate
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import VideoPlayer from '@lenstube/ui/VideoPlayer'
import clsx from 'clsx'
<<<<<<< HEAD
import type { Attribute, Publication } from 'lens'
=======
>>>>>>> upstream/main
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
<<<<<<< HEAD
import {
  Analytics,
  FALLBACK_COVER_URL,
  LENSTUBE_BYTES_APP_ID,
  TRACK
} from 'utils'
import { getValueFromTraitType } from 'utils/functions/getFromAttributes'
import {
  getPublicationHlsUrl,
  getPublicationMediaUrl,
  getPublicationRawMediaUrl
} from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeDStorageUrl from 'utils/functions/sanitizeDStorageUrl'
import truncate from 'utils/functions/truncate'
import useAverageColor from 'utils/hooks/useAverageColor'
import VideoPlayer from 'web-ui/VideoPlayer'
=======

>>>>>>> upstream/main
import MetaTags from './MetaTags'
import TopOverlay from './TopOverlay'

type Props = {
  video: Publication
}

const Video: React.FC<Props> = ({ video }) => {
  const { query } = useRouter()
  const [playerRef, setPlayerRef] = useState<HTMLMediaElement>()

  const isAutoPlay = Boolean(query.autoplay) && query.autoplay === '1'
  const isLoop = Boolean(query.loop) && query.loop === '1'
  const currentTime = Number(query.t ?? 0) ?? 0

  const [clicked, setClicked] = useState(isAutoPlay || currentTime !== 0)

  const isBytesVideo = video.appId === LENSTUBE_BYTES_APP_ID
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(video, true)),
    isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)

<<<<<<< HEAD
  const isLivestream = getValueFromTraitType(
    video.metadata?.attributes as Attribute[],
    'isLivestream'
  ) as 'true' | 'false'
  const livestreamPlaybackId = getValueFromTraitType(
    video.metadata?.attributes as Attribute[],
    'livestreamPlaybackId'
  )

  useEffect(() => {
    Analytics.track(TRACK.EMBED_VIDEO.LOADED)
  }, [])
=======
  // useEffect(() => {
  //   Analytics.track(TRACK.EMBED_VIDEO.LOADED)
  // }, [])
>>>>>>> upstream/main

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) {
      return null
    }
    setPlayerRef(ref)
  }

  useEffect(() => {
    if (playerRef && clicked) {
      playerRef.autoplay = true
      playerRef?.play().catch(() => {})
    }
  }, [playerRef, clicked, isAutoPlay])

  const onClickOverlay = () => {
    setClicked(true)
  }

  return (
    <div className="group relative h-screen w-screen overflow-x-hidden">
      <MetaTags
        title={truncate(video?.metadata?.name as string, 60)}
        description={truncate(video?.metadata?.description as string, 100)}
        image={thumbnailUrl}
        videoUrl={getPublicationMediaUrl(video)}
      />
      {clicked ? (
        <VideoPlayer
          refCallback={refCallback}
          permanentUrl={getPublicationRawMediaUrl(video)}
          hlsUrl={getPublicationHlsUrl(video)}
          posterUrl={thumbnailUrl}
          currentTime={currentTime}
          options={{
            autoPlay: isAutoPlay,
            muted: isAutoPlay,
            loop: isLoop,
            loadingSpinner: true,
            isCurrentlyShown: true,
            maxHeight: true
          }}
          isLivestream={isLivestream}
          livestreamPlaybackId={livestreamPlaybackId}
        />
      ) : (
        <div className="flex h-full w-full justify-center">
          <img
            src={thumbnailUrl}
            className={clsx(
              'w-full bg-gray-100 object-center dark:bg-gray-900',
              isBytesVideo ? 'object-contain' : 'object-cover'
            )}
            style={{
              backgroundColor: backgroundColor && `${backgroundColor}95`
            }}
            alt={video.metadata.name ?? video.profile.handle}
            draggable={false}
          />
          <div
            className="absolute grid h-full w-full place-items-center"
            tabIndex={0}
            onClick={onClickOverlay}
            role="button"
          >
            <button className="rounded-full bg-gradient-to-r from-indigo-200 to-indigo-400 p-2 shadow-2xl xl:p-5">
              <img
                className="h-8 w-8 pl-1"
<<<<<<< HEAD
                src={imageCdn(`${FALLBACK_COVER_URL}`, 'avatar')}
=======
                src={imageCdn(
                  `${STATIC_ASSETS}/images/brand/lenstube.svg`,
                  'AVATAR'
                )}
>>>>>>> upstream/main
                alt="play"
                draggable={false}
              />
            </button>
          </div>
        </div>
      )}
      <TopOverlay playerRef={playerRef} video={video} clicked={clicked} />
    </div>
  )
}

export default Video
