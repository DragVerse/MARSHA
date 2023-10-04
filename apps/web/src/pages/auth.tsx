import Login from '@components/Common/Auth/Login'
import MetaTags from '@components/Common/MetaTags'
import { LENSTUBE_APP_NAME, STATIC_ASSETS } from '@lenstube/constants'
import useAuthPersistStore from '@lib/store/auth'
import { t, Trans } from '@lingui/macro'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
<<<<<<< HEAD
import { FALLBACK_COVER_URL, LENSTUBE_APP_NAME } from 'utils'

const AuthRequiredPage: React.FC = () => {
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
=======

const AuthRequiredPage = () => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
>>>>>>> upstream/main
  )
  const { replace, query } = useRouter()

  useEffect(() => {
    if (selectedSimpleProfile?.id && query?.next) {
      replace(query?.next as string)
    }
  }, [selectedSimpleProfile, query, replace])

  return (
    <>
      <MetaTags title={t`Login`} />
      <div className="mt-10 flex h-full flex-col items-center justify-start md:mt-20">
        <img
          src={`${FALLBACK_COVER_URL}`}
          alt={LENSTUBE_APP_NAME}
          draggable={false}
          height={50}
          width={50}
        />
        <div className="flex flex-col items-center justify-center py-10">
          <h1 className="mb-4 text-3xl font-bold">
            <Trans>Sign In Required</Trans>
          </h1>
          <div className="mb-6 text-center">
            <Trans>Connect Wallet & Sign with Lens to continue,</Trans>
          </div>
          <div>
            <Login />
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthRequiredPage
