export const tagsFixtures = {
  valid: {
    name: "Test Tag E2E",
    slug: "test-tag-e2e",
    description: "Tag creado para pruebas E2E",
    color: "#3B82F6",
    isActive: true,
    position: 1,
  },
  invalid: {
    name: "",
    slug: "slug con espacios",
  },
  update: {
    name: "Test Tag E2E Actualizado",
    description: "Descripción actualizada en E2E",
    color: "#EF4444",
  },
};
