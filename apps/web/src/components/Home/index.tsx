import MetaTags from '@components/Common/MetaTags'
import { Analytics, TRACK } from '@lenstube/browser'
import { FEATURE_FLAGS } from '@lenstube/constants'
import { getIsFeatureEnabled } from '@lenstube/generic'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
<<<<<<< HEAD
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { Analytics, TRACK } from 'utils'
import Banner from './Banner'
import DispatcherAlert from './DispatcherAlert'
import HomeFeed from './Feed'
import GitcoinAlert from './GitcoinAlert'

const BytesSection = dynamic(() => import('./BytesSection'), {
  loading: () => <BytesShimmer />
})
=======
import type { NextPage } from 'next'
import React, { useEffect } from 'react'

import BytesSection from './BytesSection'
import DispatcherAlert from './DispatcherAlert'
import HomeFeed from './Feed'
import OpenActions from './OpenActions'
>>>>>>> upstream/main

const Home: React.FC = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.HOME })
  }, [])
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  return (
    <>
      <MetaTags title={t`Home`} />
<<<<<<< HEAD
      <GitcoinAlert />
      <Banner />
=======
      {/* <GitcoinAlert /> */}
>>>>>>> upstream/main
      <DispatcherAlert />
      <BytesSection />
      {getIsFeatureEnabled(
        FEATURE_FLAGS.OPEN_ACTIONS,
        selectedSimpleProfile?.id
      ) && <OpenActions />}
      <HomeFeed />
    </>
  )
}

export default Home
