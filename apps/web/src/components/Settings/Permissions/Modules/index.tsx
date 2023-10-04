import { Button } from '@components/UIElements/Button'
import { WMATIC_TOKEN_ADDRESS } from '@lenstube/constants'
import type { ApprovedAllowanceAmount, Erc20 } from '@lenstube/lens'
import {
  CollectModules,
  FollowModules,
  ReferenceModules,
  useApprovedModuleAllowanceAmountQuery,
  useGenerateModuleCurrencyApprovalDataLazyQuery
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import { Loader } from '@lenstube/ui'
import { getCollectModuleConfig } from '@lib/getCollectModule'
import useAuthPersistStore from '@lib/store/auth'
import { t, Trans } from '@lingui/macro'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSendTransaction, useWaitForTransaction } from 'wagmi'

const collectModules = [
  'FeeCollectModule',
  'TimedFeeCollectModule',
  'FeeFollowModule',
  'LimitedFeeCollectModule',
  'LimitedTimedFeeCollectModule',
  'MultirecipientFeeCollectModule',
  'AaveFeeCollectModule',
  'SimpleCollectModule'
]

const ModulePermissions = () => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const [currency, setCurrency] = useState(WMATIC_TOKEN_ADDRESS)
  const [loadingModule, setLoadingModule] = useState('')

  const { data: txData, sendTransaction } = useSendTransaction({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
      setLoadingModule('')
    }
  })

  const {
    data,
    refetch,
    loading: gettingSettings
  } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: [currency],
        followModules: [FollowModules.FeeFollowModule],
        collectModules: [
          CollectModules.FreeCollectModule,
          CollectModules.FeeCollectModule,
          CollectModules.LimitedFeeCollectModule,
          CollectModules.LimitedTimedFeeCollectModule,
          CollectModules.TimedFeeCollectModule,
          CollectModules.RevertCollectModule,
          CollectModules.MultirecipientFeeCollectModule,
          CollectModules.AaveFeeCollectModule,
          CollectModules.SimpleCollectModule
        ],
        referenceModules: [ReferenceModules.FollowerOnlyReferenceModule]
      }
    },
    skip: !selectedSimpleProfile?.id
  })
  useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      toast.success(t`Permission updated`)
      setLoadingModule('')
      refetch()
    },
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
      setLoadingModule('')
    }
  })

  const [generateAllowanceQuery] =
    useGenerateModuleCurrencyApprovalDataLazyQuery()

  const handleClick = async (isAllow: boolean, selectedModule: string) => {
    try {
      setLoadingModule(selectedModule)
      const { data: allowanceData } = await generateAllowanceQuery({
        variables: {
          request: {
            currency,
            value: isAllow ? Number.MAX_SAFE_INTEGER.toString() : '0',
            [getCollectModuleConfig(selectedModule).type]: selectedModule
          }
        }
      })
      const generated = allowanceData?.generateModuleCurrencyApprovalData
      sendTransaction?.({
        to: generated?.to,
        data: generated?.data
      })
    } catch {
      setLoadingModule('')
    }
  }

  return (
    <div className="pt-6">
      <div>
        <h1 className="mb-1 text-xl font-semibold">
          <Trans>Access permissions</Trans>
        </h1>
        <p className="opacity-80">
          <Trans>
            These are the collect modules which you allowed / need to allow to
            use collect feature. You can allow and revoke access anytime.
          </Trans>
        </p>
      </div>
      <div>
        {!gettingSettings && data && (
          <div className="flex justify-end pb-4 pt-3 md:pt-0">
            <select
              autoComplete="off"
              className="rounded-xl border border-gray-300 bg-white p-2.5 text-sm outline-none disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {data?.enabledModuleCurrencies?.map((token: Erc20) => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
        )}
        {gettingSettings && (
          <div className="grid h-24 place-items-center">
            <Loader />
          </div>
        )}
        {!gettingSettings &&
          data?.approvedModuleAllowanceAmount?.map(
            (moduleItem: ApprovedAllowanceAmount) =>
              collectModules.includes(moduleItem.module) && (
                <div
                  key={moduleItem.contractAddress}
                  className="flex items-center rounded-md pb-4"
                >
                  <div className="flex-1">
                    <h6 className="text-base">
                      <Trans>Allow</Trans> {moduleItem.module}
                    </h6>
                    <p className="text-sm opacity-70">
                      {getCollectModuleConfig(moduleItem.module).description}
                    </p>
                  </div>
                  <div className="ml-2 flex flex-none items-center space-x-2">
                    {moduleItem?.allowance === '0x00' ? (
                      <Button
                        loading={loadingModule === moduleItem.module}
                        onClick={() => handleClick(true, moduleItem.module)}
                      >
                        <Trans>Allow</Trans>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleClick(false, moduleItem.module)}
                        variant="danger"
                        loading={loadingModule === moduleItem.module}
                      >
                        <Trans>Revoke</Trans>
                      </Button>
                    )}
                  </div>
                </div>
              )
          )}
      </div>
    </div>
  )
}

export default ModulePermissions
