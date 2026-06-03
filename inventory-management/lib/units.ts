export const UNIT_OPTIONS = {
  weight: ["g", "kg"],
  volume: ["mL", "L"],
  count: ["item"],
};

export function isValidUnit(
  dimension: string,
  unit: string
) {
  return (
    UNIT_OPTIONS[
      dimension as keyof typeof UNIT_OPTIONS
    ]?.includes(unit) ?? false
  );
}