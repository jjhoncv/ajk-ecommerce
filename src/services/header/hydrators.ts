import { Categories } from '@/types/domain'

export const hydrateHeader = (
  data: Categories[] | undefined
): Categories[] | undefined => {
  return data?.map((item) => ({
    ...item
  }))
}
