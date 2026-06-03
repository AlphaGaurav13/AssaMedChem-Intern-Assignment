"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UNIT_OPTIONS } from "@/lib/units";

type Product = {
  id: string;
  name: string;
  sku: string;
  dimension: string;
  baseUnit: string;
};

type Props = {
  products: Product[];
  initialProductId?: string;
  initialQuantity?: string;
  initialUnit?: string;
};

export default function QuotationForm({
  products,
  initialProductId,
  initialQuantity,
  initialUnit,
}: Props) {
  const router = useRouter();

  // Find initial product or fallback to first
  const defaultProduct = products.find((p) => p.id === initialProductId) || products[0];
  const [selectedProductId, setSelectedProductId] = useState(defaultProduct?.id || "");
  const [quantity, setQuantity] = useState(initialQuantity || "");
  const [unit, setUnit] = useState(initialUnit || "");

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const dimension = selectedProduct?.dimension as keyof typeof UNIT_OPTIONS;
  const allowedUnits = selectedProduct ? UNIT_OPTIONS[dimension] || [] : [];

  // When selected product changes, reset unit if it's not valid for the new product
  useEffect(() => {
    if (selectedProduct) {
      const validUnits = UNIT_OPTIONS[selectedProduct.dimension as keyof typeof UNIT_OPTIONS] || [];
      if (!validUnits.includes(unit)) {
        setUnit(validUnits[0] || "");
      }
    }
  }, [selectedProductId, selectedProduct, unit]);

  // Sync state if initial props change (e.g. navigation)
  useEffect(() => {
    if (initialProductId) setSelectedProductId(initialProductId);
    if (initialQuantity) setQuantity(initialQuantity);
    if (initialUnit) setUnit(initialUnit);
  }, [initialProductId, initialQuantity, initialUnit]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProductId || !quantity || !unit) return;

    // Navigate to calculate page via query parameters
    router.push(`/quotation?productId=${selectedProductId}&quantity=${quantity}&unit=${unit}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Select Product
        </label>
        <select
          name="productId"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="block w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150 text-sm"
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (SKU: {product.sku})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Quantity
        </label>
        <input
          type="number"
          name="quantity"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="block w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Unit
        </label>
        <select
          name="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="block w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150 text-sm"
        >
          {allowedUnits.map((u) => (
            <option key={u} value={u}>
              {u === "g" && "grams (g)"}
              {u === "kg" && "kilograms (kg)"}
              {u === "mL" && "milliliters (mL)"}
              {u === "L" && "liters (L)"}
              {u === "item" && "items (unit/count)"}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 transition-all duration-150 active:scale-[0.98] cursor-pointer"
      >
        Calculate Quotation
      </button>
    </form>
  );
}
