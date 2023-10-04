<<<<<<< HEAD
import useChannelStore from '@lib/store/channel'
import mixpanel from 'mixpanel-browser'
import type { FC } from 'react'
import { useEffect } from 'react'
import { IS_PRODUCTION, MIXPANEL_API_HOST, MIXPANEL_TOKEN } from 'utils'
=======
import {
  IS_PRODUCTION,
  MIXPANEL_API_HOST,
  MIXPANEL_TOKEN
} from '@lenstube/constants'
import useAuthPersistStore from '@lib/store/auth'
import mixpanel from 'mixpanel-browser'
import type { FC } from 'react'
import { useEffect } from 'react'
>>>>>>> upstream/main

if (IS_PRODUCTION) {
  mixpanel.init(MIXPANEL_TOKEN, {
    ignore_dnt: true,
    api_host: MIXPANEL_API_HOST
  })
}

const TelemetryProvider: FC = () => {
<<<<<<< HEAD
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  // const visitorId = usePersistStore((state) => state.visitorId)
  // const setVisitorId = usePersistStore((state) => state.setVisitorId)

  const storeVisitorId = async () => {
    // const visitorId = await getVisitorId()
    // setVisitorId(visitorId)
  }

  useEffect(() => {
    storeVisitorId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      IS_PRODUCTION &&
      selectedChannel?.id
      //  && visitorId
    ) {
      mixpanel.identify(selectedChannel?.id)
      mixpanel.people.set({
        $name: selectedChannel?.handle,
        // $visitorId: visitorId,
=======
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  useEffect(() => {
    if (IS_PRODUCTION && selectedSimpleProfile?.id) {
      mixpanel.identify(selectedSimpleProfile?.id)
      mixpanel.people.set({
        $name: selectedSimpleProfile?.handle,
>>>>>>> upstream/main
        $last_active: new Date()
      })
      mixpanel.people.set_once({
        $created_at: new Date()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSimpleProfile?.id])

  return null
}

export default TelemetryProvider
