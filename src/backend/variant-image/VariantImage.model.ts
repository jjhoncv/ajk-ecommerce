import { VariantImages as VariantImage } from '@/types/domain'
import { VariantImagesMapper } from './VariantImage.mapper'
import oVariantImage from './VariantImage.repository'

export class VariantImageModel {
  public async getVariantImages(
    variantId: number
  ): Promise<VariantImage[] | undefined> {
    const variantRaw = await oVariantImage.getVariantImages(variantId)
    if (!variantRaw) return undefined
    return VariantImagesMapper(variantRaw)
  }
}

const variantImageModel = new VariantImageModel()
export default variantImageModel
