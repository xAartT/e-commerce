const { query } = require('../config/database');
const { sellerQueries } = require('../utils/queries');

exports.getDashboard = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const statsResult = await query(sellerQueries.dashboard, [sellerId]);
    const stats = statsResult.rows[0];

    const topProductResult = await query(sellerQueries.topProduct, [sellerId]);
    const topProduct = topProductResult.rows[0] || null;

    res.json({
      dashboard: {
        total_products: stats.total_products,
        total_sold: stats.total_sold,
        total_revenue: parseFloat(stats.total_revenue).toFixed(2),
        top_product: topProduct ? {
          name: topProduct.name,
          id: topProduct.id,
          sold: topProduct.sold
        } : null
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};