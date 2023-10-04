import { getMetaTags } from '@lenstube/browser'
import { LENSTUBE_APP_DESCRIPTION, OG_IMAGE } from '@lenstube/constants'
import { getThumbnailUrl, imageCdn, truncate } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { PublicationDetailsDocument } from '@lenstube/lens'
import { apolloClient } from '@lenstube/lens/apollo'
import type { NextApiResponse } from 'next'
<<<<<<< HEAD
import { FALLBACK_COVER_URL, LENSTUBE_APP_DESCRIPTION } from 'utils'
import getApolloClient from 'utils/functions/getApolloClient'
import getMetaTags from 'utils/functions/getMetaTags'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import truncate from 'utils/functions/truncate'
=======
>>>>>>> upstream/main

const client = apolloClient()

const getPublicationMeta = async (
  res: NextApiResponse,
  publicationId: string
) => {
  try {
    const { data } = await client.query({
      query: PublicationDetailsDocument,
      variables: { request: { publicationId } }
    })

    const publication = data?.publication as Publication
    const video =
      publication?.__typename === 'Mirror' ? publication.mirrorOf : publication

    const title = truncate(video?.metadata?.name as string, 100)
    const description = truncate(video?.metadata?.description as string, 100)
<<<<<<< HEAD
    const thumbnail = imageCdn(
      getThumbnailUrl(video) || `${FALLBACK_COVER_URL}`,
      'thumbnail'
    )
=======
    const thumbnail = imageCdn(getThumbnailUrl(video) || OG_IMAGE, 'THUMBNAIL')
>>>>>>> upstream/main

    return res
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 's-maxage=86400')
      .send(
        getMetaTags({
          title,
          description: description.replaceAll('\n', ' '),
          image: thumbnail,
          page: 'VIDEO',
          pubId: video.id,
          publication: video
        })
      )
  } catch {
    return res.setHeader('Content-Type', 'text/html').send(
      getMetaTags({
        title: 'Dragverse',
        description: LENSTUBE_APP_DESCRIPTION,
        image: `${FALLBACK_COVER_URL}`
      })
    )
  }
}

export default getPublicationMeta
