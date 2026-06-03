import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.search || "";
  const session = await auth();

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Inventory Dashboard
        </h1>
        {session?.user ? (
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Welcome back, <span className="font-semibold text-emerald-600 dark:text-emerald-400">{session.user.name}</span>! Browse inventory and manage orders.
          </p>
        ) : (
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Please{" "}
            <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
              sign in
            </Link>{" "}
            to place orders and create quotations.
          </p>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form className="flex flex-col sm:flex-row gap-3 max-w-md">
          <input
            name="search"
            placeholder="Search products by name..."
            defaultValue={search}
            className="flex-1 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150 text-sm"
          />

          <button
            className="px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold rounded-xl text-sm transition-all duration-150 active:scale-[0.98] cursor-pointer"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl">
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">No products found matching "{search}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {product.name}
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full border border-zinc-200/30 dark:border-zinc-750">
                    {product.dimension}
                  </span>
                </div>

                <div className="space-y-1.5 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                  <p>
                    <span className="font-semibold text-zinc-500">SKU:</span> {product.sku}
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-500">Available:</span>{" "}
                    <span className="text-zinc-950 dark:text-zinc-100 font-medium">
                      {product.inventoryQuantity.toString()} {product.baseUnit}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-500">Base Price:</span>{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      ₹{product.pricePerBaseUnit.toString()}
                    </span>{" "}
                    per {product.baseUnit}
                  </p>
                </div>
              </div>

              {session?.user && (
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <Link
                    href={`/quotation?productId=${product.id}`}
                    className="w-full inline-flex justify-center items-center py-2 px-4 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold text-sm rounded-xl border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-150 active:scale-[0.98]"
                  >
                    Create Quotation
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}