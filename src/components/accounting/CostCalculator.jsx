import React, { useState, useEffect } from 'react';
import {
  MATERIAL_CATEGORIES,
  ALL_MATERIAL_NAMES,
  INITIAL_HPP_TEMPLATES,
} from '../../data/materialsCatalog';
import { geminiService } from '../../services/geminiService';
import {
  Calculator,
  Plus,
  Trash2,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Package,
  Layers,
  ArrowRight,
  HelpCircle,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  Lightbulb,
  ThumbsUp,
  Share2
} from 'lucide-react';

const STORAGE_KEY_TEMPLATES = 'sensoria_hpp_templates';

const CostCalculator = ({ initialCourseId = null }) => {
  // 1. Template Management State
  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEMPLATES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_HPP_TEMPLATES;
  });

  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator' | 'sales_coach'
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || 'custom');

  // 2. Product & Cost Form State
  const [productName, setProductName] = useState(templates[0]?.name || 'Produk Vokasi Mandiri');
  const [batchUnits, setBatchUnits] = useState(templates[0]?.batchUnits || 5);
  const [unitName, setUnitName] = useState(templates[0]?.unitName || 'pcs');
  const [marginPercent, setMarginPercent] = useState(templates[0]?.defaultMarginPercent || 40);
  const [items, setItems] = useState(templates[0]?.items || []);

  // Notification state
  const [savedNotification, setSavedNotification] = useState('');

  // 3. AI Pricing Recommendation State
  const [aiPricingLoading, setAiPricingLoading] = useState(false);
  const [aiPricingResult, setAiPricingResult] = useState(null);

  // 4. AI Sales Evaluation State
  const [salesProductName, setSalesProductName] = useState(productName);
  const [salesProduced, setSalesProduced] = useState(batchUnits);
  const [salesSold, setSalesSold] = useState(Math.floor(batchUnits * 0.6) || 3);
  const [salesSellingPrice, setSalesSellingPrice] = useState(25000);
  const [salesModal, setSalesModal] = useState(50000);
  const [salesDuration, setSalesDuration] = useState('3 Hari');
  const [salesChallenges, setSalesChallenges] = useState([]);
  const [salesNotes, setSalesNotes] = useState('');
  const [salesAiLoading, setSalesAiLoading] = useState(false);
  const [salesAiResult, setSalesAiResult] = useState(null);

  // List opsi kendala jualan (ramah tunawicara dengan tombol chip bergambar)
  const CHALLENGE_OPTIONS = [
    { id: 'mahal', label: '🏷️ Pembeli bilang harga kemahalan' },
    { id: 'promosi', label: '📢 Pembeli belum banyak yang tahu' },
    { id: 'kemasan', label: '📦 Kemasan kurang estetik / rusak' },
    { id: 'sepi', label: '📍 Lokasi jualan sepi orang lewat' },
    { id: 'malu', label: '👥 Bingung cara menawarkan produk' },
    { id: 'basi', label: '⏰ Produk mudah basi / tidak tahan lama' },
    { id: 'saingan', label: '⚔️ Banyak yang jual barang serupa' },
  ];

  // Save templates to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(templates));
    } catch (e) {
      console.error(e);
    }
  }, [templates]);

  // Load template when dropdown changes
  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    setAiPricingResult(null);

    if (templateId === 'new_custom') {
      // Buat produk baru dari nol
      setProductName('Produk Vokasi Baru');
      setBatchUnits(1);
      setUnitName('pcs');
      setMarginPercent(35);
      setItems([
        { id: Date.now().toString(), name: 'Tepung Terigu Protein Rendah', quantity: '1 kg', cost: 14000 },
      ]);
      return;
    }

    const tpl = templates.find((t) => t.id === templateId);
    if (tpl) {
      setProductName(tpl.name);
      setBatchUnits(tpl.batchUnits || 1);
      setUnitName(tpl.unitName || 'pcs');
      setMarginPercent(tpl.defaultMarginPercent || 40);
      setItems(tpl.items || []);
    }
  };

  // Add new ingredient/cost row
  const handleAddItem = () => {
    const defaultItem = ALL_MATERIAL_NAMES[0];
    const newItem = {
      id: Date.now().toString(),
      name: defaultItem.name,
      quantity: defaultItem.defaultUnit || '1 unit',
      cost: defaultItem.estimatedCost || 5000,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Update item field
  const handleUpdateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (field === 'name') {
            // Jika memilih dari catalog, isi default cost & unit otomatis
            const found = ALL_MATERIAL_NAMES.find((m) => m.name === value);
            return {
              ...item,
              name: value,
              quantity: found ? found.defaultUnit : item.quantity,
              cost: found ? found.estimatedCost : item.cost,
            };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Remove row
  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Save changes to current template
  const handleSaveCurrentTemplate = () => {
    if (selectedTemplateId === 'new_custom') {
      handleSaveAsNewTemplate();
      return;
    }

    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedTemplateId
          ? {
              ...t,
              name: productName,
              batchUnits: Number(batchUnits) || 1,
              unitName,
              defaultMarginPercent: Number(marginPercent) || 40,
              items,
            }
          : t
      )
    );

    setSavedNotification('Perubahan pada template berhasil disimpan!');
    setTimeout(() => setSavedNotification(''), 3000);
  };

  // Save as brand new template
  const handleSaveAsNewTemplate = () => {
    const newId = `tpl-custom-${Date.now()}`;
    const newTemplate = {
      id: newId,
      name: productName,
      batchUnits: Number(batchUnits) || 1,
      unitName,
      defaultMarginPercent: Number(marginPercent) || 40,
      items,
    };

    setTemplates((prev) => [...prev, newTemplate]);
    setSelectedTemplateId(newId);
    setSavedNotification('Template baru berhasil ditambahkan ke daftar!');
    setTimeout(() => setSavedNotification(''), 3000);
  };

  // 5. Calculations
  const totalCost = items.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
  const unitsCount = Math.max(1, Number(batchUnits) || 1);
  const hppPerUnit = Math.round(totalCost / unitsCount);

  // Selling price formula based on margin
  const marginFrac = (Number(marginPercent) || 0) / 100;
  const profitPerUnit = Math.round(hppPerUnit * marginFrac);
  const suggestedSellingPrice = hppPerUnit + profitPerUnit;

  const totalRevenue = suggestedSellingPrice * unitsCount;
  const totalNetProfit = totalRevenue - totalCost;

  // Sync to sales coach form automatically
  useEffect(() => {
    setSalesProductName(productName);
    setSalesProduced(unitsCount);
    setSalesModal(totalCost);
    setSalesSellingPrice(suggestedSellingPrice);
  }, [productName, unitsCount, totalCost, suggestedSellingPrice]);

  // Request AI Pricing Recommendation
  const handleRequestAiPricing = async () => {
    setAiPricingLoading(true);
    setAiPricingResult(null);

    const advice = await geminiService.getPricingRecommendation({
      productName,
      hppPerUnit,
      totalCost,
      batchUnits: unitsCount,
      materials: items,
    });

    setAiPricingResult(advice);
    setAiPricingLoading(false);
  };

  // Apply chosen tier to active calculator
  const applyPriceTier = (price) => {
    if (hppPerUnit > 0) {
      const newMargin = Math.round(((price - hppPerUnit) / hppPerUnit) * 100);
      setMarginPercent(Math.max(0, newMargin));
    }
  };

  // Toggle challenge chip
  const toggleChallenge = (label) => {
    setSalesChallenges((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  // Request Sales Analysis AI
  const handleRequestSalesAnalysis = async () => {
    setSalesAiLoading(true);
    setSalesAiResult(null);

    const result = await geminiService.analyzeSalesResults({
      productName: salesProductName,
      totalProduced: Number(salesProduced) || 0,
      totalSold: Number(salesSold) || 0,
      sellingPrice: Number(salesSellingPrice) || 0,
      totalModal: Number(salesModal) || 0,
      salesDuration,
      challenges: salesChallenges,
      notes: salesNotes,
    });

    setSalesAiResult(result);
    setSalesAiLoading(false);
  };

  return (
    <div className="w-full">
      {/* Top Banner Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-100 text-blue-900 inline-block mb-1.5 sm:mb-2">
            Kewirausahaan Mandiri Vokasi
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
            {activeTab === 'calculator'
              ? 'Kalkulator Harga Jual & HPP'
              : 'Asisten Analisis Penjualan AI'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            {activeTab === 'calculator'
              ? 'Hitung modal bahan, tentukan HPP, dan dapatkan 3 rekomendasi harga jual cerdas dari AI Gemini.'
              : 'Masukkan hasil jualan karyamu, dan biarkan AI menganalisis serta memberi saran praktis agar makin laris.'}
          </p>
        </div>

        {/* Tab Switcher - Responsive Grid on Mobile */}
        <div className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex p-1 rounded-xl sm:rounded-2xl bg-slate-200/80 border border-slate-300 text-xs font-bold gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`px-2.5 sm:px-4 py-2 rounded-lg sm:rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="sm:hidden">1. Hitung HPP</span>
            <span className="hidden sm:inline">1. Hitung Harga Jual</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sales_coach')}
            className={`px-2.5 sm:px-4 py-2 rounded-lg sm:rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'sales_coach'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
            <span className="sm:hidden">2. Evaluasi AI</span>
            <span className="hidden sm:inline">2. Evaluasi Hasil Jualan</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {savedNotification && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: KALKULATOR HARGA JUAL & HPP */}
      {/* ========================================================================= */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          {/* Template Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Pilih Template Produk:
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleSelectTemplate(e.target.value)}
                  className="w-full sm:w-auto sm:min-w-[240px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <optgroup label="Template Vokasi Siap Pakai">
                    {templates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name} ({tpl.batchUnits || 1} {tpl.unitName || 'pcs'})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Buat Produk Lain">
                    <option value="new_custom">✨ + Buat Produk Baru dari Nol</option>
                  </optgroup>
                </select>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveCurrentTemplate}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition active:scale-95"
                    title="Simpan perubahan takaran atau harga pada template ini"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Template</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAsNewTemplate}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1.5 transition active:scale-95"
                    title="Simpan sebagai template produk baru"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Simpan Template Baru</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 max-w-xs leading-relaxed hidden lg:block">
              💡 <em>Tips:</em> Simpan resep bahanmu agar saat produksi ulang tidak perlu mengetik dari awal!
            </div>
          </div>

          {/* Main Grid: Form Input (Left) & Calculation Output + AI (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Input Data Produk & Rincian Bahan (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Product Header Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-7">
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      Nama Produk / Karya Vokasi
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Contoh: Lilin Aromaterapi Lavender 150ml"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      Hasil Produksi
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={batchUnits}
                        onChange={(e) => setBatchUnits(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      Satuan
                    </label>
                    <input
                      type="text"
                      value={unitName}
                      onChange={(e) => setUnitName(e.target.value)}
                      placeholder="pcs/toples"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Ingredients & Cost Rows */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Rincian Biaya Modal Bahan Baku & Kemasan
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pilih bahan dari daftar dropdown atau ketik biaya yang kamu keluarkan.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {items.length} Komponen
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-3 mt-4">
                  {items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                    >
                      {/* Dropdown / Item Name (6 cols) */}
                      <div className="sm:col-span-6">
                        <select
                          value={item.name}
                          onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
                        >
                          {MATERIAL_CATEGORIES.map((cat) => (
                            <optgroup key={cat.category} label={cat.category}>
                              {cat.items.map((opt) => (
                                <option key={opt.name} value={opt.name}>
                                  {opt.name}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>

                      {/* Quantity / Unit (3 cols) */}
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={item.quantity || ''}
                          onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                          placeholder="Takaran/Unit"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Cost (Rp) & Delete (3 cols) */}
                      <div className="sm:col-span-3 flex items-center gap-1.5">
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                            Rp
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="500"
                            value={item.cost || 0}
                            onChange={(e) =>
                              handleUpdateItem(item.id, 'cost', parseInt(e.target.value) || 0)
                            }
                            className="w-full pl-7 pr-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 text-right"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus bahan ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Item Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition active:scale-95 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Bahan / Biaya Lain</span>
                  </button>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-medium block">Total Modal Batch:</span>
                    <span className="text-sm font-black text-slate-800">
                      Rp {totalCost.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: HPP Result, Margin, & AI Price Recommendation (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Summary Card HPP & Harga Jual */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-300">
                    Kalkulasi HPP & Laba
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                    {unitsCount} {unitName}
                  </span>
                </div>

                {/* Key Numbers */}
                <div className="grid grid-cols-2 gap-4 my-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-slate-300 font-medium block">
                      HPP Modal / Unit:
                    </span>
                    <span className="text-lg sm:text-xl font-black text-amber-300">
                      Rp {hppPerUnit.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-slate-300 font-medium block">
                      Untung / Unit:
                    </span>
                    <span className="text-lg sm:text-xl font-black text-emerald-300">
                      +Rp {profitPerUnit.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Target Margin Slider & Stepper */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold">Target Margin Keuntungan:</span>
                    <span className="text-sm font-black text-blue-300">{marginPercent}%</span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={marginPercent}
                    onChange={(e) => setMarginPercent(parseInt(e.target.value) || 0)}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />

                  {/* Preset Margin Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[20, 35, 50, 70].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setMarginPercent(pct)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                          marginPercent === pct
                            ? 'bg-blue-600 text-white border-blue-400'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        +{pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Suggested Selling Price */}
                <div className="p-4 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-center">
                  <span className="text-xs text-blue-200 font-medium block mb-0.5">
                    Rekomendasi Harga Jual Standar:
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    Rp {suggestedSellingPrice.toLocaleString('id-ID')}
                    <span className="text-xs font-normal text-blue-200 ml-1.5">/ {unitName}</span>
                  </div>

                  <div className="mt-2 text-[11px] text-blue-100/80 pt-2 border-t border-blue-400/20">
                    Jika {unitsCount} {unitName} habis terjual: <strong>Omset Rp {totalRevenue.toLocaleString('id-ID')}</strong> (Untung Bersih: Rp {totalNetProfit.toLocaleString('id-ID')})
                  </div>
                </div>

                {/* AI Price Button */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleRequestAiPricing}
                    disabled={aiPricingLoading}
                    className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 hover:brightness-105 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>
                      {aiPricingLoading
                        ? 'AI Gemini Sedang Menganalisis Harga...'
                        : 'Minta Rekomendasi 3 Kategori Harga AI'}
                    </span>
                  </button>
                </div>
              </div>

              {/* AI Pricing Results (3 Cards: Murah, Standar, Premium) */}
              {aiPricingResult && (
                <div className="p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-md space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        Saran Kategori Harga Jual AI Gemini
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Pilih tier harga yang cocok untuk strategimu:
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* 1. TIER MURAH */}
                    <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:border-emerald-400 transition flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white">
                            {aiPricingResult.cheap.tierName}
                          </span>
                          <div className="text-lg font-black text-emerald-900 mt-1">
                            Rp {aiPricingResult.cheap.price.toLocaleString('id-ID')}
                            <span className="text-xs font-normal text-emerald-700 ml-1">
                              (+{aiPricingResult.cheap.marginPercent}%)
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => applyPriceTier(aiPricingResult.cheap.price)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition"
                        >
                          Terapkan
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {aiPricingResult.cheap.strategy}
                      </p>
                      <span className="text-[11px] text-slate-500 mt-1">
                        🎯 Target: {aiPricingResult.cheap.targetAudience}
                      </span>
                    </div>

                    {/* 2. TIER STANDAR */}
                    <div className="p-3.5 rounded-xl border-2 border-blue-300 bg-blue-50/50 hover:border-blue-500 transition flex flex-col justify-between shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white">
                            {aiPricingResult.standard.tierName} (Paling Disarankan)
                          </span>
                          <div className="text-lg font-black text-blue-900 mt-1">
                            Rp {aiPricingResult.standard.price.toLocaleString('id-ID')}
                            <span className="text-xs font-normal text-blue-700 ml-1">
                              (+{aiPricingResult.standard.marginPercent}%)
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => applyPriceTier(aiPricingResult.standard.price)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-sm transition"
                        >
                          Terapkan
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {aiPricingResult.standard.strategy}
                      </p>
                      <span className="text-[11px] text-slate-500 mt-1">
                        🎯 Target: {aiPricingResult.standard.targetAudience}
                      </span>
                    </div>

                    {/* 3. TIER PREMIUM */}
                    <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:border-purple-400 transition flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-600 text-white">
                            {aiPricingResult.premium.tierName}
                          </span>
                          <div className="text-lg font-black text-purple-900 mt-1">
                            Rp {aiPricingResult.premium.price.toLocaleString('id-ID')}
                            <span className="text-xs font-normal text-purple-700 ml-1">
                              (+{aiPricingResult.premium.marginPercent}%)
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => applyPriceTier(aiPricingResult.premium.price)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 shadow-sm transition"
                        >
                          Terapkan
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {aiPricingResult.premium.strategy}
                      </p>
                      <span className="text-[11px] text-slate-500 mt-1">
                        🎯 Target: {aiPricingResult.premium.targetAudience}
                      </span>
                    </div>
                  </div>

                  {aiPricingResult.aiNote && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                      💡 <em>Pesan AI:</em> {aiPricingResult.aiNote}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ANALISIS & EVALUASI HASIL PENJUALAN AI ("Sensoria Sales Coach") */}
      {/* ========================================================================= */}
      {activeTab === 'sales_coach' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Input Form Hasil Penjualan (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Formulir Hasil Penjualan Siswa
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Isi data jualanmu di bawah ini. Tidak perlu banyak mengetik, cukup isi angka dan pilih tombol kendala yang sesuai.
                </p>
              </div>

              {/* Product & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Nama Produk yang Dijual
                  </label>
                  <input
                    type="text"
                    value={salesProductName}
                    onChange={(e) => setSalesProductName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Berapa Lama Waktu Jualan?
                  </label>
                  <input
                    type="text"
                    value={salesDuration}
                    onChange={(e) => setSalesDuration(e.target.value)}
                    placeholder="Contoh: 3 hari, 1 minggu"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Production and Sales Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Modal Total (Rp)
                  </label>
                  <input
                    type="number"
                    value={salesModal}
                    onChange={(e) => setSalesModal(parseInt(e.target.value) || 0)}
                    className="w-full text-xs sm:text-sm font-black text-slate-800 bg-transparent focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Jumlah Dibuat
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={salesProduced}
                    onChange={(e) => setSalesProduced(parseInt(e.target.value) || 1)}
                    className="w-full text-xs sm:text-sm font-black text-slate-800 bg-transparent focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <label className="text-[11px] font-bold text-blue-700 block mb-1">
                    Jumlah Terjual
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={salesSold}
                    onChange={(e) => setSalesSold(parseInt(e.target.value) || 0)}
                    className="w-full text-xs sm:text-sm font-black text-blue-900 bg-transparent focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Harga Jual / Pcs
                  </label>
                  <input
                    type="number"
                    value={salesSellingPrice}
                    onChange={(e) => setSalesSellingPrice(parseInt(e.target.value) || 0)}
                    className="w-full text-xs sm:text-sm font-black text-slate-800 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Sisa Barang Alert */}
              <div className="p-3 rounded-xl bg-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Sisa Produk Belum Terjual:</span>
                <span className="font-black text-slate-900 text-sm">
                  {Math.max(0, salesProduced - salesSold)} pcs
                </span>
              </div>

              {/* Challenges Multi-Select Chips (Very Touch/Wicara-Friendly!) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Apa Kendala yang Kamu Alami Saat Jualan? (Pilih yang sesuai):
                </label>
                <div className="flex flex-wrap gap-2">
                  {CHALLENGE_OPTIONS.map((opt) => {
                    const isSelected = salesChallenges.includes(opt.label);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleChallenge(opt.label)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Catatan Tambahan (Boleh Dikosongkan)
                </label>
                <textarea
                  rows="2"
                  value={salesNotes}
                  onChange={(e) => setSalesNotes(e.target.value)}
                  placeholder="Contoh: Pembeli minta diskon, atau wadah lilin agak panas saat dipegang."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Submit to AI */}
              <button
                type="button"
                onClick={handleRequestSalesAnalysis}
                disabled={salesAiLoading}
                className="w-full py-3.5 rounded-xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:brightness-105 transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {salesAiLoading
                    ? 'AI Gemini Sedang Menganalisis & Menyiapkan Solusi...'
                    : 'Analisis Hasil Jualan & Dapatkan Solusi AI'}
                </span>
              </button>
            </div>

            {/* AI Sales Coach Output (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {!salesAiResult && !salesAiLoading && (
                <div className="p-8 rounded-2xl bg-white border-2 border-dashed border-slate-200 text-center text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40 text-purple-500" />
                  <h4 className="font-bold text-slate-700 text-sm mb-1">
                    Menunggu Data Penjualan
                  </h4>
                  <p className="text-xs leading-relaxed max-w-xs mx-auto">
                    Isi data jualanmu di sebelah kiri lalu klik tombol analisis untuk mendapatkan evaluasi cerdas dari AI Gemini.
                  </p>
                </div>
              )}

              {salesAiLoading && (
                <div className="p-8 rounded-2xl bg-white border border-purple-200 shadow-sm text-center">
                  <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 text-sm">
                    Sensoria Coach sedang menganalisis...
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Menghitung margin dan menyiapkan trik wirausaha ramah disabilitas.
                  </p>
                </div>
              )}

              {salesAiResult && (
                <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-purple-300 shadow-xl space-y-4 animate-fade-in">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Evaluasi Sensoria Coach
                    </span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        salesAiResult.isBreakEven
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {salesAiResult.isBreakEven ? '✓ Sudah Balik Modal' : '⏳ Belum Balik Modal'}
                    </span>
                  </div>

                  {/* Financial Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">
                        Total Pemasukan:
                      </span>
                      <span className="text-base font-black text-slate-900">
                        Rp {salesAiResult.revenue.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-xl border ${
                        salesAiResult.netProfit >= 0
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <span className="text-[10px] font-bold block">
                        {salesAiResult.netProfit >= 0 ? 'Keuntungan Bersih:' : 'Sisa Modal Belum Kembali:'}
                      </span>
                      <span className="text-base font-black">
                        Rp {Math.abs(salesAiResult.netProfit).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
                      Diagnosis Penjualan
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed p-3 rounded-xl bg-purple-50/60 border border-purple-100 font-medium">
                      {salesAiResult.diagnosis}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      Langkah Solusi Praktis
                    </h5>
                    <ul className="space-y-2">
                      {salesAiResult.recommendations.map((rec, i) => (
                        <li
                          key={i}
                          className="text-xs text-slate-700 flex items-start gap-2 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50"
                        >
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Motivation */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-start gap-2.5">
                    <ThumbsUp className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900 font-bold leading-relaxed">
                      "{salesAiResult.motivation}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostCalculator;
