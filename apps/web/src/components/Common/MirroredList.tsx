import { NoDataFound } from '@components/UIElements/NoDataFound'
import { getProfilePicture, trimLensHandle } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useAllProfilesQuery } from '@lenstube/lens'
import { Loader } from '@lenstube/ui'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

import Badge from './Badge'
import UserOutline from './Icons/UserOutline'

type Props = {
  videoId: string
}

const MirroredList: FC<Props> = ({ videoId }) => {
  const request = { whoMirroredPublicationId: videoId, limit: 30 }

  const { data, loading, fetchMore } = useAllProfilesQuery({
    variables: {
      request
    },
    skip: !videoId
  })

  const mirroredByProfiles = data?.profiles?.items as Profile[]
  const pageInfo = data?.profiles?.pageInfo

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
  if (mirroredByProfiles?.length === 0) {
    return (
      <div className="pt-5">
        <NoDataFound text="No mirrors yet" isCenter />
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-3">
      {mirroredByProfiles?.map((profile: Profile) => (
        <div className="flex flex-col" key={profile.ownedBy}>
          <Link
            href={`/channel/${trimLensHandle(profile?.handle)}`}
            className="font-base flex items-center justify-between"
          >
            <div className="flex items-center space-x-1.5">
              <img
                className="h-5 w-5 rounded-full"
                src={getProfilePicture(profile, 'AVATAR')}
                alt={profile.handle}
                draggable={false}
              />
              <div className="flex items-center space-x-1">
                <span>{trimLensHandle(profile?.handle)}</span>
                <Badge id={profile?.id} size="xs" />
              </div>
            </div>
            <div className="flex items-center space-x-1 whitespace-nowrap text-xs opacity-80">
              <UserOutline className="h-2.5 w-2.5 opacity-60" />
              <span>{profile.stats.totalFollowers}</span>
            </div>
          </Link>
        </div>
      ))}
      {pageInfo?.next && (
        <span ref={observe} className="p-5">
          <Loader />
        </span>
      )}
    </div>
  )
}

export default MirroredList
