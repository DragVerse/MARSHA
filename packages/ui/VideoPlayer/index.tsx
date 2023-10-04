<<<<<<< HEAD:packages/web-ui/VideoPlayer/index.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react'
=======
import type { FC } from 'react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

>>>>>>> upstream/main:packages/ui/VideoPlayer/index.tsx
import type { PlayerProps } from './Player'
import PlayerInstance from './Player'
import SensitiveWarning from './SensitiveWarning'

interface Props extends PlayerProps {
  hlsUrl: string
  currentTime?: number
  isSensitiveContent?: boolean
<<<<<<< HEAD:packages/web-ui/VideoPlayer/index.tsx
  hlsUrl: string
  isLivestream: 'true' | 'false'
  livestreamPlaybackId?: string
}

const VideoPlayer: React.FC<Props> = ({
  permanentUrl,
  hlsUrl,
  posterUrl,
  ratio = '16to9',
  isSensitiveContent,
  currentTime = 0,
  refCallback,
  publicationId,
  options,
  showControls = true,
  isLivestream = 'false',
  livestreamPlaybackId
=======
  refCallback?: (ref: HTMLMediaElement) => void
}

const VideoPlayer: FC<Props> = ({
  hlsUrl,
  address,
  options,
  posterUrl,
  refCallback,
  permanentUrl,
  ratio = '16to9',
  currentTime = 0,
  isSensitiveContent,
  showControls = true
>>>>>>> upstream/main:packages/ui/VideoPlayer/index.tsx
}) => {
  const playerRef = useRef<HTMLMediaElement>()
  const [sensitiveWarning, setSensitiveWarning] = useState(isSensitiveContent)

  const mediaElementRef = useCallback((ref: HTMLMediaElement) => {
    refCallback?.(ref)
    playerRef.current = ref
    playerRef.current.currentTime = Number(currentTime || 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!playerRef.current) {
      return
    }
    playerRef.current.currentTime = Number(currentTime || 0)
  }, [currentTime])

  const onContextClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div className={`w-full ${options.maxHeight && 'h-full'}`}>
      {sensitiveWarning ? (
        <SensitiveWarning acceptWarning={() => setSensitiveWarning(false)} />
      ) : (
        <div
          onContextMenu={onContextClick}
          className={`relative flex ${options.maxHeight && 'h-full'}`}
        >
          <PlayerInstance
<<<<<<< HEAD:packages/web-ui/VideoPlayer/index.tsx
            posterUrl={posterUrl}
            permanentUrl={permanentUrl}
            hlsUrl={hlsUrl}
=======
>>>>>>> upstream/main:packages/ui/VideoPlayer/index.tsx
            ratio={ratio}
            hlsUrl={hlsUrl}
            options={options}
            address={address}
            posterUrl={posterUrl}
            playerRef={mediaElementRef}
            permanentUrl={permanentUrl}
            showControls={showControls}
            isLivestream={isLivestream}
            livestreamPlaybackId={livestreamPlaybackId}
          />
        </div>
      )}
    </div>
  )
}

export default React.memo(VideoPlayer)
