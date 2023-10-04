import { SuggestedVideosShimmer } from '@components/Shimmers/VideoDetailShimmer'
import {
  ALLOWED_APP_IDS,
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { Loader } from '@lenstube/ui'
import useAuthPersistStore from '@lib/store/auth'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useEffect } from 'react'
import { useInView } from 'react-cool-inview'

import SuggestedVideoCard from './SuggestedVideoCard'

const request = {
  sortCriteria: PublicationSortCriteria.CuratedProfiles,
  limit: 30,
  sources: IS_MAINNET
    ? [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS]
    : undefined,
  publicationTypes: [PublicationTypes.Post],
  metadata: { mainContentFocus: [PublicationMainFocus.Video] },
  noRandomize: false,
  customFilters: LENS_CUSTOM_FILTERS
}

const SuggestedVideos: FC = () => {
  const {
    query: { id }
  } = useRouter()

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const { data, loading, error, fetchMore, refetch } = useExploreQuery({
    variables: {
      request,
      channelId: selectedSimpleProfile?.id ?? null
    }
  })

  const videos = data?.explorePublications?.items as Publication[]
  const pageInfo = data?.explorePublications?.pageInfo

  useEffect(() => {
    refetch()
  }, [id, refetch])

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          },
          channelId: selectedSimpleProfile?.id ?? null
        }
      })
    }
  })

  return (
    <>
      {loading && <SuggestedVideosShimmer />}
      {!error && !loading && videos.length ? (
        <div className="pb-3">
          <div
            className="space-y-3 md:grid md:grid-cols-2 md:gap-3 lg:flex lg:flex-col lg:gap-0"
            data-testid="watch-video-suggestions"
          >
            {videos?.map(
              (video: Publication) =>
                !video.hidden &&
                video.id !== id && (
                  <SuggestedVideoCard video={video} key={video?.id} />
                )
            )}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </div>
      ) : null}
    </>
  )
}

export default SuggestedVideos
