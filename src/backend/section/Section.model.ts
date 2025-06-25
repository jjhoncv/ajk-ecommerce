// Section.model.ts
import { type Sections as SectionRaw } from '@/types/database'
import { type Sections as Section } from '@/types/domain'

// mappers
import { SectionMapper, SectionsMapper } from './Section.mapper'
import oSectionRep from './Section.repository'

export class SectionModel {
  public async getSections(): Promise<Section[] | undefined> {
    const data = await oSectionRep.getSections()
    return SectionsMapper(data)
  }

  public async getSection(id: number): Promise<Section | undefined> {
    const data = await oSectionRep.getSection(id)
    if (data == null) return undefined
    return SectionMapper(data)
  }

  public async getSectionsByRole(
    roleId: number
  ): Promise<Section[] | undefined> {
    const data = await oSectionRep.getSectionsByRole(roleId)
    return SectionsMapper(data)
  }

  public async createSection(
    data: Omit<Section, 'id'>
  ): Promise<Section | undefined> {
    const created = await oSectionRep.createSection(data)
    if (created == null) return undefined
    return SectionMapper(created)
  }

  public async updateSection(
    data: Partial<SectionRaw>,
    id: number
  ): Promise<Section | undefined> {
    const updated = await oSectionRep.updateSection(data, id)
    if (updated == null) return undefined
    return SectionMapper(updated)
  }

  public async deleteSection(id: number): Promise<void> {
    await oSectionRep.deleteSection(id)
  }
}

const sectionModel = new SectionModel()
export default sectionModel
