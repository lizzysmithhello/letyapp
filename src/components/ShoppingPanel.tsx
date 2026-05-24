/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, CheckSquare, Square, Plus, Trash2, Lightbulb, MapPin, Search, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { ShoppingItem, StoreRecommendation } from '../types';

interface ShoppingPanelProps {
  shoppingItems: ShoppingItem[];
  storeRecommendations: StoreRecommendation[];
  onToggleItemBought: (id: string) => void;
  onAddItem: (name: string, qty: string, price: number, category: 'comida' | 'hogar') => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, updated: Partial<ShoppingItem>) => void;
  onAddStoreRecommendation: (storeName: string, bestFor: string, avoidFor: string, notes: string) => void;

  // recommended limits for visual alerts
  foodBudgetLimit?: number;
  basicsBudgetLimit?: number;
  isAdmin?: boolean;
}

export default function ShoppingPanel({
  shoppingItems,
  storeRecommendations,
  onToggleItemBought,
  onAddItem,
  onDeleteItem,
  onUpdateItem,
  onAddStoreRecommendation,
  foodBudgetLimit = 6200,
  basicsBudgetLimit = 1200,
  isAdmin = false
}: ShoppingPanelProps) {
  // Add new grocery item state
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'comida' | 'hogar'>('comida');

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState<'comida' | 'hogar'>('comida');

  // Store recommendation form state
  const [storeName, setStoreName] = useState('');
  const [bestFor, setBestFor] = useState('');
  const [avoidFor, setAvoidFor] = useState('');
  const [notes, setNotes] = useState('');
  const [showStoreForm, setShowStoreForm] = useState(false);

  // Filter query
  const [searchQuery, setSearchQuery] = useState('');

  // Súper list handlers
  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const itemPrice = parseFloat(price) || 0;
    onAddItem(name.trim(), qty.trim() || '1 pz', itemPrice, category);
    setName('');
    setQty('');
    setPrice('');
  };

  const handleStartEdit = (item: ShoppingItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditQty(item.qty);
    setEditPrice(item.price.toString());
    setEditCategory(item.category);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    onUpdateItem(id, {
      name: editName.trim(),
      qty: editQty.trim(),
      price: parseFloat(editPrice) || 0,
      category: editCategory
    });
    setEditingId(null);
  };

  const handleAddStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !bestFor.trim()) return;
    onAddStoreRecommendation(
      storeName.trim(),
      bestFor.trim(),
      avoidFor.trim() || 'Ninguno',
      notes.trim() || 'Recomendado por la familia.'
    );
    setStoreName('');
    setBestFor('');
    setAvoidFor('');
    setNotes('');
    setShowStoreForm(false);
  };

  // Divide and calculate lists
  const filteredItems = shoppingItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const comidaItems = filteredItems.filter(item => item.category === 'comida');
  const hogarItems = filteredItems.filter(item => item.category === 'hogar');

  // Financial calculations
  const totalComidaPrice = shoppingItems
    .filter(item => item.category === 'comida')
    .reduce((sum, item) => sum + item.price, 0);

  const totalHogarPrice = shoppingItems
    .filter(item => item.category === 'hogar')
    .reduce((sum, item) => sum + item.price, 0);

  const grandTotalShopping = totalComidaPrice + totalHogarPrice;

  // Checked/bought progress
  const totalItems = shoppingItems.length;
  const boughtItems = shoppingItems.filter(item => item.isBought).length;
  const progressPercent = totalItems > 0 ? Math.round((boughtItems / totalItems) * 100) : 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-fade-in">
      {/* COLUMN 1: SUPER DESPENSA (8 COLS FOR RICH VISUAL SPACE) */}
      <div className="xl:col-span-8 flex flex-col gap-6">
        
        {/* MAIN DESPENSA HEADER & CALCULATOR WIDGET */}
        <div className="bg-white border-2 border-stone-150 rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />
          
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-stone-100 pb-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 font-sans tracking-tight">
                <span className="p-1 px-2.5 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-black shadow-xs">🛒</span>
                Despensa Inteligente del Hogar
              </h2>
              <p className="text-stone-500 text-xs mt-0.5">Controla las compras del PDF alimenticio y consumibles indispensables</p>
            </div>

            {/* Quick search input */}
            <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-xl text-stone-600 w-full sm:w-64 border border-stone-200">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                placeholder="Buscar en despensa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs w-full focus:outline-none placeholder-stone-400 font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs font-bold text-stone-400 hover:text-stone-700">×</button>
              )}
            </div>
          </div>

          {/* Core financial diagnostics: only sums, no limits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-stone-800">
            {/* Food budget diagnostic */}
            <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-2xl">
              <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider block">Suma Alimentos (Comida)</span>
              <span className="text-2xl font-mono font-black text-stone-900 mt-2 block">
                ${totalComidaPrice.toLocaleString('es-MX')} <span className="text-xs font-bold text-stone-500 font-sans">MXN</span>
              </span>
              <p className="text-[10px] text-stone-500 leading-normal mt-1">Suma acumulada de productos alimenticios y lácteos</p>
            </div>

            {/* Basics household diagnostic */}
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
              <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block">Suma Consumibles (Hogar y Limpieza)</span>
              <span className="text-2xl font-mono font-black text-stone-900 mt-2 block">
                ${totalHogarPrice.toLocaleString('es-MX')} <span className="text-xs font-bold text-stone-500 font-sans">MXN</span>
              </span>
              <p className="text-[10px] text-stone-500 leading-normal mt-1">Suma acumulada de artículos de limpieza y aseo</p>
            </div>

            {/* Total global grocery diagnostic */}
            <div className="p-4 bg-emerald-50/40 border border-emerald-150 rounded-2xl">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">Suma Total Despensa Realizada</span>
              <span className="text-2xl font-mono font-black text-emerald-950 mt-2 block">
                ${grandTotalShopping.toLocaleString('es-MX')} <span className="text-xs font-bold text-stone-500 font-sans">MXN</span>
              </span>
              <div className="text-[10px] font-bold text-stone-500 mt-1 font-sans flex justify-between">
                <span>Comprados: {boughtItems} de {totalItems}</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-1 py-0.5 rounded-sm font-mono text-[9px]">{progressPercent}%</span>
              </div>
            </div>
          </div>

          {/* Surtido progress bar */}
          <div className="w-full bg-stone-100 rounded-xl p-2.5 flex items-center gap-3">
            <span className="text-stone-500 text-[10px] font-extrabold uppercase tracking-widest shrink-0">Avance Súper</span>
            <div className="w-full bg-stone-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* INPUT FORM: ADD DIRECT DESPENSA ITEM */}
        {isAdmin ? (
          <div className="bg-white border hover:border-stone-300 p-4 rounded-3xl shadow-xs">
            <form onSubmit={handleAddItemSubmit} className="space-y-3">
              <h3 className="text-xs font-black text-stone-700 uppercase tracking-wider flex items-center gap-1">
                ➕ Añadir Producto a la Despensa
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-12 md:col-span-5">
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase mb-1">Nombre del artículo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Plátano Tabasco, Detergente polvo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs font-semibold border-2 border-stone-150 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="sm:col-span-4 md:col-span-2">
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase mb-1">Cantidad / Unidad</label>
                  <input
                    type="text"
                    placeholder="Ej. 12 kg, 4 botes"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full text-xs font-mono font-bold text-center border-2 border-stone-150 rounded-xl px-2 py-2 bg-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="sm:col-span-4 md:col-span-2">
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase mb-1">Precio Estimado ($)</label>
                  <input
                    type="number"
                    placeholder="Ej. 95"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full text-xs font-mono font-bold text-center border-2 border-stone-150 rounded-xl px-2 py-2 bg-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="sm:col-span-4 md:col-span-2">
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as 'comida' | 'hogar')}
                    className="w-full text-xs font-bold border-2 border-stone-150 rounded-xl px-2 py-2 bg-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="comida">🥗 Comida</option>
                    <option value="hogar">🧼 Hogar</option>
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <button
                    type="submit"
                    className="w-full h-[36px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                    title="Agregar artículo"
                  >
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-stone-50 border border-stone-200/80 p-4 rounded-3xl text-xs font-bold text-stone-600 flex items-center gap-2 select-none shadow-3xs">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>🔒 Modo de Consulta: Solo Ericka edita productos de despensa</span>
          </div>
        )}

        {/* SECTION A: DESPENSA COMIDA 🥗 */}
        <div className="bg-white border-2 border-stone-150 rounded-3xl p-5 sm:p-6 shadow-md flex flex-col">
          <div className="flex justify-between items-center border-b border-sky-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 rounded-lg bg-sky-50 text-sky-700 font-bold block text-sm">🥗</span>
              <div>
                <h3 className="text-base font-bold text-stone-900 tracking-tight">Despensa Comida</h3>
                <p className="text-[10px] text-stone-500 font-medium">Plan integral de 1,800 kcal para 6 personas, según PDF</p>
              </div>
            </div>
            <div className="bg-sky-50 border border-sky-100 px-3 py-1 rounded-xl text-right">
              <span className="text-[10px] font-bold text-sky-600 block uppercase tracking-wider">Subtotal Comida</span>
              <span className="text-sm font-mono font-black text-stone-800">${totalComidaPrice.toLocaleString('es-MX')}</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {comidaItems.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs italic">
                No hay alimentos en esta categoría que coincidan con la búsqueda.
              </div>
            ) : (
              comidaItems.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-2xl p-3 flex flex-wrap sm:flex-nowrap justify-between items-center transition ${
                    item.isBought 
                      ? 'bg-stone-50/50 border-stone-150 text-stone-400' 
                      : 'bg-gradient-to-br from-stone-50/30 to-white border-stone-200/80 hover:border-sky-300 text-stone-850 shadow-xs'
                  }`}
                >
                  {/* Left info */}
                  {editingId === item.id ? (
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2 p-1.5 bg-stone-50 rounded-xl w-full">
                      <input
                        type="text"
                        className="sm:col-span-5 text-xs font-bold border rounded-lg px-2 py-1 bg-white"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Nombre"
                      />
                      <input
                        type="text"
                        className="sm:col-span-3 text-xs font-mono font-bold text-center border rounded-lg px-1 py-1 bg-white"
                        value={editQty}
                        onChange={(e) => setEditQty(e.target.value)}
                        placeholder="Cant."
                      />
                      <input
                        type="number"
                        className="sm:col-span-2 text-xs font-mono font-bold text-center border rounded-lg px-1 py-1 bg-white"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        placeholder="Precio"
                      />
                      <select
                        className="sm:col-span-2 text-xs font-bold border rounded-lg px-1 py-1 bg-white"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as 'comida' | 'hogar')}
                      >
                        <option value="comida">Comida</option>
                        <option value="hogar">Hogar</option>
                      </select>
                    </div>
                  ) : (
                    <div 
                      onClick={() => isAdmin && onToggleItemBought(item.id)}
                      className={`flex items-center gap-3 flex-1 min-w-0 ${isAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}
                    >
                      {item.isBought ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-stone-300 hover:text-sky-600 shrink-0" />
                      )}
                      
                      <div className="truncate">
                        <span className={`text-xs font-extrabold tracking-tight block truncate ${item.isBought ? 'line-through decoration-stone-300' : 'text-stone-800'}`}>
                          {item.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-stone-500 font-medium">
                          <span className="bg-stone-200/60 px-1.5 py-0.5 rounded font-mono font-bold text-stone-600">Cant: {item.qty}</span>
                          <span className="bg-sky-50 text-sky-800 border border-sky-100 px-1.5 py-0.5 rounded font-mono font-extrabold">${item.price} MXN</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Commands */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 ml-auto pl-2 shrink-0">
                      {editingId === item.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                            title="Guardar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-stone-400 hover:bg-stone-100 rounded-lg cursor-pointer"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1 text-stone-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECTION B: DESPENSA HOGAR 🧼 */}
        <div className="bg-white border-2 border-stone-150 rounded-3xl p-5 sm:p-6 shadow-md flex flex-col">
          <div className="flex justify-between items-center border-b border-indigo-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold block text-sm">🧼</span>
              <div>
                <h3 className="text-base font-bold text-stone-900 tracking-tight">Despensa Hogar</h3>
                <p className="text-[10px] text-stone-500 font-medium">Básicos económicos sugeridos (papel, jabón, cloro, aceite, azúcar, etc.)</p>
              </div>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl text-right">
              <span className="text-[10px] font-bold text-indigo-600 block uppercase tracking-wider">Subtotal Hogar</span>
              <span className="text-sm font-mono font-black text-stone-800">${totalHogarPrice.toLocaleString('es-MX')}</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {hogarItems.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs italic">
                No hay consumibles del hogar que coincidan con la búsqueda.
              </div>
            ) : (
              hogarItems.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-2xl p-3 flex flex-wrap sm:flex-nowrap justify-between items-center transition ${
                    item.isBought 
                      ? 'bg-stone-50/50 border-stone-150 text-stone-400' 
                      : 'bg-gradient-to-br from-stone-50/30 to-white border-stone-200/80 hover:border-indigo-300 text-stone-850 shadow-xs'
                  }`}
                >
                  {/* Left info */}
                  {editingId === item.id ? (
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2 p-1.5 bg-stone-50 rounded-xl w-full">
                      <input
                        type="text"
                        className="sm:col-span-5 text-xs font-bold border rounded-lg px-2 py-1 bg-white"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Nombre"
                      />
                      <input
                        type="text"
                        className="sm:col-span-3 text-xs font-mono font-bold text-center border rounded-lg px-1 py-1 bg-white"
                        value={editQty}
                        onChange={(e) => setEditQty(e.target.value)}
                        placeholder="Cant."
                      />
                      <input
                        type="number"
                        className="sm:col-span-2 text-xs font-mono font-bold text-center border rounded-lg px-1 py-1 bg-white"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        placeholder="Precio"
                      />
                      <select
                        className="sm:col-span-2 text-xs font-bold border rounded-lg px-1 py-1 bg-white"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as 'comida' | 'hogar')}
                      >
                        <option value="comida">Comida</option>
                        <option value="hogar">Hogar</option>
                      </select>
                    </div>
                  ) : (
                    <div 
                      onClick={() => isAdmin && onToggleItemBought(item.id)}
                      className={`flex items-center gap-3 flex-1 min-w-0 ${isAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}
                    >
                      {item.isBought ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-stone-300 hover:text-indigo-600 shrink-0" />
                      )}
                      
                      <div className="truncate">
                        <span className={`text-xs font-extrabold tracking-tight block truncate ${item.isBought ? 'line-through decoration-stone-300' : 'text-stone-800'}`}>
                          {item.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-stone-500 font-medium">
                          <span className="bg-stone-200/60 px-1.5 py-0.5 rounded font-mono font-bold text-stone-600">Cant: {item.qty}</span>
                          <span className="bg-indigo-50 text-indigo-800 border border-indigo-100 px-1.5 py-0.5 rounded font-mono font-extrabold">${item.price} MXN</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Commands */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 ml-auto pl-2 shrink-0">
                      {editingId === item.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-stone-400 hover:bg-stone-100 rounded-lg cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1 text-stone-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* COLUMN 2: WISE MOM BUYING STORES AND SEED NOTES (4 COLS) */}
      <div className="xl:col-span-4 flex flex-col gap-6">
        
        {/* COMPARA SUPERMERCADOS */}
        <div className="bg-white border-2 border-stone-150 rounded-3xl p-5 sm:p-6 shadow-md flex flex-col bg-gradient-to-b from-white to-amber-50/10">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 font-sans tracking-tight">
                <span className="p-1 px-2 rounded-xl bg-amber-50 text-amber-700 text-xs">🗺️</span>
                Comparativa de Súpers
              </h2>
              <p className="text-[10px] text-stone-500 mt-0.5 font-medium">Lugares ideales para surtir al mejor precio</p>
            </div>

            {isAdmin ? (
              <button
                onClick={() => setShowStoreForm(!showStoreForm)}
                className="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-amber-100/80 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Nueva Tienda
              </button>
            ) : (
              <span className="text-stone-400 font-bold text-[10px]">🔒 Vista</span>
            )}
          </div>

          {showStoreForm && (
            <form onSubmit={handleAddStoreSubmit} className="mb-4 bg-stone-50 p-4 border border-stone-200 rounded-2xl space-y-3 animate-fade-in">
              <h4 className="text-[11px] font-extrabold text-stone-700 uppercase tracking-widest border-b border-stone-200 pb-1">Sugerencia de Compra</h4>
              
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-0.5">Nombre de Tienda</label>
                  <input
                    type="text"
                    required
                    placeholder="Soriana, Tianguis, etc."
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full text-xs border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-0.5">Mejor para comprar</label>
                  <input
                    type="text"
                    required
                    placeholder="Abarrotes, Limpieza, etc."
                    value={bestFor}
                    onChange={(e) => setBestFor(e.target.value)}
                    className="w-full text-xs border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-0.5">Evitar ahí (Caro)</label>
                  <input
                    type="text"
                    placeholder="Carnes o Verduras"
                    value={avoidFor}
                    onChange={(e) => setAvoidFor(e.target.value)}
                    className="w-full text-xs border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-0.5">Secretos o notas famiares</label>
                  <textarea
                    placeholder="Los miércoles hay frutales..."
                    value={notes}
                    rows={2}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1.5 border-t border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => setShowStoreForm(false)}
                  className="px-2.5 py-1 border border-stone-200 bg-stone-100 text-stone-600 rounded-lg font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
                >
                  Guardar
                </button>
              </div>
            </form>
          )}

          {/* Render stores recommendations */}
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {storeRecommendations.map((store) => (
              <div
                key={store.id}
                className="border border-amber-100 bg-white/70 p-3.5 rounded-2xl flex flex-col hover:bg-orange-50/15 hover:border-amber-200 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2 font-bold text-xs text-stone-800 border-b border-stone-100 pb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{store.storeName}</span>
                </div>
                
                <div className="space-y-1.5 text-[11px] mb-2 leading-tight">
                  <div>
                    <span className="block font-extrabold text-emerald-700 uppercase text-[8px] tracking-wider mb-0.5">🟢 Conviene comprar:</span>
                    <span className="text-stone-700">{store.bestFor}</span>
                  </div>
                  {store.avoidFor && (
                    <div>
                      <span className="block font-extrabold text-red-600 uppercase text-[8px] tracking-wider mb-0.5">🔴 Evitar comprar:</span>
                      <span className="text-stone-700">{store.avoidFor}</span>
                    </div>
                  )}
                </div>

                {store.notes && (
                  <div className="p-2 border border-stone-200/50 bg-stone-50 rounded-lg text-[10px] leading-relaxed italic text-stone-600 border-dashed relative">
                    <strong className="text-stone-700 not-italic font-bold text-[9px] uppercase tracking-wider block mb-0.5">💡 Tip familiar: </strong>
                    {store.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TIPS PRO DIETA PDF */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-indigo-50 border-2 border-indigo-950 shadow-lg rounded-3xl p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-indigo-800 rounded-full opacity-30 pointer-events-none" />
          <div className="absolute -left-6 -top-6 w-16 h-16 bg-pink-800 rounded-full opacity-25 pointer-events-none" />
          
          <h3 className="font-serif font-black text-rose-300 text-sm mb-2 tracking-wide flex items-center gap-1">
            <span>🎯</span> Regla de Oro del PDF
          </h3>
          <p className="text-xs leading-relaxed text-indigo-100/90 font-medium">
            El plan alimenticio del seguro (IMSS 1,800 kcal) está diseñado para nutrir equilibradamente a base de proteínas moderadas y verduras abundantes. 
          </p>
          <ul className="text-[10px] space-y-1.5 mt-3 text-indigo-200 font-medium leading-relaxed border-t border-indigo-800/80 pt-2.5">
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400">✔</span>
              <span>Compra frutas y verduras por temporada quincenalmente.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400">✔</span>
              <span>Usa leche en polvo, que rinde mucho más y ahorra dinero.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-red-400">✘</span>
              <strong className="text-rose-200">No gastar en refrescos, frituras, jugos empacados, o embutidos caros.</strong>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
