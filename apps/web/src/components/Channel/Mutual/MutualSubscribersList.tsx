import Badge from '@components/Common/Badge'
import UserOutline from '@components/Common/Icons/UserOutline'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { getProfilePicture, trimLensHandle } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useMutualFollowersQuery } from '@lenstube/lens'
import { Loader } from '@lenstube/ui'
import useAuthPersistStore from '@lib/store/auth'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  viewingChannelId: string
}

const MutualSubscribersList: FC<Props> = ({ viewingChannelId }) => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const request = {
    viewingProfileId: viewingChannelId,
    yourProfileId: selectedSimpleProfile?.id,
    limit: 30
  }

  const { data, loading, fetchMore } = useMutualFollowersQuery({
    variables: {
      request
    },
    skip: !viewingChannelId
  })

  const mutualSubscribers = data?.mutualFollowersProfiles?.items as Profile[]
  const pageInfo = data?.mutualFollowersProfiles?.pageInfo

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  if (loading) {
    return <Loader />
  }
  if (mutualSubscribers?.length === 0) {
    return (
      <div className="pt-5">
        <NoDataFound text="No subscribers" isCenter />
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-3">
      {mutualSubscribers?.map((channel: Profile) => (
        <Link
          href={`/channel/${trimLensHandle(channel?.handle)}`}
          className="font-base flex items-center justify-between"
          key={channel?.id}
        >
          <div className="flex items-center space-x-1.5">
            <img
              className="h-5 w-5 rounded-full"
              src={getProfilePicture(channel)}
              alt={channel.handle}
              draggable={false}
            />
            <div className="flex items-center space-x-1">
              <span>{trimLensHandle(channel?.handle)}</span>
              <Badge id={channel?.id} size="xs" />
            </div>
          </div>
          <div className="flex items-center space-x-1 whitespace-nowrap text-xs opacity-80">
            <UserOutline className="h-2.5 w-2.5 opacity-60" />
            <span>{channel.stats.totalFollowers}</span>
          </div>
        </Link>
      ))}
      {pageInfo?.next && (
        <span ref={observe} className="p-5">
          <Loader />
        </span>
      )}
    </div>
  )
}

export default MutualSubscribersList
