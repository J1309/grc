import React, { useState, useEffect, useRef } from 'react'
import { X, Check, Upload, Image as ImageIcon, Sparkles, Trash2, ArrowUpRight } from 'lucide-react'
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'Rice',
    categorySlug: 'rice',
    price: 9.99,
    originalPrice: undefined,
    unit: '1 kg',
    image: PRESET_IMAGES[0].url,
    description: '',
    inStock: true,
    rating: 4.8,
    reviewsCount: 18,
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
        unit: initialProduct.unit,
        image: initialProduct.image,
        description: initialProduct.description || '',
        inStock: initialProduct.inStock,
        rating: initialProduct.rating || 4.8,
        reviewsCount: initialProduct.reviewsCount || 12,
        origin: initialProduct.origin || 'Farm Direct',
      })
    } else {
      setFormData({
        name: '',
        category: 'Rice',
        categorySlug: 'rice',
        price: 9.99,
        originalPrice: undefined,
        unit: '1 kg',
        image: PRESET_IMAGES[0].url,
        description: '',
        inStock: true,
        rating: 4.8,
        reviewsCount: 12,
        origin: 'Farm Direct',
      })
    }
    setShowUrlInput(false)
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

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, etc.).')
      return
    }
    const reader = new FileReader()
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string
      if (dataUrl) {
        setFormData((prev) => ({ ...prev, image: dataUrl }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0])
    }
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

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70 shrink-0">
          <div>
            <h3 className="font-extrabold text-base text-stone-900">
              {isEditing ? 'Edit Product' : 'Add New Item'}
            </h3>
            <p className="text-xs text-stone-500">
              {isEditing ? 'Update item details and stock' : 'Add a grocery product to the catalog'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer border border-stone-200/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minimal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* 1. Drag & Drop Image Uploader (Required user feature) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Product Image *
            </label>

            {/* Dropzone Container */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                isDragging
                  ? 'border-forest-700 bg-forest-50/60 scale-[0.99]'
                  : 'border-stone-300 hover:border-forest-700 bg-stone-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {formData.image ? (
                <div className="flex items-center gap-4 w-full">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-stone-200 bg-white shrink-0 shadow-xs">
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-bold text-stone-800 truncate">
                      Image attached successfully
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Drag a new file or click Attach to replace
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      fileInputRef.current?.click()
                    }}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <div className="py-3 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5 text-forest-800" />
                  </div>
                  <p className="text-xs font-bold text-stone-800">
                    Drag and drop product image here
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Supports PNG, JPG, WebP up to 5MB
                  </p>
                </div>
              )}

              {/* Attach File Button */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-forest-900 hover:bg-forest-850 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-harvest-400" />
                  <span>Attach Image</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowUrlInput(!showUrlInput)
                  }}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {showUrlInput ? 'Hide Presets' : 'Or Pick Preset'}
                </button>
              </div>
            </div>

            {/* Optional URL or Preset bar */}
            {showUrlInput && (
              <div className="mt-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Paste direct image URL: https://..."
                  className="w-full h-9 px-3 rounded-lg border border-stone-200 text-xs bg-white text-stone-700 focus:outline-none"
                />
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0">Presets:</span>
                  {PRESET_IMAGES.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: p.url })}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-stone-200 hover:border-forest-700 text-stone-600 shrink-0 cursor-pointer"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Product Name */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Royal Basmati Rice, Pure Ghee"
              className="w-full h-10 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-forest-700 bg-stone-50/50 text-stone-900"
            />
          </div>

          {/* 3. Category & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-forest-700 bg-stone-50/50 text-stone-800 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Unit / Size *
              </label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g. 5 kg, 500 ml, 6 pcs"
                className="w-full h-10 px-3.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-forest-700 bg-stone-50/50 text-stone-800"
              />
            </div>
          </div>

          {/* 4. Price ($) & In Stock Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full h-10 px-3.5 rounded-xl border border-stone-200 text-sm font-bold text-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-700 bg-stone-50/50 tabular-nums font-mono"
              />
            </div>

            <div className="pt-5 sm:pt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none p-2 rounded-xl bg-stone-50 border border-stone-200">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 rounded text-forest-700 focus:ring-forest-600"
                />
                <span className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                  <span className={`w-2 h-2 rounded-full ${formData.inStock ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                  <span>{formData.inStock ? 'In Stock (Available)' : 'Out of Stock'}</span>
                </span>
              </label>
            </div>
          </div>

          {/* 5. Short Description (Optional) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Short Description <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Fresh harvested staple sourced directly from certified farms"
              className="w-full h-10 px-3.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-forest-700 bg-stone-50/50 text-stone-700"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-850 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-harvest-400" />
              <span>{isEditing ? 'Save Changes' : 'Add Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ProductModal
