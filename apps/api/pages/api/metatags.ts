import { getMetaTags } from '@lenstube/browser'
import { LENSTUBE_APP_DESCRIPTION, OG_IMAGE } from '@lenstube/constants'
import { trimLensHandle } from '@lenstube/generic'
import getProfileMeta from 'lib/getProfileMeta'
import getPublicationMeta from 'lib/getPublicationMeta'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false })
  }

  const path = req.query.path as string

  if (!path) {
    return res.status(400).json({ success: false })
  }

  const isChannel = path.includes('/channel/')
  const isVideo = path.includes('/watch/')
  const isByte = path.includes('/bytes/')

  try {
    if (isChannel) {
      const handle = path.replace('/channel/', '')
      return await getProfileMeta(res, trimLensHandle(handle, true))
    }

    if (isVideo || isByte) {
      const pubId = isByte
        ? path.replace('/bytes/', '')
        : path.replace('/watch/', '')
      return await getPublicationMeta(res, pubId)
    }

    return res.setHeader('Content-Type', 'text/html').send(
      getMetaTags({
        title: 'Dragverse',
        description: LENSTUBE_APP_DESCRIPTION,
        image: OG_IMAGE
      })
    )
  } catch (error) {
    return res.setHeader('Content-Type', 'text/html').send(
      getMetaTags({
        title: 'Dragverse',
        description: LENSTUBE_APP_DESCRIPTION,
        image: OG_IMAGE
      })
    )
  }
}

export default handler
