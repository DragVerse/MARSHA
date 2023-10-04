import type { WebBundlr } from '@bundlr-network/client'
import type {
  AaveFeeCollectModuleSettings,
  Attribute,
  FeeCollectModuleSettings,
  FreeCollectModuleSettings,
  LimitedFeeCollectModuleSettings,
  LimitedTimedFeeCollectModuleSettings,
  MultirecipientFeeCollectModuleSettings,
  Profile,
  RecipientDataInput,
  RevertCollectModuleSettings,
  SimpleCollectModuleSettings,
  TimedFeeCollectModuleSettings
} from '@lenstube/lens'

export type VideoDraft = {
  preview: string
  title: string
  description: string
}

export type BundlrDataState = {
  instance: WebBundlr | null
  balance: string
  estimatedPrice: string
  deposit: string | null
  depositing: boolean
  showDeposit: boolean
}

export type FileReaderStreamType = NodeJS.ReadableStream & {
  name: string
  size: number
  type: string
  lastModified: string
}

export type CollectModuleType = {
  isRevertCollect?: boolean
  isSimpleCollect?: boolean
  isFeeCollect?: boolean
  isMultiRecipientFeeCollect?: boolean
  amount?: { currency?: string; value: string }
  referralFee?: number
  collectLimitEnabled?: boolean
  collectLimit?: string
  timeLimitEnabled?: boolean
  followerOnlyCollect?: boolean
  recipient?: string
  multiRecipients?: RecipientDataInput[]
}

export type ReferenceModuleType = {
  followerOnlyReferenceModule: boolean
  degreesOfSeparationReferenceModule?: {
    commentsRestricted: boolean
    mirrorsRestricted: boolean
    degreesOfSeparation: number
  } | null
}

export type UploadedVideo = {
  stream: FileReaderStreamType | null
  preview: string
  videoType: string
  file: File | null
  title: string
  description: string
  thumbnail: string
  thumbnailType: string
  videoCategory: { tag: string; name: string }
  percent: number
  isSensitiveContent: boolean
  isUploadToIpfs: boolean
  loading: boolean
  uploadingThumbnail: boolean
  videoSource: string
  buttonText: string
  durationInSeconds: string | null
  collectModule: CollectModuleType
  referenceModule: ReferenceModuleType
  isNSFW: boolean
  isNSFWThumbnail: boolean
  isByteVideo: boolean
}

export enum LivestreamType {
  Perpetual = 'perpetual'
}

export type UploadedLivestream = UploadedVideo & {
  isLivestream: boolean
  livestreamType: LivestreamType
  livestreamName: string
  livestreamPlaybackId: string
  livestreamKey: string
}

export type IPFSUploadResult = {
  url: string
  type: string
}

export type VideoUploadForm = {
  videoThumbnail: IPFSUploadResult | null
  videoSource: string | null
  title: string
  description: string
  adultContent: boolean
}

export type ProfileMetadata = {
  version: string
  metadata_id: string
  name: string | null
  bio: string | null
  cover_picture: string | null
  attributes: Attribute[]
}

type MultiRecipientFeeCollectModuleSettings =
  MultirecipientFeeCollectModuleSettings & {
    optionalEndTimestamp?: string
    optionalCollectLimit?: string
  }

export type DragverseCollectModule = FreeCollectModuleSettings &
  FeeCollectModuleSettings &
  RevertCollectModuleSettings &
  TimedFeeCollectModuleSettings &
  LimitedFeeCollectModuleSettings &
  LimitedTimedFeeCollectModuleSettings &
  MultiRecipientFeeCollectModuleSettings &
  SimpleCollectModuleSettings &
  AaveFeeCollectModuleSettings

export interface CustomErrorWithData extends Error {
  data?: {
    message: string
  }
}

export interface ProfileInterest {
  category: { label: string; id: string }
  subCategories: Array<{ label: string; id: string }>
}

export type QueuedVideoType = {
  thumbnailUrl: string
  title: string
  txnId?: string
  txnHash?: string
}

export type QueuedLivestreamVideoType = QueuedVideoType

export type QueuedCommentType = {
  comment: string
  pubId: string
  txnId?: string
  txnHash?: string
}

export enum CustomCommentsFilterEnum {
  RELEVANT_COMMENTS = 'RelevantComments',
  NEWEST_COMMENTS = 'NewestComments'
}

export enum CustomNotificationsFilterEnum {
  HIGH_SIGNAL = 'HighSignal',
  ALL_NOTIFICATIONS = 'AllNotifications'
}

// MOBILE

export enum TimelineFeedType {
  CURATED = 'CURATED',
  FOLLOWING = 'FOLLOWING',
  HIGHLIGHTS = 'HIGHLIGHTS',
  ALGORITHM = 'ALGORITHM'
}

export enum AlgoType {
  K3L_RECOMMENDED = 'K3L_RECOMMENDED',
  K3L_POPULAR = 'K3L_POPULAR',
  K3L_CROWDSOURCED = 'K3L_CROWDSOURCED'
}

export enum ALGO_PROVIDER {
  K3L = 'K3L'
}

export const MOBILE_PROFILE_ITEMS = [
  'Clan',
  'Media',
  'Bytes',
  'Replies',
  'Gallery'
] as const

export type MobileProfileTabItemType = (typeof MOBILE_PROFILE_ITEMS)[number]

export interface MobileThemeConfig {
  textColor: string
  secondaryTextColor: string
  backgroudColor: string
  backgroudColor2: string
  backgroudColor3: string
  sheetBackgroundColor: string
  borderColor: string
  contrastBorderColor: string
  sheetBorderColor: string
  contrastBackgroundColor: string
  contrastTextColor: string
  buttonBackgroundColor: string
  buttonTextColor: string
}

export interface CustomNftItemType {
  contentValue: {
    video: string
    audio: string
  }
  metaData: {
    name: string
    image: string
    description: string
  }
  tokenId: string
  blockchain: string
  chainId: string
  address: string
}

export type SimpleProfile = Pick<
  Profile,
  'id' | 'handle' | 'ownedBy' | 'isDefault' | 'dispatcher' | 'stats' | 'picture'
>

export interface NftProvider {
  provider: 'zora' | 'basepaint'
}

export interface BasicNftMetadata extends NftProvider {
  chain: string
  address: string
  token: string
}

export type ZoraNft = {
  chainId: number
  name: string
  description: string
  coverImageUrl: string
  mediaUrl: string
  tokenId: string
  address: `0x${string}`
  owner: `0x${string}`
  creator: `0x${string}`
  maxSupply: number
  remainingSupply: number
  totalMinted: number
  isOpenEdition: boolean
  price: string
  contractType:
    | 'ERC721_DROP'
    | 'ERC721_SINGLE_EDITION'
    | 'ERC1155_COLLECTION'
    | 'ERC1155_COLLECTION_TOKEN'
  contractStandard: 'ERC721' | 'ERC1155'
}
