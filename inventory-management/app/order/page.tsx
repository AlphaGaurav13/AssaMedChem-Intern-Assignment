import { prisma } from "@/lib/prisma";
import { convertToBaseUnit } from "@/lib/conversions";

export default async function OrderPage() {
  const product = await prisma.product.findFirst();

  if (!product) {
    return <div>Product not found</div>;
  }

  const enteredQuantity = 2;
  const enteredUnit = "kg";

  const baseQuantity = convertToBaseUnit(
    enteredQuantity,
    enteredUnit
  );

  const totalPrice =
    baseQuantity *
    Number(product.pricePerBaseUnit);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Order Calculation
      </h1>

      <p>Product: {product.name}</p>

      <p>
        Entered Quantity:
        {" "}
        {enteredQuantity}
        {" "}
        {enteredUnit}
      </p>

      <p>
        Converted Quantity:
        {" "}
        {baseQuantity}
        {" "}
        {product.baseUnit}
      </p>

      <p>
        Total Price:
        ₹{totalPrice}
      </p>
    </main>
  );
}