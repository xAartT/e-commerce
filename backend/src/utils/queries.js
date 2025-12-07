// src/utils/queries.js

const userQueries = {
  create: `
    INSERT INTO users (email, password_hash, role)
    VALUES ($1, $2, $3)
    RETURNING id, email, role, is_active, created_at
  `,
  findByEmail: `
    SELECT * FROM users WHERE email = $1
  `,
  findById: `
    SELECT id, email, role, is_active, created_at
    FROM users WHERE id = $1
  `,
  deleteAccount: `
    DELETE FROM users WHERE id = $1 AND role = 'CLIENT'
    RETURNING id
  `,
  deactivateAccount: `
    UPDATE users SET is_active = false
    WHERE id = $1 AND role = 'SELLER'
    RETURNING id
  `,
  hideSellerProducts: `
    UPDATE products SET is_visible = false
    WHERE seller_id = $1
  `
};

const productQueries = {
  create: `
    INSERT INTO products (seller_id, name, price, description, image_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `,
  bulkInsert: `
    INSERT INTO products (seller_id, name, price, description, image_url)
    SELECT $1, data.name, data.price, data.description, data.image_url
    FROM json_to_recordset($2) AS data(name text, price numeric, description text, image_url text)
    RETURNING *
  `,
  list: `
    SELECT p.*, 
           u.email as seller_email,
           EXISTS(SELECT 1 FROM favorites WHERE user_id = $4 AND product_id = p.id) as is_favorited
    FROM products p
    JOIN users u ON p.seller_id = u.id
    WHERE p.is_visible = true
    AND ($1::text IS NULL OR p.name ILIKE $1)
    ORDER BY p.published_at DESC
    LIMIT $2 OFFSET $3
  `,
  count: `
    SELECT COUNT(*) as total
    FROM products
    WHERE is_visible = true
    AND ($1::text IS NULL OR name ILIKE $1)
  `,
  findById: `
    SELECT p.*, u.email as seller_email
    FROM products p
    JOIN users u ON p.seller_id = u.id
    WHERE p.id = $1 AND p.is_visible = true
  `,
  findBySeller: `
    SELECT * FROM products
    WHERE seller_id = $1
    ORDER BY created_at DESC
  `,
  update: `
    UPDATE products
    SET name = $2, price = $3, description = $4, image_url = $5
    WHERE id = $1 AND seller_id = $6
    RETURNING *
  `,
  delete: `
    DELETE FROM products
    WHERE id = $1 AND seller_id = $2
    RETURNING id
  `
};

const favoriteQueries = {
  add: `
    INSERT INTO favorites (user_id, product_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *
  `,
  remove: `
    DELETE FROM favorites
    WHERE user_id = $1 AND product_id = $2
    RETURNING *
  `,
  list: `
    SELECT p.*, u.email as seller_email
    FROM favorites f
    JOIN products p ON f.product_id = p.id
    JOIN users u ON p.seller_id = u.id
    WHERE f.user_id = $1 AND p.is_visible = true
    ORDER BY f.created_at DESC
  `,
  check: `
    SELECT EXISTS(
      SELECT 1 FROM favorites 
      WHERE user_id = $1 AND product_id = $2
    ) as is_favorited
  `
};

const cartQueries = {
  add: `
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET quantity = cart_items.quantity + $3
    RETURNING *
  `,
  update: `
    UPDATE cart_items
    SET quantity = $3
    WHERE user_id = $1 AND product_id = $2
    RETURNING *
  `,
  remove: `
    DELETE FROM cart_items
    WHERE user_id = $1 AND product_id = $2
    RETURNING *
  `,
  clear: `
    DELETE FROM cart_items WHERE user_id = $1
  `,
  list: `
    SELECT c.*, p.name, p.price, p.image_url, p.is_visible,
           (c.quantity * p.price) as subtotal
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = $1
    ORDER BY c.added_at DESC
  `,
  getTotal: `
    SELECT COALESCE(SUM(c.quantity * p.price), 0) as total
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = $1 AND p.is_visible = true
  `
};

const orderQueries = {
  create: `
    INSERT INTO orders (user_id, total)
    VALUES ($1, $2)
    RETURNING *
  `,
  createItem: `
    INSERT INTO order_items (order_id, product_id, seller_id, product_name, quantity, price)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `,
  list: `
    SELECT * FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `,
  findById: `
    SELECT o.*,
           json_agg(
             json_build_object(
               'id', oi.id,
               'product_id', oi.product_id,
               'product_name', oi.product_name,
               'quantity', oi.quantity,
               'price', oi.price,
               'subtotal', oi.quantity * oi.price
             )
           ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.id = $1 AND o.user_id = $2
    GROUP BY o.id
  `
};

const sellerQueries = {
  dashboard: `
    SELECT 
      COUNT(DISTINCT p.id)::integer as total_products,
      COALESCE(SUM(oi.quantity), 0)::integer as total_sold,
      COALESCE(SUM(oi.quantity * oi.price), 0)::numeric as total_revenue
    FROM products p
    LEFT JOIN order_items oi ON p.id = oi.product_id
    WHERE p.seller_id = $1
  `,
  topProduct: `
    SELECT p.name, p.id, SUM(oi.quantity)::integer as sold
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    WHERE p.seller_id = $1
    GROUP BY p.id, p.name
    ORDER BY sold DESC
    LIMIT 1
  `
};

module.exports = {
  userQueries,
  productQueries,
  favoriteQueries,
  cartQueries,
  orderQueries,
  sellerQueries
};