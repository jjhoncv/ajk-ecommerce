// src/module/tags/service/tags/index.ts
import tagModel from '../../core/Tag.model'
import userModel from '@/module/users/core/User.model'
import { type CreateTagData, type UpdateTagData } from './types'

export interface TagWithAudit {
  tag: Awaited<ReturnType<typeof tagModel.getTagById>>
  audit: {
    createdAt: Date | null
    createdByName: string | null
    updatedAt: Date | null
    updatedByName: string | null
  }
}

export const tagService = {
  getTags: async () => {
    const items = await tagModel.getTags()
    return items ?? []
  },

  getActiveTags: async () => {
    const items = await tagModel.getActiveTags()
    return items ?? []
  },

  getTagById: async (id: number) => {
    return await tagModel.getTagById(id)
  },

  getTagBySlug: async (slug: string) => {
    return await tagModel.getTagBySlug(slug)
  },

  getTagWithAudit: async (id: number): Promise<TagWithAudit | null> => {
    const item = await tagModel.getTagById(id)
    if (!item) return null

    const [createdByName, updatedByName] = await Promise.all([
      item.createdBy ? userModel.getUserFullName(item.createdBy) : null,
      item.updatedBy ? userModel.getUserFullName(item.updatedBy) : null
    ])

    return {
      tag: item,
      audit: {
        createdAt: null,
        createdByName,
        updatedAt: null,
        updatedByName
      }
    }
  },

  createTag: async (data: CreateTagData) => {
    return await tagModel.createTag(data)
  },

  updateTag: async (data: UpdateTagData, id: number) => {
    return await tagModel.updateTag(data, id)
  },

  deleteTag: async (id: number) => {
    await tagModel.deleteTag(id)
  }
}

export default tagService
