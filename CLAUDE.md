# Makako Suplementos — App Context

## Qué es esta app
Sistema de gestión interna + catálogo de clientes para Makako Suplementos (tienda de suplementos deportivos en Chile).

**Email:** makakosuplementos@gmail.com  
**GitHub:** fipe6/catalogo-makako

## Supabase
- **Proyecto:** makako os
- **Project ID:** jmvbdjahitdhbvrfblnh
- **URL:** https://jmvbdjahitdhbvrfblnh.supabase.co
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptdmJkamFoaXRkaGJ2cmZibG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxODU2ODksImV4cCI6MjA5NTc2MTY4OX0.6q_M4V6y53sUEr-20MzkSOTZTLL5nthwLLFLPhCsi8o

## Tablas principales

### `inventario` — fuente de verdad del stock
| columna | tipo | descripción |
|---|---|---|
| id | uuid | PK |
| producto | text | nombre del producto (único) |
| stock_actual | int | unidades disponibles |
| stock_minimo | int | alerta de stock bajo (default 3) |
| precio_costo | int | costo de compra en CLP |
| precio_venta | int | precio de venta en CLP |
| margen_porcentaje | numeric | calculado automáticamente |
| activo | boolean | si se muestra en catálogo |
| updated_at | timestamp | última modificación |

### `app_data` — estado de la app (clave-valor JSON)
La app de gestión guarda todo el estado en esta tabla como JSON blobs.
| clave | contenido |
|---|---|
| macaco:productos | array de productos con stock (SINCRONIZADO con `inventario` via trigger) |
| macaco:ventas | historial de ventas |
| macaco:movimientos | movimientos de stock |
| macaco:caja | saldo actual de caja |
| macaco:gastos | registro de gastos |
| macaco:deudas | deudas del negocio |
| macaco:config | configuración (meta diaria, mensual, colchón mínimo) |

### `ventas` (86 filas) — ventas registradas en SQL
| columna | tipo |
|---|---|
| fecha | date |
| producto | text |
| cantidad | int |
| precio_unitario | int |
| precio_total | int |
| metodo_pago | text |
| canal | text |
| notas | text |

### `caja` (4 filas) — movimientos de caja
- tipo: 'entrada' o 'salida'

### `deudas` (4 filas) — deudas del negocio
- estado: 'activa', 'pagada', 'parcial'

### `metas` (6 filas) — metas mensuales de ventas

### `productos` — catálogo público (RLS activo, filtro visible=true)
### `products` + `categories` — nuevo catálogo (RLS activo, lectura pública)

## Arquitectura actual
La app de gestión (repo macaco-os-, en JavaScript) lee/escribe EXCLUSIVAMENTE en `app_data`.  
La tabla `inventario` se mantiene sincronizada con `app_data.macaco:productos` via trigger `trg_sync_inventario_to_app_data`.

## Precios
Todos los precios son en **CLP (pesos chilenos)**. Formatear como `$XX.XXX`.

## Para consultar datos con Supabase MCP
Usa el project_id: `jmvbdjahitdhbvrfblnh`

Ejemplo de queries frecuentes:
- Ver inventario: `SELECT producto, stock_actual, precio_venta FROM inventario WHERE activo = true ORDER BY producto`
- Ver ventas del mes: `SELECT producto, SUM(precio_total) FROM ventas WHERE fecha >= date_trunc('month', now()) GROUP BY producto`
- Ver caja actual: `SELECT valor FROM app_data WHERE clave = 'macaco:caja'`
