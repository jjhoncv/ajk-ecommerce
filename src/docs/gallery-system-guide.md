# Sistema de Galería de Imágenes para E-commerce AJK

## Resumen

Este documento describe el sistema de galería de imágenes mejorado implementado para el e-commerce AJK, que soporta múltiples tamaños de imagen, tipos de vista y asociaciones con atributos de productos.

## Estructura de Base de Datos

### 1. Tabla `variant_images` (Modificada)

```sql
CREATE TABLE `variant_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `variant_id` int(11) NOT NULL,
  `image_type` enum('front','back','left','right','top','bottom','detail','lifestyle','packaging') NOT NULL DEFAULT 'front',
  `image_url_thumb` varchar(255) NOT NULL COMMENT 'Imagen thumbnail 140x140',
  `image_url_normal` varchar(255) NOT NULL COMMENT 'Imagen normal 600x800',
  `image_url_zoom` varchar(255) NOT NULL COMMENT 'Imagen zoom 1200x1200',
  `is_primary` tinyint(1) DEFAULT '0' COMMENT 'Imagen principal de la variante',
  `display_order` int(11) DEFAULT '0' COMMENT 'Orden de visualización',
  `alt_text` varchar(255) DEFAULT NULL COMMENT 'Texto alternativo para SEO',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_variant` (`variant_id`),
  KEY `idx_type_order` (`image_type`, `display_order`),
  CONSTRAINT `fk_vi_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Características:**

- **Múltiples tamaños**: Cada imagen tiene 3 versiones (thumb, normal, zoom)
- **Tipos de imagen**: 9 tipos diferentes para diferentes vistas del producto
- **Orden de visualización**: Control del orden en que aparecen las imágenes
- **SEO optimizado**: Texto alternativo para cada imagen

### 2. Tabla `attribute_option_images` (Nueva)

```sql
CREATE TABLE `attribute_option_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_option_id` int(11) NOT NULL,
  `image_url_thumb` varchar(255) NOT NULL COMMENT 'Imagen thumbnail 140x140 para selector de atributo',
  `image_url_normal` varchar(255) DEFAULT NULL COMMENT 'Imagen normal 600x800 (opcional)',
  `image_url_zoom` varchar(255) DEFAULT NULL COMMENT 'Imagen zoom 1200x1200 (opcional)',
  `alt_text` varchar(255) DEFAULT NULL COMMENT 'Texto alternativo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attribute_option` (`attribute_option_id`),
  KEY `idx_attribute_option` (`attribute_option_id`),
  CONSTRAINT `fk_aoi_attribute_option` FOREIGN KEY (`attribute_option_id`) REFERENCES `attribute_options` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Propósito:**

- Almacena imágenes específicas para opciones de atributos (especialmente colores)
- Se usa en los selectores de atributos para mostrar previsualizaciones
- Mejora la experiencia de usuario al seleccionar colores

### 3. Tabla `variant_image_attribute_options` (Nueva)

