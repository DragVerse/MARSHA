import {
  formatNumber,
  getProfilePicture,
  trimLensHandle
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { Trans } from '@lingui/macro'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

import Badge from '../Badge'
import UserOutline from '../Icons/UserOutline'

interface Props {
  results: Profile[]
  loading: boolean
  clearSearch: () => void
}

const Channels: FC<Props> = ({ results, loading, clearSearch }) => {
  return (
    <>
      {results?.map((channel: Profile) => (
        <div
          key={channel.id}
          className="relative cursor-default select-none pl-3 pr-4 hover:bg-gray-100 dark:hover:bg-gray-900"
          data-testid={`search-channel-${channel.handle}`}
        >
          <Link
            onClick={() => clearSearch()}
            href={`/channel/${trimLensHandle(channel?.handle)}`}
            key={channel?.handle}
            className="flex flex-col justify-center space-y-1 rounded-xl py-2"
          >
            <span className="flex items-center justify-between">
              <div className="inline-flex w-3/4 items-center space-x-2">
                <img
                  className="h-5 w-5 rounded-full"
                  src={getProfilePicture(channel, 'AVATAR')}
                  draggable={false}
                  alt="pfp"
                />
                <div className="flex items-center space-x-1">
                  <p className="line-clamp-1 truncate text-base">
                    <span>{trimLensHandle(channel?.handle)}</span>
                  </p>
                  <Badge id={channel?.id} size="xs" />
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 whitespace-nowrap text-xs opacity-60">
                <UserOutline className="h-2.5 w-2.5" />
                <span>{formatNumber(channel.stats.totalFollowers)}</span>
              </span>
            </span>
            {channel.bio && (
              <p className="truncate text-sm opacity-60">{channel.bio}</p>
            )}
          </Link>
        </div>
      ))}
      {!results?.length && !loading && (
        <div className="relative cursor-default select-none p-5 text-center">
          <Trans>No results found</Trans>
        </div>
      )}
    </>
  )
}

export default Channels
