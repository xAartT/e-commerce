const { query } = require('../config/database');
const { productQueries, favoriteQueries } = require('../utils/queries');

exports.listProducts = async (req, res) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    const searchPattern = search ? `%${search}%` : null;
    const userId = req.user?.id || null;

    const productsResult = await query(productQueries.list, [
      searchPattern,
      limit,
      offset,
      userId
    ]);

    const countResult = await query(productQueries.count, [searchPattern]);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      products: productsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(productQueries.findById, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    if (req.user) {
      const favResult = await query(favoriteQueries.check, [req.user.id, id]);
      result.rows[0].is_favorited = favResult.rows[0].is_favorited;
    }

    res.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, image_url } = req.body;
    const sellerId = req.user.id;

    const result = await query(productQueries.create, [
      sellerId,
      name,
      price,
      description,
      image_url || null
    ]);

    res.status(201).json({
      message: 'Produto criado com sucesso',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

exports.bulkCreateProducts = async (req, res) => {
  try {
    const { products } = req.body;
    const sellerId = req.user.id;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Nenhum produto fornecido' });
    }

    const isValid = products.every(p => 
      p.name && p.price && !isNaN(parseFloat(p.price))
    );

    if (!isValid) {
      return res.status(400).json({ 
        error: 'Produtos inválidos. Certifique-se que todos têm nome e preço.' 
      });
    }

    const result = await query(productQueries.bulkInsert, [
      sellerId,
      JSON.stringify(products)
    ]);

    res.status(201).json({
      message: `${result.rowCount} produtos criados com sucesso`,
      count: result.rowCount,
      products: result.rows
    });
  } catch (error) {
    console.error('Erro ao criar produtos em lote:', error);
    res.status(500).json({ error: 'Erro ao criar produtos em lote' });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const result = await query(productQueries.findBySeller, [req.user.id]);

    res.json({
      products: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao buscar produtos do vendedor:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image_url } = req.body;
    const sellerId = req.user.id;

    const result = await query(productQueries.update, [
      id,
      name,
      price,
      description,
      image_url || null,
      sellerId
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Produto não encontrado ou você não tem permissão' 
      });
    }

    res.json({
      message: 'Produto atualizado com sucesso',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    const result = await query(productQueries.delete, [id, sellerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Produto não encontrado ou você não tem permissão' 
      });
    }

    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    await query(favoriteQueries.add, [userId, productId]);

    res.json({ message: 'Produto adicionado aos favoritos' });
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    res.status(500).json({ error: 'Erro ao adicionar favorito' });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await query(favoriteQueries.remove, [userId, productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorito não encontrado' });
    }

    res.json({ message: 'Produto removido dos favoritos' });
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    res.status(500).json({ error: 'Erro ao remover favorito' });
  }
};

exports.listFavorites = async (req, res) => {
  try {
    const result = await query(favoriteQueries.list, [req.user.id]);

    res.json({
      favorites: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao listar favoritos:', error);
    res.status(500).json({ error: 'Erro ao listar favoritos' });
  }
};