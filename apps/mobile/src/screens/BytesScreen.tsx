import { LENS_CUSTOM_FILTERS, LENSTUBE_BYTES_APP_ID } from '@lenstube/constants'
import type { ExplorePublicationRequest, Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback, useRef, useState } from 'react'
import type { ViewToken } from 'react-native'
import { ActivityIndicator } from 'react-native'

import ByteCard from '../components/bytes/ByteCard'

export const BytesScreen = (props: BytesScreenProps): JSX.Element => {
  const {
    navigation: {}
  } = props
  const scrollRef = useRef<FlashList<Publication>>(null)
  //@ts-expect-error FlashList as type is not supported
  useScrollToTop(scrollRef)

  const [activeVideoIndex, setActiveVideoIndex] = useState(0)

  const renderItem = useCallback(
    ({ item, index }: { item: Publication; index: number }) => (
      <ByteCard byte={item} isActive={activeVideoIndex === index} />
    ),
    [activeVideoIndex]
  )

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      let viewableItem = viewableItems[0]
      if (viewableItems.length > 4) {
        viewableItem = viewableItems[Math.floor(viewableItems.length) / 2]
      }
      if (viewableItem) {
        const visibleIndex = Number(viewableItem.index)
        setActiveVideoIndex(visibleIndex)
      }
    },
    []
  )

  const request: ExplorePublicationRequest = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 50,
    noRandomize: false,
    sources: [LENSTUBE_BYTES_APP_ID],
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }
  const { data, loading, fetchMore } = useExploreQuery({
    variables: { request }
  })
  const bytes = data?.explorePublications?.items as Publication[]
  const pageInfo = data?.explorePublications?.pageInfo

  const fetchMoreVideos = async () => {
    await fetchMore({
      variables: {
        request: {
          ...request,
          cursor: pageInfo?.next
        }
      }
    })
  }

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  return (
    <FlashList
      ref={scrollRef}
      data={bytes}
      pagingEnabled
      renderItem={renderItem}
      estimatedItemSize={bytes.length}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, i) => `${item.id}_${i}`}
      onEndReached={pageInfo?.next ? fetchMoreVideos : null}
      extraData={activeVideoIndex} // To handle rerender if anything changes in data
      onViewableItemsChanged={onViewableItemsChanged}
      onEndReachedThreshold={0.8}
      removeClippedSubviews
      ListFooterComponent={() => (
        <ActivityIndicator style={{ paddingVertical: 20 }} />
      )}
    />
  )
}
