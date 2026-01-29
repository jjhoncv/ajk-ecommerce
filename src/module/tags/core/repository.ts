import { executeQuery } from "@/lib/db";
import type { Tags as TagsDB } from "@/types/database/database";
import type { TagModel, CreateTagInput, UpdateTagInput } from "./model";
import { TagMapper } from "./mapper";
import { v4 as uuidv4 } from "uuid";

export const TagRepository = {
  async findAll(): Promise<TagModel[]> {
    const results = await executeQuery<TagsDB[]>({
      query: "SELECT * FROM tags ORDER BY position ASC, name ASC",
    });
    return results.map(TagMapper.toDomain);
  },

  async findById(id: string): Promise<TagModel | null> {
    const results = await executeQuery<TagsDB[]>({
      query: "SELECT * FROM tags WHERE id = ? LIMIT 1",
      values: [id],
    });
    return results[0] ? TagMapper.toDomain(results[0]) : null;
  },

  async findBySlug(slug: string): Promise<TagModel | null> {
    const results = await executeQuery<TagsDB[]>({
      query: "SELECT * FROM tags WHERE slug = ? LIMIT 1",
      values: [slug],
    });
    return results[0] ? TagMapper.toDomain(results[0]) : null;
  },

  async findActive(): Promise<TagModel[]> {
    const results = await executeQuery<TagsDB[]>({
      query: "SELECT * FROM tags WHERE is_active = 1 ORDER BY position ASC, name ASC",
    });
    return results.map(TagMapper.toDomain);
  },

  async create(input: CreateTagInput): Promise<TagModel> {
    const id = uuidv4();
    await executeQuery({
      query: `
        INSERT INTO tags (id, name, slug, description, color, is_active, position)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        id,
        input.name,
        input.slug,
        input.description || null,
        input.color || null,
        input.isActive ?? true,
        input.position ?? 0,
      ],
    });
    return this.findById(id) as Promise<TagModel>;
  },

  async update(id: string, input: UpdateTagInput): Promise<TagModel | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined) {
      fields.push("name = ?");
      values.push(input.name);
    }
    if (input.slug !== undefined) {
      fields.push("slug = ?");
      values.push(input.slug);
    }
    if (input.description !== undefined) {
      fields.push("description = ?");
      values.push(input.description);
    }
    if (input.color !== undefined) {
      fields.push("color = ?");
      values.push(input.color);
    }
    if (input.isActive !== undefined) {
      fields.push("is_active = ?");
      values.push(input.isActive);
    }
    if (input.position !== undefined) {
      fields.push("position = ?");
      values.push(input.position);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await executeQuery({
      query: `UPDATE tags SET ${fields.join(", ")} WHERE id = ?`,
      values,
    });
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await executeQuery<{ affectedRows: number }>({
      query: "DELETE FROM tags WHERE id = ?",
      values: [id],
    });
    return (result as any).affectedRows > 0;
  },
};
