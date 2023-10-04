import { getMetaTags } from '@lenstube/browser'
import { LENSTUBE_APP_DESCRIPTION, OG_IMAGE } from '@lenstube/constants'
import { getProfilePicture } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { ProfileDocument } from '@lenstube/lens'
import { apolloClient } from '@lenstube/lens/apollo'
import type { NextApiResponse } from 'next'

const client = apolloClient()

const getProfileMeta = async (res: NextApiResponse, handle: string) => {
  try {
    const { data } = await client.query({
      query: ProfileDocument,
      variables: { request: { handle } }
    })

    const profile: Profile = data?.profile
    const title = profile?.name ?? profile?.handle
    const description = profile?.bio || LENSTUBE_APP_DESCRIPTION
    const image = getProfilePicture(profile, 'AVATAR_LG')

    return res
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 's-maxage=86400')
      .send(
        getMetaTags({
          title,
          description: description.replaceAll('\n', ' '),
          image,
          page: 'PROFILE',
          handle
        })
      )
  } catch {
    return res.setHeader('Content-Type', 'text/html').send(
      getMetaTags({
        title: 'Dragverse',
        description: LENSTUBE_APP_DESCRIPTION,
        image: OG_IMAGE
      })
    )
  }
}

export default getProfileMeta
