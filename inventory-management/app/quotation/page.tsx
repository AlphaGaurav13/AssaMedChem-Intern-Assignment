import { prisma } from "@/lib/prisma";
import { convertToBaseUnit } from "@/lib/conversions";
import { createOrder } from "./actions";
import { isValidUnit } from "@/lib/units";
import QuotationForm from "./QuotationForm";

type Props = {
  searchParams: Promise<{
    productId?: string;
    quantity?: string;
    unit?: string;
  }>;
};

export default async function QuotationPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const products = await prisma.product.findMany();

  let result = null;
  let validationError = "";

  if (
    params.productId &&
    params.quantity &&
    params.unit
  ) {
    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
    });

    if (product) {
      if (!isValidUnit(product.dimension, params.unit)) {
        validationError = `Invalid unit "${params.unit}" for product "${product.name}" (dimension: ${product.dimension}).`;
      } else {
        const enteredQuantity = Number(
          params.quantity
        );

        const baseQuantity = convertToBaseUnit(
          enteredQuantity,
          params.unit
        );

        const totalPrice =
          baseQuantity *
          Number(product.pricePerBaseUnit);

        result = {
          productName: product.name,
          enteredQuantity,
          enteredUnit: params.unit,
          baseQuantity,
          baseUnit: product.baseUnit,
          totalPrice,
        };
      }
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Create Quotation
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Select a product and enter the desired quantity and unit to calculate the price.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <QuotationForm
            products={products.map((p) => ({
              id: p.id,
              name: p.name,
              sku: p.sku,
              dimension: p.dimension,
              baseUnit: p.baseUnit,
            }))}
            initialProductId={params.productId}
            initialQuantity={params.quantity}
            initialUnit={params.unit}
          />
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {validationError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium mb-6">
              ⚠️ {validationError}
            </div>
          )}

          {result ? (
            <div className="bg-white dark:bg-zinc-900 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl p-6 shadow-sm shadow-emerald-500/5">
              <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800/80 pb-4 mb-4">
                <div>
                  <h2 className="font-extrabold text-xl text-zinc-900 dark:text-white">
                    Quotation Result
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Calculated price based on selected unit conversions
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                  Ready to Order
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-zinc-50 dark:border-zinc-800/30 text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium">Product Name</span>
                  <span className="text-zinc-900 dark:text-white font-semibold text-right">{result.productName}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-zinc-50 dark:border-zinc-800/30 text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium">Requested Quantity</span>
                  <span className="text-zinc-900 dark:text-white font-semibold text-right">
                    {result.enteredQuantity} {result.enteredUnit}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-zinc-50 dark:border-zinc-800/30 text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium">Storage Quantity (Base)</span>
                  <span className="text-zinc-900 dark:text-white font-semibold text-right">
                    {result.baseQuantity} {result.baseUnit}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-3 text-base font-bold bg-emerald-50/50 dark:bg-emerald-950/20 px-3 rounded-xl border border-emerald-500/10">
                  <span className="text-emerald-800 dark:text-emerald-300">Total Price</span>
                  <span className="text-emerald-650 dark:text-emerald-400 text-right font-bold">
                    ₹{result.totalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <form action={createOrder}>
                <input type="hidden" name="productId" value={params.productId} />
                <input type="hidden" name="quantity" value={params.quantity} />
                <input type="hidden" name="unit" value={params.unit} />

                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all duration-150 active:scale-[0.98] cursor-pointer"
                >
                  Place Order
                </button>
              </form>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-center bg-zinc-50/50 dark:bg-zinc-900/10">
              <span className="text-4xl mb-3">🧮</span>
              <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">No Calculation Yet</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mt-1">
                Enter quantity and unit values on the left to compute product pricing and place an order.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}