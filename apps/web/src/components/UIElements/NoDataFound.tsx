import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import clsx from 'clsx'
import React from 'react'
<<<<<<< HEAD
import { FALLBACK_COVER_URL } from 'utils'
import imageCdn from 'utils/functions/imageCdn'
=======
>>>>>>> upstream/main

export const NoDataFound: React.FC<{
  text?: string
  withImage?: boolean
  isCenter?: boolean
}> = ({ text = 'No data found', withImage = false, isCenter = false }) => {
  return (
    <div
      className={clsx('flex flex-col space-y-1 rounded-lg p-6', {
        'items-center justify-center': isCenter
      })}
    >
      {withImage && (
        <img
<<<<<<< HEAD
          src={imageCdn(`${FALLBACK_COVER_URL}`, 'square')}
=======
          src={imageCdn(
            `${STATIC_ASSETS}/images/illustrations/no-results.png`,
            'SQUARE'
          )}
>>>>>>> upstream/main
          className="w-32 md:w-36"
          alt="no results"
          draggable={false}
        />
      )}
      <div
        className={clsx('text-sm font-medium', {
          'text-center': isCenter
        })}
      >
        {text}
      </div>
    </div>
  )
}
