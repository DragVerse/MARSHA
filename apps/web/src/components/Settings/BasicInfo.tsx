import { LENS_PERIPHERY_ABI } from '@abis/LensPeriphery'
import Badge from '@components/Common/Badge'
import CopyOutline from '@components/Common/Icons/CopyOutline'
import { Button } from '@components/UIElements/Button'
import EmojiPicker from '@components/UIElements/EmojiPicker'
import { Input } from '@components/UIElements/Input'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import {
  Analytics,
  TRACK,
  uploadToIPFS,
  useCopyToClipboard
} from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENS_PERIPHERY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_WEBSITE_URL,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import {
  getChannelCoverPicture,
  getSignature,
  getValueFromKeyInAttributes,
  imageCdn,
  sanitizeDStorageUrl,
  trimify,
  trimLensHandle,
  uploadToAr
} from '@lenstube/generic'
import type {
  CreatePublicSetProfileMetadataUriRequest,
  MediaSet,
  Profile
} from '@lenstube/lens'
import {
  PublicationMetadataDisplayTypes,
  useBroadcastMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation
<<<<<<< HEAD
} from 'lens'
=======
} from '@lenstube/lens'
import type {
  CustomErrorWithData,
  IPFSUploadResult
} from '@lenstube/lens/custom-types'
import { Loader } from '@lenstube/ui'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
>>>>>>> upstream/main
import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
<<<<<<< HEAD
import type { CustomErrorWithData, IPFSUploadResult } from 'utils'
import {
  Analytics,
  ERROR_MESSAGE,
  LENS_PERIPHERY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_WEBSITE_URL,
  REQUESTING_SIGNATURE_MESSAGE,
  TRACK
} from 'utils'
import getChannelCoverPicture from 'utils/functions/getChannelCoverPicture'
import { getValueFromKeyInAttributes } from 'utils/functions/getFromAttributes'
import imageCdn from 'utils/functions/imageCdn'
import omitKey from 'utils/functions/omitKey'
import sanitizeDStorageUrl from 'utils/functions/sanitizeDStorageUrl'
import trimify from 'utils/functions/trimify'
import uploadToAr from 'utils/functions/uploadToAr'
import uploadToIPFS from 'utils/functions/uploadToIPFS'
import useCopyToClipboard from 'utils/hooks/useCopyToClipboard'
=======
>>>>>>> upstream/main
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import type { z } from 'zod'
import { object, string, union } from 'zod'

