import { STATIC_ASSETS } from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'
import { Trans } from '@lingui/macro'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  comment: Publication
}

const VideoComment: FC<Props> = ({ comment }) => {
  return (
    <div className="my-2 rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700">
      <Link
        href={`/watch/${comment.id}`}
        className="flex items-center space-x-2.5"
        target="_blank"
      >
        <img
          src={`${STATIC_ASSETS}/images/brand/circle-72x72.png`}
          className="h-5 w-5"
          draggable={false}
          alt="lenstube"
        />
        <span>
          <Trans>Watch Video</Trans>
        </span>
      </Link>
    </div>
  )
}
export default VideoComment
