import type { Tags as TagsDB } from "@/types/database/database";
import type { TagModel } from "./model";

export const TagMapper = {
  toDomain(db: TagsDB): TagModel {
    return {
      id: db.id,
      name: db.name,
      slug: db.slug,
      description: db.description ?? null,
      color: db.color ?? null,
      isActive: Boolean(db.is_active),
      position: db.position ?? 0,
      createdAt: new Date(db.created_at),
      updatedAt: new Date(db.updated_at),
    };
  },

  toResponse(model: TagModel) {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      description: model.description,
      color: model.color,
      isActive: model.isActive,
      position: model.position,
    };
  },
};
