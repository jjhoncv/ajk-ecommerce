import {
  type CheckboxItem,
  type Field,
  type SelectOption
} from '@/module/shared/components/FormCreate/types/fileManagement'

export const ProductFields: Field[] = [
  {
    key: 'name',
    label: 'Nombre del producto',
    type: 'text',
    required: {
      min: 'El nombre del producto es requerido'
    }
  },
  {
    key: 'description',
    label: 'Descripción',
    type: 'textarea'
  },
  {
    key: 'base_price',
    label: 'Precio base',
    type: 'text',
    required: {
      min: 'El precio base es requerido'
    }
  },
  {
    key: 'brand_id',
    label: 'Marca',
    type: 'select',
    placeholder: 'Selecciona una marca',
    selectOptions: []
  },
  {
    key: 'categories',
    label: 'Categorías',
    type: 'checkbox-group',
    checkboxItems: [],
    value: []
  }
]

export const getProductFieldsWithData = (
  brands: Array<{ id: number; name: string }>,
  categories: Array<{ id: number; name: string }>
): Field[] => {
  const brandOptions: SelectOption[] = brands.map((brand) => ({
    value: brand.id.toString(),
    label: brand.name
  }))

  const categoryItems: CheckboxItem[] = categories.map((category) => ({
    id: category.id.toString(),
    name: category.name
  }))

  return ProductFields.map((field) => {
    if (field.key === 'brand_id') {
      return { ...field, selectOptions: brandOptions }
    }
    if (field.key === 'categories') {
      return { ...field, checkboxItems: categoryItems }
    }
    return field
  })
}
