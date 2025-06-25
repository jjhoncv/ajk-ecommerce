// Section.repository.ts
import { executeQuery } from '@/lib/db'
import { type Sections as SectionRaw } from '@/types/database'

export class SectionRepository {
  public async getSections(): Promise<SectionRaw[] | null> {
    const data = await executeQuery<SectionRaw[]>({
      query: 'SELECT * FROM sections ORDER BY display_order'
    })

    if (data.length === 0) return null
    return data
  }

  public async getSection(id: number): Promise<SectionRaw | null> {
    const data = await executeQuery<SectionRaw[]>({
      query: 'SELECT * FROM sections WHERE id = ?',
      values: [id]
    })

    if (data.length === 0) return null
    return data[0]
  }

  public async getSectionsByRole(roleId: number): Promise<SectionRaw[] | null> {
    const sections = await executeQuery<SectionRaw[]>({
      query: `
        SELECT s.* 
        FROM sections s
        JOIN roles_sections rs ON s.id = rs.id_section
        WHERE rs.id_rol = ?
        ORDER BY s.display_order
      `,
      values: [roleId]
    })

    if (sections.length === 0) return null
    return sections
  }

  public async createSection(
    data: Omit<SectionRaw, 'id'>
  ): Promise<SectionRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO sections SET ?',
      values: [data]
    })

    return await this.getSection(result.insertId)
  }

  public async updateSection(
    data: Partial<SectionRaw>,
    id: number
  ): Promise<SectionRaw | null> {
    await executeQuery({
      query: 'UPDATE sections SET ? WHERE id=?',
      values: [data, id]
    })

    return await this.getSection(id)
  }

  public async deleteSection(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM sections WHERE id=?',
      values: [id]
    })
  }

  public async addRoleSection(
    roleId: number,
    sectionId: number
  ): Promise<number> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO roles_sections SET ?',
      values: [{ id_section: sectionId, id_rol: roleId }]
    })
    return result.insertId
  }

  public async removeRoleSection(
    roleId: number,
    sectionId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM roles_sections WHERE id_section = ? AND id_rol = ?',
      values: [sectionId, roleId]
    })
  }

  public async removeAllSectionsByRole(roleId: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM roles_sections WHERE id_rol = ?',
      values: [roleId]
    })
  }
}

const sectionRepository = new SectionRepository()
export default sectionRepository
