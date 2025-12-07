const { transaction } = require('../config/database');
const { orderQueries, cartQueries } = require('../utils/queries');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const order = await transaction(async (client) => {
      const cartResult = await client.query(cartQueries.list, [userId]);
      const cartItems = cartResult.rows.filter(item => item.is_visible);

      if (cartItems.length === 0) {
        throw new Error('Carrinho vazio ou produtos indisponíveis');
      }

      const total = cartItems.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity);
      }, 0);

      const orderResult = await client.query(orderQueries.create, [userId, total]);
      const order = orderResult.rows[0];

      for (const item of cartItems) {
        await client.query(orderQueries.createItem, [
          order.id,
          item.product_id,
          item.seller_id || userId,
          item.name,
          item.quantity,
          item.price
        ]);
      }

      await client.query(cartQueries.clear, [userId]);

      return order;
    });

    res.status(201).json({
      message: 'Pedido criado com sucesso',
      order
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ 
      error: error.message || 'Erro ao criar pedido' 
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    const result = await transaction(async (client) => {
      const ordersResult = await client.query(orderQueries.list, [
        userId,
        limit,
        offset
      ]);

      return ordersResult.rows;
    });

    res.json({
      orders: result,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await transaction(async (client) => {
      const orderResult = await client.query(orderQueries.findById, [id, userId]);

      if (orderResult.rows.length === 0) {
        throw new Error('Pedido não encontrado');
      }

      return orderResult.rows[0];
    });

    res.json({ order: result });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    
    if (error.message === 'Pedido não encontrado') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
};