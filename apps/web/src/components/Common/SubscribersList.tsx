import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  formatNumber,
  getProfilePicture,
  getRandomProfilePicture,
  imageCdn,
  shortenAddress,
  trimLensHandle
} from '@lenstube/generic'
import type { Follower, Profile } from '@lenstube/lens'
import { useSubscribersQuery } from '@lenstube/lens'
import { Loader } from '@lenstube/ui'
import { t } from '@lingui/macro'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

import Badge from './Badge'
import UserOutline from './Icons/UserOutline'
import AddressExplorerLink from './Links/AddressExplorerLink'

type Props = {
  channel: Profile
}

const SubscribersList: FC<Props> = ({ channel }) => {
  const request = { profileId: channel?.id, limit: 30 }

  const { data, loading, fetchMore } = useSubscribersQuery({
    variables: { request },
    skip: !channel?.id
  })

  const subscribers = data?.followers?.items as Follower[]
  const pageInfo = data?.followers?.pageInfo

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
  if (subscribers?.length === 0) {
    return (
      <div className="pt-5">
        <NoDataFound text={t`No subscribers`} isCenter />
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-3">
      {subscribers?.map((subscriber: Follower) => (
        <div className="flex flex-col" key={subscriber.wallet.address}>
          {subscriber.wallet?.defaultProfile ? (
            <Link
              href={`/channel/${trimLensHandle(
                subscriber.wallet?.defaultProfile?.handle
              )}`}
              className="font-base flex items-center justify-between"
            >
              <div className="flex items-center space-x-1.5">
                <img
                  className="h-5 w-5 rounded-full"
                  src={getProfilePicture(
                    subscriber.wallet?.defaultProfile,
                    'AVATAR'
                  )}
                  alt={subscriber.wallet.defaultProfile.handle}
                  draggable={false}
                />
                <div className="flex items-center space-x-1">
                  <span>
                    {trimLensHandle(subscriber.wallet?.defaultProfile?.handle)}
                  </span>
                  <Badge id={subscriber.wallet?.defaultProfile?.id} size="xs" />
                </div>
              </div>
              <div className="flex items-center space-x-1 whitespace-nowrap text-xs opacity-80">
                <UserOutline className="h-2.5 w-2.5 opacity-60" />
                <span>
                  {formatNumber(
                    subscriber.wallet.defaultProfile.stats.totalFollowers
                  )}
                </span>
              </div>
            </Link>
          ) : (
            <AddressExplorerLink address={subscriber.wallet?.address}>
              <div className="font-base flex items-center space-x-1.5">
                <img
                  className="h-5 w-5 rounded-full"
                  src={imageCdn(
                    getRandomProfilePicture(subscriber.wallet.address),
                    'AVATAR'
                  )}
                  alt={subscriber.wallet.address.handle}
                  draggable={false}
                />
                <div>{shortenAddress(subscriber.wallet?.address)}</div>
              </div>
            </AddressExplorerLink>
          )}
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

export default SubscribersList
