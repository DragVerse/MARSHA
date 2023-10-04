import '@rainbow-me/rainbowkit/styles.css'
import 'tippy.js/dist/tippy.css'
import '../styles/index.css'

import FullPageLoader from '@components/Common/FullPageLoader'
import MetaTags from '@components/Common/MetaTags'
import { bloomer } from '@lenstube/browser'
import { AUTH_ROUTES } from '@lenstube/constants'
import useAuthPersistStore from '@lib/store/auth'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { lazy, Suspense, useEffect } from 'react'

const Providers = lazy(() => import('../components/Common/Providers'))
const Layout = lazy(() => import('../components/Common/Layout'))

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const { pathname, replace, asPath } = useRouter()
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  useEffect(() => {
    if (!selectedSimpleProfile?.id && AUTH_ROUTES.includes(pathname)) {
      replace(`/auth?next=${asPath}`)
    }
  }, [selectedSimpleProfile, pathname, asPath, replace])

  return (
    <>
      <MetaTags />
      <Suspense fallback={<FullPageLoader />}>
        <Providers>
          <style jsx global>{`
            body {
              font-family: ${bloomer.style.fontFamily};
            }
          `}</style>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Providers>
      </Suspense>
    </>
  )
}

export default App
