import type { Tags as TagsDB } from "@/types/database/database";

export interface TagModel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  isActive: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTagInput {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  isActive?: boolean;
  position?: number;
}

export interface UpdateTagInput {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
  position?: number;
}
