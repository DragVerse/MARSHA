import MetaTags from '@components/Common/MetaTags'
import SettingsShimmer from '@components/Shimmers/SettingsShimmer'
import { Analytics, TRACK } from '@lenstube/browser'
import type { MediaSet, Profile } from '@lenstube/lens'
import { useProfileQuery } from '@lenstube/lens'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import BasicInfo from './BasicInfo'
import DangerZone from './DangerZone'
import Membership from './Membership'
import Permissions from './Permissions'
import ProfileInterests from './ProfileInterests'
import SideNav from './SideNav'

export const SETTINGS_MEMBERSHIP = '/settings/membership'
export const SETTINGS_INTERESTS = '/settings/interests'
export const SETTINGS_PERMISSIONS = '/settings/permissions'
export const SETTINGS_DANGER_ZONE = '/settings/danger'
export const SETTINGS = '/settings'

const Settings = () => {
  const router = useRouter()
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.SETTINGS })
  }, [])

  const { data, loading, error } = useProfileQuery({
    variables: {
      request: { handle: selectedSimpleProfile?.handle }
    },
    skip: !selectedSimpleProfile?.handle
  })

  if (error) {
    return <Custom500 />
  }
  if (loading || !data) {
    return <SettingsShimmer />
  }

  if (!data?.profile || (!selectedSimpleProfile && router.isReady)) {
    return <Custom404 />
  }

  const channel = data?.profile as Profile & {
    coverPicture: MediaSet
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <MetaTags title={t`Channel Settings`} />
      {!loading && !error && channel ? (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
            <SideNav channel={channel} />
          </div>
          <div className="md:col-span-3">
            {router.pathname === SETTINGS && <BasicInfo channel={channel} />}
            {router.pathname === SETTINGS_MEMBERSHIP && (
              <Membership channel={channel} />
            )}
            {router.pathname === SETTINGS_PERMISSIONS && <Permissions />}
            {router.pathname === SETTINGS_INTERESTS && <ProfileInterests />}
            {router.pathname === SETTINGS_DANGER_ZONE && <DangerZone />}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Settings
