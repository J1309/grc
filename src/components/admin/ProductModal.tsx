import React, { useState, useEffect } from 'react'
import { X, Check, Upload, Sparkles, Image as ImageIcon } from 'lucide-react'
import { Product } from '../../types'
import { CATEGORIES } from '../../data/products'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: Omit<Product, 'id'> | Product) => void
  initialProduct?: Product | null
}

const PRESET_IMAGES = [
  { name: 'Basmati Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
  { name: 'Whole Wheat Atta', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
  { name: 'Pure Cow Ghee', url: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=600&q=80' },
  { name: 'Garam Masala', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Crispy Samosas', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
  { name: 'Red Chilli Powder', url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80' },
  { name: 'Yellow Moong Dal', url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80' },
  { name: 'Mustard Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' },
]

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  const isEditing = Boolean(initialProduct)

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'Rice',
    categorySlug: 'rice',
    price: 9.99,
    originalPrice: 12.99,
    discount: '20% OFF',
    rating: 4.8,
    reviewsCount: 24,
    unit: '1 kg',
    image: PRESET_IMAGES[0].url,
    description: '',
    inStock: true,
    isLatest: true,
    isBestSeller: false,
    isSpecialOffer: false,
    origin: 'Farm Direct',
  })

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name,
        category: initialProduct.category,
        categorySlug: initialProduct.categorySlug,
        price: initialProduct.price,
        originalPrice: initialProduct.originalPrice,
        discount: initialProduct.discount || '',
        rating: initialProduct.rating,
        reviewsCount: initialProduct.reviewsCount,
        unit: initialProduct.unit,
        image: initialProduct.image,
        description: initialProduct.description,
        inStock: initialProduct.inStock,
        isLatest: initialProduct.isLatest || false,
        isBestSeller: initialProduct.isBestSeller || false,
        isSpecialOffer: initialProduct.isSpecialOffer || false,
        origin: initialProduct.origin || '',
      })
    } else {
      setFormData({
        name: '',
        category: 'Rice',
        categorySlug: 'rice',
        price: 9.99,
        originalPrice: 12.99,
        discount: '20% OFF',
        rating: 4.8,
        reviewsCount: 18,
        unit: '1 kg',
        image: PRESET_IMAGES[0].url,
        description: 'Fresh and premium quality grocery staple sourced directly from certified organic farms.',
        inStock: true,
        isLatest: true,
        isBestSeller: false,
        isSpecialOffer: false,
        origin: 'Direct from Farm',
      })
    }
  }, [initialProduct, isOpen])

  if (!isOpen) return null

  const handleCategoryChange = (catName: string) => {
    const matched = CATEGORIES.find((c) => c.name === catName)
    setFormData((prev) => ({
      ...prev,
      category: catName,
      categorySlug: matched ? matched.slug : catName.toLowerCase().replace(/\s+/g, '-'),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    if (isEditing && initialProduct) {
      onSave({
        ...initialProduct,
        ...formData,
      })
    } else {
      onSave(formData)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 my-auto">
        {/* Header */}
        <div className="bg-forest-900 text-white px-6 py-4.5 flex items-center justify-between border-b border-forest-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center text-harvest-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                {isEditing ? 'Edit Grocery Item' : 'Add New Grocery Item'}
              </h3>
              <p className="text-xs text-emerald-200">
                {isEditing ? 'Update item details, price & stock status' : 'Publish new item to live storefront'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-forest-800 text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Item Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Royal Basmati Rice"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Category Aisle *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 bg-stone-50/50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Price, Original Price, Unit, Discount */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm font-semibold text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Old Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    originalPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="Optional"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm text-stone-500 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Unit / Size *
              </label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g. 5 kg, 500 ml"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Discount Tag
              </label>
              <input
                type="text"
                value={formData.discount || ''}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                placeholder="e.g. 15% OFF"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 bg-stone-50/50 text-harvest-600 font-bold"
              />
            </div>
          </div>

          {/* Row 3: Image URL & Quick Preset Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Product Image URL *
              </label>
              <span className="text-[11px] text-stone-400">Select preset or paste custom URL</span>
            </div>

            <div className="flex gap-3 items-center">
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="flex-1 h-11 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 bg-stone-50/50"
              />
              <div className="w-11 h-11 rounded-xl border border-stone-200 overflow-hidden shrink-0 bg-stone-100 flex items-center justify-center">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-stone-400" />
                )}
              </div>
            </div>

            {/* Quick preset thumbnail pills */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0">Presets:</span>
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, image: preset.url })}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border shrink-0 transition-colors cursor-pointer ${
                    formData.image === preset.url
                      ? 'bg-forest-900 text-white border-forest-900 font-bold'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-forest-700'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Origin & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Origin / Tagline
              </label>
              <input
                type="text"
                value={formData.origin || ''}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="e.g. Himalayan Valleys / Farm Direct"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description of the item"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 bg-stone-50/50"
              />
            </div>
          </div>

          {/* Row 5: Flags & Stock Switcher */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
            {/* In Stock toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4 rounded text-forest-700 focus:ring-forest-600"
              />
              <span className="text-xs font-bold text-stone-800">
                {formData.inStock ? '🟢 In Stock (Available)' : '🔴 Out of Stock'}
              </span>
            </label>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isLatest}
                  onChange={(e) => setFormData({ ...formData, isLatest: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-forest-700"
                />
                <span className="text-xs text-stone-600 font-medium">New Arrival</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-harvest-500"
                />
                <span className="text-xs text-stone-600 font-medium">Best Seller</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isSpecialOffer}
                  onChange={(e) => setFormData({ ...formData, isSpecialOffer: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-rose-500"
                />
                <span className="text-xs text-stone-600 font-medium">Special Offer</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-850 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-harvest-400" />
              <span>{isEditing ? 'Save Changes' : 'Publish Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ProductModal

