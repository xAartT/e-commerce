const { query } = require('../config/database');
const { cartQueries } = require('../utils/queries');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const itemsResult = await query(cartQueries.list, [userId]);
    const totalResult = await query(cartQueries.getTotal, [userId]);
    const validItems = itemsResult.rows.filter(item => item.is_visible);
    const invalidItems = itemsResult.rows.filter(item => !item.is_visible);

    if (invalidItems.length > 0) {
      console.log(`${invalidItems.length} itens indisponíveis no carrinho do usuário ${userId}`);
    }

    res.json({
      items: validItems,
      total: parseFloat(totalResult.rows[0].total),
      count: validItems.length,
      unavailable: invalidItems.length
    });
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    res.status(500).json({ error: 'Erro ao buscar carrinho' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.user.id;

    const result = await query(cartQueries.add, [
      userId,
      product_id,
      quantity
    ]);

    res.status(201).json({
      message: 'Item adicionado ao carrinho',
      item: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    
    if (error.code === '23503') {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.status(500).json({ error: 'Erro ao adicionar ao carrinho' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantidade deve ser maior que zero' });
    }

    const result = await query(cartQueries.update, [
      userId,
      product_id,
      quantity
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item não encontrado no carrinho' });
    }

    res.json({
      message: 'Quantidade atualizada',
      item: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar carrinho:', error);
    res.status(500).json({ error: 'Erro ao atualizar carrinho' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { product_id } = req.params;
    const userId = req.user.id;

    const result = await query(cartQueries.remove, [userId, product_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item não encontrado no carrinho' });
    }

    res.json({ message: 'Item removido do carrinho' });
  } catch (error) {
    console.error('Erro ao remover do carrinho:', error);
    res.status(500).json({ error: 'Erro ao remover do carrinho' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await query(cartQueries.clear, [userId]);

    res.json({ message: 'Carrinho limpo com sucesso' });
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    res.status(500).json({ error: 'Erro ao limpar carrinho' });
  }
};