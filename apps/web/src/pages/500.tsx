import { Button } from '@components/UIElements/Button'
import { STATIC_ASSETS } from '@lenstube/constants'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
<<<<<<< HEAD
import { FALLBACK_COVER_URL } from 'utils'
=======
>>>>>>> upstream/main

const Custom500: React.FC = () => {
  return (
    <>
      <Head>
        <title>500 - Server Error</title>
      </Head>
      <div className="mt-10 flex h-full flex-col items-center justify-start md:mt-20">
        <img
          src={`${FALLBACK_COVER_URL}`}
          alt="Dragverse"
          draggable={false}
          height={50}
          width={50}
        />
        <div className="py-10 text-center">
          <h1 className="mb-4 text-3xl font-bold">
            Looks like something went wrong!
          </h1>
          <div className="mb-6 max-w-lg">
            We track these errors automatically, but if the problem persists
            feel free to contact us. In the meantime, try refreshing.
          </div>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Custom500
