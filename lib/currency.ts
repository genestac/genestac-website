export function formatINR(amount?: number | null): string {
  const safeAmount = typeof amount === "number" && Number.isFinite(amount) ? amount : 0;

  return `₹${safeAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
