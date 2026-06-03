import { prisma } from "@/lib/prisma";
import { approveOrder } from "./actions";
import LogoutButton from "@/app/components/LogoutButton";
export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Admin Orders
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          View and approve customer orders and quotations.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl">
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">No orders placed yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl p-6 shadow-sm"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4 mb-4 gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                      Order #{order.id.slice(-6).toUpperCase()}
                    </h2>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      order.status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Placed by <span className="font-semibold text-zinc-700 dark:text-zinc-300">{order.user.name}</span> ({order.user.email}) on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:text-right sm:self-start">
                  <div>
                    <span className="block text-xs text-zinc-400">Total Amount</span>
                    <span className="text-lg font-bold text-emerald-650 dark:text-emerald-400">
                      ₹{Number(order.totalAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {order.status === "PENDING" && (
                    <form
                      action={async () => {
                        "use server";
                        await approveOrder(order.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-150 active:scale-[0.98] shadow-sm hover:shadow cursor-pointer"
                      >
                        Approve Order
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/40">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm"
                  >
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-white">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        SKU: {item.product.sku}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 sm:text-right">
                      <div>
                        <span className="block text-[10px] text-zinc-400 uppercase tracking-wider">Ordered</span>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {Number(item.enteredUnitQuantity)} {item.enteredUnit}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-zinc-400 uppercase tracking-wider">Base Qty</span>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {Number(item.baseQuantity)} {item.product.baseUnit}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-zinc-400 uppercase tracking-wider">Subtotal</span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          ₹{Number(item.subtotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}