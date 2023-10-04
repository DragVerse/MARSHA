import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import React from 'react'
<<<<<<< HEAD
import { FALLBACK_COVER_URL } from 'utils'
import imageCdn from 'utils/functions/imageCdn'
=======

>>>>>>> upstream/main
import MetaTags from './MetaTags'

const FullPageLoader: React.FC = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
      <div className="animate-bounce">
        <img
          src={imageCdn(`${FALLBACK_COVER_URL}`)}
          draggable={false}
          className="h-12 w-12 md:h-16 md:w-16"
          alt="dragverse"
        />
      </div>
    </div>
  )
}

export default FullPageLoader
