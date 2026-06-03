import { prisma } from "@/lib/prisma";
import { createProduct, deleteProduct } from "./actions";
export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Manage Products
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Create new products, configure dimensions, base units, and delete products.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Add Product Form */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-xl text-zinc-900 dark:text-white mb-5">
            Add New Product
          </h2>

          <form action={createProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Product Name
              </label>
              <input
                name="name"
                placeholder="e.g. Sugar, Mustard Oil"
                className="block w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                SKU
              </label>
              <input
                name="sku"
                placeholder="e.g. SUG001, OIL001"
                className="block w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Dimension
                </label>
                <select
                  name="dimension"
                  className="block w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150 text-sm"
                  required
                >
                  <option value="weight">Weight</option>
                  <option value="volume">Volume</option>
                  <option value="count">Count</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Base Unit
                </label>
                <select
                  name="baseUnit"
                  className="block w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150 text-sm"
                  required
                >
                  <option value="g">grams (g)</option>
                  <option value="mL">milliliters (mL)</option>
                  <option value="item">items (item)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Initial Inventory Quantity
              </label>
              <input
                name="inventoryQuantity"
                type="number"
                placeholder="e.g. 50000"
                className="block w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Price per Base Unit (INR)
              </label>
              <input
                name="pricePerBaseUnit"
                type="number"
                step="0.000001"
                placeholder="e.g. 0.06"
                className="block w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              Create Product
            </button>
          </form>
        </div>

        {/* Products List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-bold text-xl text-zinc-900 dark:text-white mb-5 sm:pl-2">
            Active Products ({products.length})
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl">
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">No products registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-zinc-900 dark:text-white">
                        {product.name}
                      </h3>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full border border-zinc-200/40">
                        {product.dimension}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400 mb-4">
                      <p>
                        <span className="font-semibold text-zinc-400">SKU:</span> {product.sku}
                      </p>
                      <p>
                        <span className="font-semibold text-zinc-400">Inventory:</span>{" "}
                        <span className="text-zinc-900 dark:text-zinc-200 font-medium">
                          {product.inventoryQuantity.toString()} {product.baseUnit}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-zinc-400">Price:</span>{" "}
                        <span className="text-emerald-600 dark:text-emerald-455 font-semibold">
                          ₹{product.pricePerBaseUnit.toString()}
                        </span>{" "}
                        per {product.baseUnit}
                      </p>
                    </div>
                  </div>

                  <form
                    action={async () => {
                      "use server";
                      await deleteProduct(product.id);
                    }}
                    className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80"
                  >
                    <button
                      type="submit"
                      className="w-full text-center py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold text-xs rounded-xl border border-red-500/10 hover:border-red-500/25 transition-all duration-150 active:scale-[0.98] cursor-pointer"
                    >
                      Delete Product
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}