```sql
CREATE TABLE `variant_image_attribute_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `variant_image_id` int(11) NOT NULL,
  `attribute_option_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_image_attribute` (`variant_image_id`, `attribute_option_id`),
  KEY `idx_variant_image` (`variant_image_id`),
  KEY `idx_attribute_option` (`attribute_option_id`),
  CONSTRAINT `fk_viao_variant_image` FOREIGN KEY (`variant_image_id`) REFERENCES `variant_images` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_viao_attribute_option` FOREIGN KEY (`attribute_option_id`) REFERENCES `attribute_options` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Propósito:**

- Asocia imágenes de variantes con opciones de atributos específicas
- Permite filtrar imágenes por color u otros atributos
- Facilita el cambio automático de imágenes al seleccionar atributos

## Tamaños de Imagen Soportados

| Tamaño     | Dimensiones | Uso                                 |
| ---------- | ----------- | ----------------------------------- |
| **Thumb**  | 140x140px   | Thumbnails, selectores de atributos |
| **Normal** | 600x800px   | Vista principal del producto        |
| **Zoom**   | 1200x1200px | Modal de zoom, vista ampliada       |

## Tipos de Imagen

| Tipo        | Descripción              | Uso                                  |
| ----------- | ------------------------ | ------------------------------------ |
| `front`     | Vista frontal            | Imagen principal del producto        |
| `back`      | Vista trasera            | Vista posterior del producto         |
| `left`      | Vista lateral izquierda  | Perfil izquierdo                     |
| `right`     | Vista lateral derecha    | Perfil derecho                       |
| `top`       | Vista superior           | Vista desde arriba                   |
| `bottom`    | Vista inferior           | Vista desde abajo                    |
| `detail`    | Detalle específico       | Características especiales, texturas |
| `lifestyle` | Imagen de estilo de vida | Producto en uso, contexto            |
| `packaging` | Empaque                  | Caja, presentación del producto      |

## Estructura de Archivos

```
public/images/products/
├── iphone-16/
│   └── pro-max/
│       ├── iphone-16-pro-max-titanio-blanco-1-thumb.webp     (140x140)
│       ├── iphone-16-pro-max-titanio-blanco-1-default.webp   (600x800)
│       ├── iphone-16-pro-max-titanio-blanco-1-zoom.webp      (1200x1200)
│       ├── iphone-16-pro-max-titanio-blanco-2-thumb.webp
│       ├── iphone-16-pro-max-titanio-blanco-2-default.webp
│       ├── iphone-16-pro-max-titanio-blanco-2-zoom.webp
│       ├── iphone-16-pro-max-titanio-blanco-attr-thumb.webp  (Para selector)
│       ├── iphone-16-pro-max-titanio-negro-attr-thumb.webp
│       ├── iphone-16-pro-max-titanio-natural-attr-thumb.webp
│       └── iphone-16-pro-max-titanio-desierto-attr-thumb.webp
└── zapatillas/
    └── nike-jordan-sky/
        ├── nike-jordan-sky-white-1-thumb.webp
        ├── nike-jordan-sky-white-1-default.webp
        ├── nike-jordan-sky-white-1-zoom.webp
        ├── nike-jordan-sky-white-attr-thumb.webp
        ├── nike-jordan-sky-black-attr-thumb.webp
        └── nike-jordan-sky-red-attr-thumb.webp
```

## Componentes Frontend

### 1. ProductImageSlider

**Ubicación:** `src/components/product/ProductImageSlider.tsx`

**Características:**

- Slider principal con navegación por flechas
- Thumbnails clicables
- Botón de zoom integrado
- Badge que muestra el tipo de imagen
- Soporte para múltiples tamaños de imagen
- Optimización con Next.js Image

**Props:**

```typescript
interface ProductImageSliderProps {
  images: VariantImageDTO[];
  productName: string;
  onImageZoom?: (imageUrl: string) => void;
}
```

### 2. ProductAttributes

**Ubicación:** `src/components/product/ProductAttributes.tsx`

**Características:**

- Selectores dinámicos según el tipo de atributo
- Soporte especial para colores con imágenes
- Validación de disponibilidad de combinaciones
- Diferentes estilos de visualización (color, pills, radio, select)

**Tipos de selectores:**

- **Color**: Muestra imágenes o círculos de color
- **Pills**: Botones tipo píldora
- **Radio**: Botones tipo radio en grid
- **Select**: Dropdown tradicional

### 3. ImageZoomModal

**Ubicación:** `src/components/ui/ImageZoomModal.tsx`

**Características:**

- Modal fullscreen para zoom de imágenes
- Cierre por click en backdrop o botón X
- Optimizado para imágenes de alta resolución
- Responsive y accesible

### 4. ProductDetail

**Ubicación:** `src/components/product/ProductDetail.tsx`

**Características:**

- Integra todos los componentes de galería
- Maneja el estado del modal de zoom
- Layout responsive de 2 columnas
- Información completa del producto

## DTOs (Data Transfer Objects)

### VariantImageDTO

```typescript
export interface VariantImageDTO {
  id: number;
  variantId: number;
  imageType:
    | "front"
    | "back"
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "detail"
    | "lifestyle"
    | "packaging";
  imageUrlThumb: string; // 140x140
  imageUrlNormal: string; // 600x800
  imageUrlZoom: string; // 1200x1200
  isPrimary: boolean;
  displayOrder: number;
  altText?: string;
  createdAt: Date;
  updatedAt: Date;
  associatedAttribute?: {
    attributeId: number;
    attributeName: string;
    optionId: number;
    optionValue: string;
  };
}
```

### AttributeOptionImageDTO

```typescript
export interface AttributeOptionImageDTO {
  id: number;
  attributeOptionId: number;
  imageUrlThumb: string; // 140x140
  imageUrlNormal?: string; // 600x800 (opcional)
  imageUrlZoom?: string; // 1200x1200 (opcional)
  altText?: string;
  createdAt: Date;
  updatedAt: Date;
  attribute: {
    id: number;
    name: string;
    displayType: string;
  };
  option: {
    id: number;
    value: string;
    additionalCost: number;
  };
}
```

## Ejemplos de Uso

### iPhone 16 Pro Max

```sql
-- Producto
INSERT INTO products (name, description, brand_id) VALUES
('iPhone 16 Pro Max', 'El iPhone más avanzado', 1);

