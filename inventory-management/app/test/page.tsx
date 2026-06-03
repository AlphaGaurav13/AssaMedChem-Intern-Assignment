import { convertToBaseUnit } from "@/lib/conversions";

export default function TestPage() {
  const result1 = convertToBaseUnit(2, "kg");

  const result2 = convertToBaseUnit(3, "L");

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">
        Unit Conversion Test
      </h1>

      <p>2 kg = {result1} g</p>

      <p>3 L = {result2} mL</p>
    </main>
  );
}