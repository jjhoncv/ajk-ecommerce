import { z } from 'zod'

export const priceSchema = z
  .object({
    minPrice: z
      .number()
      .min(0, 'El precio mínimo debe ser mayor a 0')
      .optional(),
    maxPrice: z
      .number()
      .min(0, 'El precio máximo debe ser mayor a 0')
      .optional()
  })
  .refine(
    (data) => {
      if (data.minPrice && data.maxPrice) {
        return data.minPrice <= data.maxPrice
      }
      return true
    },
    {
      message: 'El precio mínimo debe ser menor o igual al precio máximo'
    }
  )

export type PriceFormData = z.infer<typeof priceSchema>
