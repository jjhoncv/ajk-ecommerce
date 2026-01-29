import { TagRepository } from "../core";
import type { CreateTagInput, UpdateTagInput } from "../core";

export const TagService = {
  async getAll() {
    return TagRepository.findAll();
  },

  async getById(id: string) {
    return TagRepository.findById(id);
  },

  async getBySlug(slug: string) {
    return TagRepository.findBySlug(slug);
  },

  async getActive() {
    return TagRepository.findActive();
  },

  async create(input: CreateTagInput) {
    // Validar que el slug no exista
    const existing = await TagRepository.findBySlug(input.slug);
    if (existing) {
      throw new Error("Ya existe un tag con ese slug");
    }
    return TagRepository.create(input);
  },

  async update(id: string, input: UpdateTagInput) {
    // Si se actualiza el slug, validar que no exista
    if (input.slug) {
      const existing = await TagRepository.findBySlug(input.slug);
      if (existing && existing.id !== id) {
        throw new Error("Ya existe un tag con ese slug");
      }
    }
    return TagRepository.update(id, input);
  },

  async delete(id: string) {
    return TagRepository.delete(id);
  },
};
