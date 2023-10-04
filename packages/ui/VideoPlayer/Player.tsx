import type { AspectRatio } from '@livepeer/react'
import { Player } from '@livepeer/react'
import type { FC } from 'react'
import React from 'react'

export interface PlayerProps {
  playerRef?: (ref: HTMLMediaElement) => void
  permanentUrl: string
  posterUrl?: string
  hlsUrl?: string
  ratio?: AspectRatio
  showControls?: boolean
<<<<<<< HEAD:packages/web-ui/VideoPlayer/Player.tsx
  isLivestream?: 'true' | 'false'
  livestreamPlaybackId?: string
=======
  address?: string
>>>>>>> upstream/main:packages/ui/VideoPlayer/Player.tsx
  options: {
    autoPlay?: boolean
    muted?: boolean
    loop?: boolean
    maxHeight?: boolean
    loadingSpinner: boolean
    isCurrentlyShown: boolean
  }
}

const PlayerInstance: FC<PlayerProps> = ({
  ratio,
  permanentUrl,
  hlsUrl,
  posterUrl,
  playerRef,
  options,
<<<<<<< HEAD:packages/web-ui/VideoPlayer/Player.tsx
  showControls,
  isLivestream,
  livestreamPlaybackId
=======
  address,
  showControls
>>>>>>> upstream/main:packages/ui/VideoPlayer/Player.tsx
}) => {
  return isLivestream === 'true' ? (
    <Player
      src={hlsUrl ?? permanentUrl}
<<<<<<< HEAD:packages/web-ui/VideoPlayer/Player.tsx
      playbackId={livestreamPlaybackId}
      poster={posterUrl}
      showTitle={false}
      objectFit="contain"
      aspectRatio={ratio}
      showPipButton
      // mediaElementRef={playerRef}
      loop={options?.loop ?? true}
      showUploadingIndicator={false}
      muted={options?.muted ?? false}
      controls={{ defaultVolume: 1 }}
      autoPlay={options?.autoPlay ?? false}
      showLoadingSpinner={options?.loadingSpinner}
      autoUrlUpload={{
        fallback: true,
        ipfsGateway: IPFS_GATEWAY_URL
      }}
    >
      {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
      {!showControls ? <></> : null}
    </Player>
  ) : (
    <Player
      src={hlsUrl ?? permanentUrl}
=======
>>>>>>> upstream/main:packages/ui/VideoPlayer/Player.tsx
      poster={posterUrl}
      showTitle={false}
      objectFit="contain"
      aspectRatio={ratio}
      showPipButton
      viewerId={address}
      mediaElementRef={playerRef}
      loop={options.loop ?? true}
      showUploadingIndicator={false}
      muted={options?.muted ?? false}
      controls={{ defaultVolume: 1 }}
      autoPlay={options.autoPlay ?? false}
      showLoadingSpinner={options.loadingSpinner}
      _isCurrentlyShown={options.isCurrentlyShown}
      // autoUrlUpload={
      //   IS_PRODUCTION && {
      //     fallback: true,
      //     ipfsGateway: IPFS_GATEWAY_URL
      //   }
      // }
    >
      {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
      {!showControls ? <></> : null}
    </Player>
  )
}

export default React.memo(PlayerInstance)