type Props = {
  channel: Profile & {
    coverPicture: MediaSet
  }
}
const formSchema = object({
  displayName: union([
    string()
      .min(4, { message: 'Name should be atleast 5 characters' })
      .max(30, { message: 'Name should not exceed 30 characters' }),
    string().max(0)
  ]),
  description: union([
    string()
      .min(5, { message: 'Description should be atleast 5 characters' })
      .max(1000, { message: 'Description should not exceed 1000 characters' }),
    string().max(0)
  ]),
<<<<<<< HEAD
  twitter: z.string(),
  location: z.string(),
  website: z.union([
    z
      .string()
      .url({ message: 'Enter valid website URL (eg. https://dragverse.app)' }),
    z.string().max(0)
=======
  x: string(),
  youtube: string(),
  location: string(),
  website: union([
    string().url({
      message: 'Enter valid website URL (eg. https://lenstube.xyz)'
    }),
    string().max(0)
>>>>>>> upstream/main
  ])
})
type FormData = z.infer<typeof formSchema> & { coverImage?: string }

const BasicInfo: React.FC<Props> = ({ channel }: Props) => {
  const [copy] = useCopyToClipboard()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [coverImage, setCoverImage] = useState(getChannelCoverPicture(channel))
  const handleWrongNetwork = useHandleWrongNetwork()

  const activeChannel = useChannelStore((state) => state.activeChannel)
  // Dispatcher
  const canUseRelay = activeChannel?.dispatcher?.canUseRelay
  const isSponsored = activeChannel?.dispatcher?.sponsor

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: channel.name || '',
      description: channel.bio || '',
      location: getValueFromKeyInAttributes(channel?.attributes, 'location'),
      x: getValueFromKeyInAttributes(channel?.attributes, 'x'),
      youtube: getValueFromKeyInAttributes(channel?.attributes, 'youtube'),
      website: getValueFromKeyInAttributes(channel?.attributes, 'website')
    }
  })

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return
    }
    setLoading(false)
    toast.success('Channel details submitted')
    Analytics.track(TRACK.CHANNEL.UPDATE)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    address: LENS_PERIPHERY_ADDRESS,
    abi: LENS_PERIPHERY_ABI,
    functionName: 'setProfileMetadataURI',
    onError,
    onSuccess: () => onCompleted()
  })

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  })

  const [createSetProfileMetadataViaDispatcher] =
    useCreateSetProfileMetadataViaDispatcherMutation({
      onError,
      onCompleted: ({ createSetProfileMetadataViaDispatcher }) =>
        onCompleted(createSetProfileMetadataViaDispatcher.__typename)
    })

  const [createSetProfileMetadataTypedData] =
    useCreateSetProfileMetadataTypedDataMutation({
      onCompleted: async (data) => {
        const { typedData, id } = data.createSetProfileMetadataTypedData
        try {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)
          const signature = await signTypedDataAsync(getSignature(typedData))
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.__typename === 'RelayError') {
            const { profileId, metadata } = typedData.value
            return write?.({ args: [profileId, metadata] })
          }
        } catch {
          setLoading(false)
        }
      },
      onError
    })

  const onCopyChannelUrl = async (value: string) => {
    await copy(value)
    toast.success('Copied to clipboard')
  }

  const createTypedData = async (
    request: CreatePublicSetProfileMetadataUriRequest
  ) => {
    await createSetProfileMetadataTypedData({
      variables: { request }
    })
  }

  const createViaDispatcher = async (
    request: CreatePublicSetProfileMetadataUriRequest
  ) => {
    const { data } = await createSetProfileMetadataViaDispatcher({
      variables: { request }
    })
    if (
      data?.createSetProfileMetadataViaDispatcher.__typename === 'RelayError'
    ) {
      createTypedData(request)
    }
  }

  const otherAttributes =
    channel?.attributes
      ?.filter(
        (attr) =>
          !['website', 'location', 'x', 'youtube', 'app'].includes(attr.key)
      )
      .map(({ traitType, key, value }) => ({ traitType, key, value })) ?? []

  const onSaveBasicInfo = async (data: FormData) => {
    if (handleWrongNetwork()) {
      return
    }
    setLoading(true)
    try {
      const metadataUri = await uploadToAr({
        version: '1.0.0',
        name: data.displayName || null,
        bio: trimify(data.description),
        cover_picture: data.coverImage ?? coverImage,
        attributes: [
          ...otherAttributes,
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'website',
            key: 'website',
            value: data.website
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'location',
            key: 'location',
            value: data.location
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'x',
            key: 'x',
            value: data.x
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'youtube',
            key: 'youtube',
            value: data.youtube
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'app',
            key: 'app',
            value: LENSTUBE_APP_ID
          }
        ],
        metadata_id: uuidv4()
      })
      const request = {
        profileId: channel?.id,
        metadata: metadataUri
      }
      if (canUseRelay && isSponsored) {
        return await createViaDispatcher(request)
      }
      return await createTypedData(request)
    } catch {
      setLoading(false)
    }
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setUploading(true)
      const result: IPFSUploadResult = await uploadToIPFS(e.target.files[0])
      setCoverImage(result.url)
      setUploading(false)
      onSaveBasicInfo({ ...getValues(), coverImage: result.url })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSaveBasicInfo)}
      className="bg-theme rounded-xl p-4"
    >
      <div className="relative w-full flex-none">
        {uploading && (
          <div className="absolute z-10 flex h-full w-full items-center justify-center rounded bg-black opacity-40">
            <Loader />
          </div>
        )}
        <img
          src={
            sanitizeDStorageUrl(coverImage) ??
            imageCdn(
              sanitizeDStorageUrl(getChannelCoverPicture(channel)),
              'THUMBNAIL'
            )
          }
          className="h-48 w-full rounded bg-white object-cover object-center dark:bg-gray-900 md:h-56"
          draggable={false}
          alt={`${channel.handle}'s cover`}
        />
        <label
          htmlFor="chooseCover"
          className="bg-theme absolute bottom-2 left-2 cursor-pointer rounded-lg p-1 px-3 text-sm"
        >
          <Trans>Change</Trans>
          <input
            id="chooseCover"
            type="file"
            accept=".png, .jpg, .jpeg, .svg"
            className="hidden w-full"
            onChange={handleUpload}
          />
        </label>
      </div>
      <div className="pt-1 text-right text-xs opacity-80">2560 x 1440</div>
      <div className="mb-1 flex items-center">
        <div className="text-[11px] font-semibold uppercase opacity-60">
          <Trans>Channel</Trans>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <h6 className="flex items-center space-x-1">
          <span>{channel?.handle}</span>
          <Badge id={channel?.id} size="xs" />
        </h6>
