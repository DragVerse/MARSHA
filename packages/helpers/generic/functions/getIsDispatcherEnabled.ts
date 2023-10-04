import { OLD_LENS_RELAYER_ADDRESS } from '@lenstube/constants'
import type { Profile } from '@lenstube/lens'

export const getIsDispatcherEnabled = (channel: Profile | null) => {
  return (
    channel?.dispatcher?.canUseRelay &&
    channel.dispatcher?.address?.toLocaleLowerCase() !==
      OLD_LENS_RELAYER_ADDRESS.toLocaleLowerCase()
  )
}
