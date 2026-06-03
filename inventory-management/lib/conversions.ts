export function convertToBaseUnit(
  quantity: number,
  unit: string
) {
  switch (unit) {
    case "kg":
      return quantity * 1000;

    case "g":
      return quantity;

    case "L":
      return quantity * 1000;

    case "mL":
      return quantity;

    case "item":
      return quantity;

    default:
      throw new Error("Invalid unit");
  }
}