<<<<<<< HEAD
        {/* {IS_MAINNET &&
          !VERIFIED_CHANNELS.includes(channel?.id) &&
          channel.stats.totalFollowers > 500 && (
            <Link
              href={TALLY_VERIFICATION_FORM_URL}
              target="_blank"
              rel="noreferer noreferrer"
              className="bg-gradient-to-br from-purple-500 to-indigo-600 bg-clip-text text-sm text-transparent"
            >
              ( <Trans>Get Verified</Trans> )
            </Link>
          )} */}
=======
>>>>>>> upstream/main
      </div>
      <div className="mt-4">
        <div className="mb-1 flex items-center">
          <div className="text-[11px] font-semibold uppercase opacity-60">
            <Trans>Channel URL</Trans>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span>
            {LENSTUBE_WEBSITE_URL}/channel/{trimLensHandle(channel.handle)}
          </span>
          <button
            className="hover:opacity-60 focus:outline-none"
            onClick={() =>
              onCopyChannelUrl(
                `${LENSTUBE_WEBSITE_URL}/channel/${trimLensHandle(
                  channel.handle
                )}`
              )
            }
            type="button"
          >
            <CopyOutline className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-6">
        <Input
          label={t`Display Name`}
          type="text"
          placeholder="T Series"
          {...register('displayName')}
          validationError={errors.displayName?.message}
        />
      </div>
      <div className="relative mt-4">
        <TextArea
          label={t`Channel Description`}
          placeholder={t`More about your channel`}
          rows={4}
          validationError={errors.description?.message}
          {...register('description')}
        />
        <div className="absolute bottom-2 right-2">
          <EmojiPicker
            onEmojiSelect={(emoji) =>
              setValue('description', `${getValues('description')}${emoji}`)
            }
          />
        </div>
      </div>
      <div className="mt-4">
        <Input
          label="Youtube"
          placeholder="channel"
          {...register('youtube')}
          validationError={errors.x?.message}
          prefix="https://youtube.com/"
        />
      </div>
      <div className="mt-4">
        <Input
          label="X.com"
          placeholder="profile"
          {...register('x')}
          validationError={errors.x?.message}
          prefix="https://x.com/"
        />
      </div>
      <div className="mt-4">
        <Input
          label={t`Website`}
          placeholder="https://johndoe.xyz"
          {...register('website')}
          validationError={errors.website?.message}
        />
      </div>
      <div className="mt-4">
        <Input
          label={t`Location`}
          placeholder="Metaverse"
          {...register('location')}
          validationError={errors.location?.message}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button loading={loading}>
          <Trans>Save</Trans>
        </Button>
      </div>
    </form>
  )
}

export default BasicInfo
