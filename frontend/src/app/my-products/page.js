'use client';

import { useState, useEffect } from 'react';
import { productsAPI } from '@/lib/api';
import Papa from 'papaparse';
import { 
  Plus, 
  Upload, 
  Edit, 
  Trash2, 
  X,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
  });
  const [csvProcessing, setCsvProcessing] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productsAPI.getMyProducts();
      setProducts(data.products);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, formData);
        toast.success('Produto atualizado!');
      } else {
        await productsAPI.create(formData);
        toast.success('Produto criado!');
      }
      
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', price: '', description: '', image_url: '' });
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao salvar produto');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      image_url: product.image_url || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente deletar este produto?')) return;

    try {
      await productsAPI.delete(id);
      toast.success('Produto deletado!');
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao deletar produto');
    }
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const products = results.data.map(row => ({
            name: row.name || row.Name,
            price: parseFloat(row.price || row.Price),
            description: row.description || row.Description || '',
            image_url: row.image_url || row['Image URL'] || row.imageUrl || '',
          }));

          await productsAPI.bulkCreate(products);
          toast.success(`${products.length} produtos importados!`);
          fetchProducts();
        } catch (error) {
          toast.error('Erro ao importar CSV');
        } finally {
          setCsvProcessing(false);
          e.target.value = '';
        }
      },
      error: () => {
        toast.error('Erro ao processar CSV');
        setCsvProcessing(false);
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Meus <span className="gradient-text">Produtos</span>
          </h1>
          <p className="text-gray-600">
            {products.length} produtos cadastrados
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="btn btn-outline cursor-pointer relative">
            {csvProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Processando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Importar CSV
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCSVUpload}
                  disabled={csvProcessing}
                />
              </>
            )}
          </label>

          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({ name: '', price: '', description: '', image_url: '' });
              setShowModal(true);
            }}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Produto
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <div className="skeleton h-96"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="card text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Nenhum produto cadastrado
          </h3>
          <p className="text-gray-600 mb-6">
            Comece adicionando seu primeiro produto
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Produto
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          {product.description && (
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-semibold text-primary-600">
                        R$ {parseFloat(product.price).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${product.is_visible ? 'badge-green' : 'bg-gray-200 text-gray-600'}`}>
                        {product.is_visible ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    rows={4}
                    className="input"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-outline flex-1"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingProduct ? 'Atualizar' : 'Criar Produto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}