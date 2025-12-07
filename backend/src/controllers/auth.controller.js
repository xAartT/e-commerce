const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { userQueries } = require('../utils/queries');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await query(userQueries.findByEmail, [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await query(userQueries.create, [email, passwordHash, role]);
    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await query(userQueries.findByEmail, [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: 'Conta desativada' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const result = await query(userQueries.findById, [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const result = await query(userQueries.deleteAccount, [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ 
        error: 'Não foi possível deletar a conta. Apenas clientes podem deletar.' 
      });
    }

    res.json({ message: 'Conta deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    res.status(500).json({ error: 'Erro ao deletar conta' });
  }
};

exports.deactivateAccount = async (req, res) => {
  try {
    const userResult = await query(userQueries.deactivateAccount, [req.user.id]);
    
    if (userResult.rows.length === 0) {
      return res.status(400).json({ 
        error: 'Não foi possível desativar a conta. Apenas vendedores podem desativar.' 
      });
    }

    await query(userQueries.hideSellerProducts, [req.user.id]);

    res.json({ 
      message: 'Conta desativada com sucesso. Seus produtos foram ocultados.' 
    });
  } catch (error) {
    console.error('Erro ao desativar conta:', error);
    res.status(500).json({ error: 'Erro ao desativar conta' });
  }
};