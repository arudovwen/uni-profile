export default function (
  value,
  currency = "NGN",
  fraction = 0,
  showSymbol = true
) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: fraction,
    maximumFractionDigits:2
  });

  const formattedValue = formatter.format(value || 0);

  return showSymbol ? formattedValue : formattedValue.replace(/[^0-9.-]/g, "");
}
