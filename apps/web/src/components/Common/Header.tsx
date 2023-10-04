import { Button } from '@components/UIElements/Button'
import DropMenu, { NextLink } from '@components/UIElements/DropMenu'
import Modal from '@components/UIElements/Modal'
<<<<<<< HEAD
=======
import { Menu } from '@headlessui/react'
import { Analytics, TRACK } from '@lenstube/browser'
import {
  FEATURE_FLAGS,
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  STATIC_ASSETS
} from '@lenstube/constants'
import { getIsFeatureEnabled } from '@lenstube/generic'
import { useLatestNotificationIdQuery } from '@lenstube/lens'
>>>>>>> upstream/main
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import { t, Trans } from '@lingui/macro'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
<<<<<<< HEAD
import {
  Analytics,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  TRACK
} from 'utils'
=======

>>>>>>> upstream/main
import Login from './Auth/Login'
import CategoryFilters from './CategoryFilters'
import BellOutline from './Icons/BellOutline'
import LinkOutline from './Icons/LinkOutline'
import NewVideoOutline from './Icons/NewVideoOutline'
import SearchOutline from './Icons/SearchOutline'
import UploadOutline from './Icons/UploadOutline'
import PostLinkModal from './PostLinkModal'
import GlobalSearchBar from './Search/GlobalSearchBar'

type Props = {
  className?: string
}

const Header: React.FC<Props> = ({ className }) => {
  const { pathname } = useRouter()
  const [showShowModal, setSearchModal] = useState(false)
  const [showPostLinkModal, setShowPostLinkModal] = useState(false)
  const showFilter =
    pathname === '/' || pathname === '/explore' || pathname === '/feed'

  const hasNewNotification = useChannelStore(
    (state) => state.hasNewNotification
  )
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const latestNotificationId = usePersistStore(
    (state) => state.latestNotificationId
  )
  const setLatestNotificationId = usePersistStore(
    (state) => state.setLatestNotificationId
  )
  const setHasNewNotification = useChannelStore(
    (state) => state.setHasNewNotification
  )

  useLatestNotificationIdQuery({
    variables: {
      request: {
        profileId: selectedSimpleProfile?.id,
        sources: IS_MAINNET
          ? [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID]
          : undefined,
        customFilters: LENS_CUSTOM_FILTERS,
        limit: 1
      }
    },
    fetchPolicy: 'no-cache',
    skip: !selectedSimpleProfile?.id,
    onCompleted: (notificationsData) => {
      if (selectedSimpleProfile && notificationsData) {
        const id = notificationsData?.notifications?.items[0].notificationId
        setHasNewNotification(latestNotificationId !== id)
        setLatestNotificationId(id)
      }
    }
  })

  return (
    <div
      className={clsx(
<<<<<<< HEAD
        'bg-theme sticky left-0 right-0 top-0 z-10 flex w-full items-center py-2.5',
=======
        'dark:bg-theme/90 sticky left-0 right-0 top-0 z-10 flex w-full items-center bg-white/90 py-2.5 backdrop-blur-xl',
>>>>>>> upstream/main
        className
      )}
    >
      <div className="w-full">
        <div className="ultrawide:px-6 flex w-full items-center justify-between px-2">
          {/* <div className="md:w-[330px]">
            <Link href="/" className="block md:invisible">
              <img
                src={`${FALLBACK_COVER_URL}`}
                draggable={false}
                className="h-5 w-5"
                alt="dragverse"
              />
            </Link>
          </div> */}
          <div className="hidden md:block">
            <GlobalSearchBar />
          </div>
          <div className="flex flex-row items-center justify-end space-x-2 md:w-96 md:space-x-3">
            <button
              onClick={() => setSearchModal(true)}
              className="btn-hover p-2.5 md:hidden"
            >
              <SearchOutline className="h-4 w-4" aria-hidden="true" />
            </button>
<<<<<<< HEAD
            {/* <Tooltip content="Roadmap & Feedback">
              <Link
                className="hidden rounded-lg opacity-80 hover:opacity-100 lg:block"
                href={LENSTUBE_ROADMAP_URL}
                onClick={() => Analytics.track(TRACK.SYSTEM.MORE_MENU.ROADMAP)}
                target="_blank"
              >
                <button className="btn-hover p-2.5">
                  <RoadmapOutline className="h-4 w-4" />
                </button>
              </Link>
            </Tooltip> */}
            {selectedChannelId ? (
=======
            {selectedSimpleProfile?.id ? (
>>>>>>> upstream/main
              <>
                <Link
                  onClick={() =>
                    Analytics.track(TRACK.NOTIFICATIONS.CLICK_NOTIFICATIONS)
                  }
                  href="/notifications"
                  className="relative"
                >
                  <button className="btn-hover p-2.5">
                    <BellOutline className="h-4 w-4" />
                    {hasNewNotification && (
                      <span className="absolute right-0.5 top-0.5 flex h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </button>
                </Link>
                {getIsFeatureEnabled(
                  FEATURE_FLAGS.OPEN_ACTIONS,
                  selectedSimpleProfile.id
                ) ? (
                  <DropMenu
                    trigger={
                      <Button className="hidden md:block">
                        <span>
                          <Trans>Create</Trans>
                        </span>
                      </Button>
                    }
                  >
<<<<<<< HEAD
                    <span>
                      <Trans>New video</Trans>
                    </span>
                  </Button>
                </Link>
                {/* <Link
                  href="/livestream"
                  onClick={() => Analytics.track(TRACK.CLICK_UPLOAD_VIDEO)}
                >
                  <Button
                    className="hidden md:block"
                    icon={<NewVideoOutline className="h-4 w-4" />}
                  >
                    <span>
                      <Trans>New livestream</Trans>
                    </span>
                  </Button>
                </Link> */}
=======
                    <div className="bg-secondary mt-2 flex w-40 flex-col overflow-hidden rounded-xl border border-gray-200 p-1 text-sm shadow transition duration-150 ease-in-out dark:border-gray-800">
                      <Menu.Item
                        as={NextLink}
                        href="/upload"
                        className="flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <UploadOutline className="h-3.5 w-3.5" />
                        <span className="whitespace-nowrap">
                          <Trans>New Upload</Trans>
                        </span>
                      </Menu.Item>
                      <Menu.Item
                        as="button"
                        className="flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setShowPostLinkModal(true)}
                      >
                        <LinkOutline className="h-3.5 w-3.5" />
                        <span className="whitespace-nowrap">
                          <Trans>Share Drop</Trans>
                        </span>
                      </Menu.Item>
                    </div>
                  </DropMenu>
                ) : (
                  <Link href="/upload">
                    <Button
                      className="hidden md:block"
                      icon={<NewVideoOutline className="h-4 w-4" />}
                    >
                      <span>
                        <Trans>New video</Trans>
                      </span>
                    </Button>
                  </Link>
                )}
>>>>>>> upstream/main
              </>
            ) : null}
            <Login />
          </div>
        </div>
        {showFilter && <CategoryFilters />}
      </div>
      <PostLinkModal show={showPostLinkModal} setShow={setShowPostLinkModal} />
      <Modal
        title={t`Search`}
        onClose={() => setSearchModal(false)}
        show={showShowModal}
        panelClassName="max-w-md h-full"
      >
        <div className="no-scrollbar max-h-[80vh] overflow-y-auto">
          <GlobalSearchBar onSearchResults={() => setSearchModal(false)} />
        </div>
      </Modal>
    </div>
  )
}

export default Header