-- Variantes por color
INSERT INTO product_variants (product_id, sku, price) VALUES
(5, 'IPHONE16PM-TITANIO-BLANCO-256GB', 1199.99),
(5, 'IPHONE16PM-TITANIO-NEGRO-256GB', 1199.99);

-- Imágenes de la variante blanca
INSERT INTO variant_images (variant_id, image_type, image_url_thumb, image_url_normal, image_url_zoom, is_primary, display_order) VALUES
(11, 'front', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-1-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-1-default.webp', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-1-zoom.webp', 1, 1),
(11, 'back', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-2-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-2-default.webp', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-2-zoom.webp', 0, 2);

-- Imágenes para selectores de color
INSERT INTO attribute_option_images (attribute_option_id, image_url_thumb) VALUES
(28, '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-attr-thumb.webp'),
(29, '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-negro-attr-thumb.webp');
```

### Zapatillas Nike

```sql
-- Producto
INSERT INTO products (name, description, brand_id) VALUES
('Zapatilla Nike Urban Jordan Sky', 'Zapatillas urbanas de alta calidad', 2);

-- Variantes por color y talla
INSERT INTO product_variants (product_id, sku, price) VALUES
(6, 'NIKE-JORDAN-SKY-WHITE-39', 299.99),
(6, 'NIKE-JORDAN-SKY-BLACK-39', 299.99);

-- Imágenes de la variante blanca
INSERT INTO variant_images (variant_id, image_type, image_url_thumb, image_url_normal, image_url_zoom, is_primary, display_order) VALUES
(12, 'front', '/images/products/zapatillas/nike-jordan-sky/nike-jordan-sky-white-1-thumb.webp', '/images/products/zapatillas/nike-jordan-sky/nike-jordan-sky-white-1-default.webp', '/images/products/zapatillas/nike-jordan-sky/nike-jordan-sky-white-1-zoom.webp', 1, 1);

-- Imágenes para selectores de color
INSERT INTO attribute_option_images (attribute_option_id, image_url_thumb) VALUES
(35, '/images/products/zapatillas/nike-jordan-sky/nike-jordan-sky-white-attr-thumb.webp'),
(36, '/images/products/zapatillas/nike-jordan-sky/nike-jordan-sky-black-attr-thumb.webp');
```

## Ventajas del Sistema

### 1. **Experiencia de Usuario Mejorada**

- Visualización clara de diferentes ángulos del producto
- Zoom de alta calidad para ver detalles
- Selectores de color con previsualizaciones visuales
- Navegación intuitiva entre imágenes

### 2. **SEO Optimizado**

- Texto alternativo para todas las imágenes
- Estructura semántica correcta
- Optimización de carga con Next.js Image

### 3. **Rendimiento**

- Múltiples tamaños para diferentes contextos
- Carga progresiva de imágenes
- Optimización automática con Next.js

### 4. **Escalabilidad**

- Estructura flexible para diferentes tipos de productos
- Fácil adición de nuevos tipos de imagen
- Soporte para múltiples atributos visuales

### 5. **Mantenibilidad**

- Código modular y reutilizable
- DTOs tipados para TypeScript
- Separación clara de responsabilidades

## Próximos Pasos

1. **Implementar carga de imágenes**

   - Sistema de upload para administradores
   - Redimensionamiento automático
   - Optimización de formatos (WebP, AVIF)

2. **Funcionalidades avanzadas**

   - Vista 360° para productos seleccionados
   - Zoom con lupa en hover
   - Comparación visual entre variantes

3. **Optimizaciones**

   - Lazy loading inteligente
   - Preload de imágenes relacionadas
   - CDN para distribución global

4. **Analytics**
   - Tracking de interacciones con imágenes
   - Análisis de conversión por tipo de imagen
   - Optimización basada en datos

Este sistema proporciona una base sólida y escalable para la galería de imágenes del e-commerce, mejorando significativamente la experiencia de compra del usuario.
