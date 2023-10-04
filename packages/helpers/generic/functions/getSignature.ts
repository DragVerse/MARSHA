<<<<<<< HEAD:packages/utils/functions/getSignature.ts
import omitKey from './omitKey'
=======
import { omitKey } from './omitKey'
>>>>>>> upstream/main:packages/helpers/generic/functions/getSignature.ts

interface TypedData {
  domain: Record<string, any>
  types: Record<string, any>
  value: Record<string, any>
}

/**
 * Splits the given typed data into three parts, omitting the "__typename" property from each part.
 *
 * @param typedData The typed data to split.
 * @returns An object containing the three parts of the typed data.
 */
<<<<<<< HEAD:packages/utils/functions/getSignature.ts
const getSignature = (
=======
export const getSignature = (
>>>>>>> upstream/main:packages/helpers/generic/functions/getSignature.ts
  typedData: TypedData
): {
  primaryType: string
  domain: Record<string, any>
  types: Record<string, any>
  message: Record<string, any>
} => {
  const { domain, types, value } = typedData

  return {
    primaryType: Object.keys(omitKey(types, '__typename'))[0],
    domain: omitKey(domain, '__typename'),
    types: omitKey(types, '__typename'),
    message: omitKey(value, '__typename')
  }
}
<<<<<<< HEAD:packages/utils/functions/getSignature.ts

export default getSignature
=======
>>>>>>> upstream/main:packages/helpers/generic/functions/getSignature.ts
