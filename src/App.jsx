import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Upload,
  FileText,
  TrendingUp,
  DollarSign,
  Calendar,
  Filter,
  Plus,
  Trash2,
  Edit,
  Download,
  Moon,
  Sun
} from 'lucide-react';

const App = () => {
  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterProvider, setFilterProvider] = useState('all');
  const [filterYear, setFilterYear] = useState('2024');
  const [loading, setLoading] = useState(true);

  const [newInvoice, setNewInvoice] = useState({
    date: '',
    provider: '',
    amount: '',
    tax: '',
    concept: ''
  });

  useEffect(() => {
    loadInvoices();
  }, []);

  const addSampleData = async () => {
    const sampleData = [
      { date: '2024-01-15', provider: 'O2', amount: 45.99, tax: 9.66, concept: 'Telefonía móvil', total: 55.65 },
      { date: '2024-02-15', provider: 'O2', amount: 45.99, tax: 9.66, concept: 'Telefonía móvil', total: 55.65 },
      { date: '2024-03-15', provider: 'O2', amount: 49.99, tax: 10.50, concept: 'Telefonía móvil', total: 60.49 },
      { date: '2024-04-15', provider: 'Endesa', amount: 89.50, tax: 18.80, concept: 'Electricidad', total: 108.30 },
      { date: '2024-05-15', provider: 'O2', amount: 45.99, tax: 9.66, concept: 'Telefonía móvil', total: 55.65 },
      { date: '2024-06-15', provider: 'Endesa', amount: 95.20, tax: 19.99, concept: 'Electricidad', total: 115.19 },
      { date: '2024-07-15', provider: 'O2', amount: 45.99, tax: 9.66, concept: 'Telefonía móvil', total: 55.65 },
      { date: '2024-08-15', provider: 'Endesa', amount: 102.30, tax: 21.48, concept: 'Electricidad', total: 123.78 },
      { date: '2024-09-15', provider: 'O2', amount: 45.99, tax: 9.66, concept: 'Telefonía móvil', total: 55.65 },
      { date: '2024-10-15', provider: 'Endesa', amount: 88.90, tax: 18.67, concept: 'Electricidad', total: 107.57 },
      { date: '2024-11-15', provider: 'O2', amount: 45.99, tax: 9.66, concept: 'Telefonía móvil', total: 55.65 },
      { date: '2024-12-15', provider: 'Endesa', amount: 91.40, tax: 19.19, concept: 'Electricidad', total: 110.59 }
    ];

    if (window.electronAPI) {
      for (const inv of sampleData) {
        await window.electronAPI.addInvoice(inv);
      }
    } else {
      const withIds = sampleData.map((inv, idx) => ({ ...inv, id: idx + 1 }));
      setInvoices(withIds);
      localStorage.setItem('invoices', JSON.stringify(withIds));
    }
  };

  const loadInvoices = async () => {
    setLoading(true);
    try {
      if (window.electronAPI) {
        const data = await window.electronAPI.getInvoices();
        setInvoices(data);
        if (data.length === 0) {
          await addSampleData();
          const refreshed = await window.electronAPI.getInvoices();
          setInvoices(refreshed);
        }
      } else {
        const saved = localStorage.getItem('invoices');
        if (saved) {
          setInvoices(JSON.parse(saved));
        } else {
          await addSampleData();
        }
      }
    } catch (err) {
      console.error('Error loading invoices', err);
    }
    setLoading(false);
  };

  const addInvoice = async () => {
    if (!newInvoice.date || !newInvoice.provider || !newInvoice.amount) return;

    const invoice = {
      date: newInvoice.date,
      provider: newInvoice.provider,
      amount: parseFloat(newInvoice.amount),
      tax: parseFloat(newInvoice.tax) || 0,
      concept: newInvoice.concept || 'Servicios',
      total: parseFloat(newInvoice.amount) + (parseFloat(newInvoice.tax) || 0)
    };

    try {
      if (window.electronAPI) {
        await window.electronAPI.addInvoice(invoice);
        await loadInvoices();
      } else {
        const newInv = { ...invoice, id: Date.now() };
        const updated = [...invoices, newInv];
        setInvoices(updated);
        localStorage.setItem('invoices', JSON.stringify(updated));
      }
      setNewInvoice({ date: '', provider: '', amount: '', tax: '', concept: '' });
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding invoice', err);
      alert('Error al guardar la factura');
    }
  };

  const deleteInvoice = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta factura?')) return;

    try {
      if (window.electronAPI) {
        await window.electronAPI.deleteInvoice(id);
        await loadInvoices();
      } else {
        const updated = invoices.filter((inv) => inv.id !== id);
        setInvoices(updated);
        localStorage.setItem('invoices', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Error deleting invoice', err);
      alert('Error al eliminar la factura');
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchProvider = filterProvider === 'all' || inv.provider === filterProvider;
    const matchYear = inv.date?.startsWith(filterYear);
    return matchProvider && matchYear;
  });

  const totalSpent = filteredInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const avgMonthly = totalSpent / 12;
  const providers = [...new Set(invoices.map((inv) => inv.provider))].filter(Boolean);

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthStr = month.toString().padStart(2, '0');
    const monthInvoices = filteredInvoices.filter((inv) => inv.date?.startsWith(`${filterYear}-${monthStr}`));
    const total = monthInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    return {
      month: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      total: parseFloat(total.toFixed(2))
    };
  });

  const providerData = providers.map((provider) => {
    const providerInvoices = filteredInvoices.filter((inv) => inv.provider === provider);
    const total = providerInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    return { name: provider, value: parseFloat(total.toFixed(2)) };
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold">Analizador de Facturas</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              Agregar Factura
            </button>
          </div>
        </div>
      </header>

      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            {['dashboard', 'facturas', 'config'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-500'
                    : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                <select
                  value={filterProvider}
                  onChange={(e) => setFilterProvider(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
                >
                  <option value="all">Todos los proveedores</option>
                  {providers.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 font-mono text-sm`}>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Ubicación: {window.electronAPI ? 'userData/invoices.db' : 'localStorage (modo web)'}
                </p>
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total registros: {invoices.length}
                </p>
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gasto Total</p>
                    <p className="text-3xl font-bold mt-2">€{totalSpent.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-12 h-12 text-blue-500 opacity-80" />
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Promedio Mensual</p>
                    <p className="text-3xl font-bold mt-2">€{avgMonthly.toFixed(2)}</p>
                  </div>
                  <Calendar className="w-12 h-12 text-green-500 opacity-80" />
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Facturas</p>
                    <p className="text-3xl font-bold mt-2">{filteredInvoices.length}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-purple-500 opacity-80" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-xl font-bold mb-4">Evolución Mensual</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Total (€)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-xl font-bold mb-4">Distribución por Proveedor</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={providerData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {providerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="text-xl font-bold mb-4">Comparativa Mensual</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="total" fill="#10b981" name="Total (€)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'facturas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Listado de Facturas</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
                <Download className="w-5 h-5" />
                Exportar Excel
              </button>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Proveedor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Concepto</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Base</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">IVA</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                        <td className="px-6 py-4 whitespace-nowrap">{invoice.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{invoice.provider}</td>
                        <td className="px-6 py-4">{invoice.concept}</td>
                        <td className="px-6 py-4 text-right">€{invoice.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">€{invoice.tax.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right font-bold">€{invoice.total.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteInvoice(invoice.id)}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Configuración</h2>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="text-xl font-semibold mb-4">Importar Facturas</h3>
              <div className="space-y-4">
                <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg p-8 text-center`}>
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg mb-2">Arrastra PDFs aquí o haz clic para seleccionar</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Soporta: PDF, Excel, CSV</p>
                  <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">Seleccionar Archivos</button>
                </div>

                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                  <h4 className="font-semibold mb-2">Integración Ollama (Opcional)</h4>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Activa la extracción inteligente de datos usando IA local
                  </p>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="ollama" className="w-4 h-4" />
                    <label htmlFor="ollama">Usar Ollama para extracción automática</label>
                  </div>
                  <input
                    type="text"
                    placeholder="http://localhost:11434"
                    className={`mt-3 w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="text-xl font-semibold mb-4">Gestión de Datos</h3>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg">
                  <Download className="w-5 h-5" />
                  Exportar Base de Datos
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg">
                  <Upload className="w-5 h-5" />
                  Importar Base de Datos
                </button>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="text-xl font-semibold mb-4">Base de Datos SQLite</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                Los datos se guardan localmente en formato SQLite
              </p>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 font-mono text-sm`}>
                <p>Ruta: {window.electronAPI ? '~/.config/Invoice Analyzer/invoices.db' : 'localStorage'}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full shadow-2xl`}>
            <h3 className="text-2xl font-bold mb-4">Agregar Factura</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fecha</label>
                <input
                  type="date"
                  value={newInvoice.date}
                  onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Proveedor</label>
                <input
                  type="text"
                  value={newInvoice.provider}
                  onChange={(e) => setNewInvoice({ ...newInvoice, provider: e.target.value })}
                  placeholder="O2, Endesa, etc."
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Concepto</label>
                <input
                  type="text"
                  value={newInvoice.concept}
                  onChange={(e) => setNewInvoice({ ...newInvoice, concept: e.target.value })}
                  placeholder="Descripción del servicio"
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Base Imponible (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">IVA (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newInvoice.tax}
                    onChange={(e) => setNewInvoice({ ...newInvoice, tax: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={addInvoice} className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
                  Guardar
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
