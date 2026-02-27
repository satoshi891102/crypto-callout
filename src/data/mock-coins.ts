import type { CoinInfo, PriceDataPoint } from "@/types";

/* ── Coin Metadata ── */

export const MOCK_COINS: CoinInfo[] = [
  { symbol: "BTC", name: "Bitcoin", icon: "₿" },
  { symbol: "ETH", name: "Ethereum", icon: "Ξ" },
  { symbol: "SOL", name: "Solana", icon: "◎" },
  { symbol: "DOGE", name: "Dogecoin", icon: "Ð" },
  { symbol: "ADA", name: "Cardano", icon: "₳" },
  { symbol: "XRP", name: "Ripple", icon: "✕" },
  { symbol: "AVAX", name: "Avalanche", icon: "▲" },
  { symbol: "DOT", name: "Polkadot", icon: "●" },
  { symbol: "MATIC", name: "Polygon", icon: "⬡" },
  { symbol: "LINK", name: "Chainlink", icon: "⬡" },
  { symbol: "UNI", name: "Uniswap", icon: "🦄" },
  { symbol: "ARB", name: "Arbitrum", icon: "◆" },
];

/* ── Current Prices (snapshot) ── */

export const MOCK_PRICES: Record<string, number> = {
  BTC: 97_432.18,
  ETH: 3_842.55,
  SOL: 198.73,
  DOGE: 0.1847,
  ADA: 0.7823,
  XRP: 2.41,
  AVAX: 42.19,
  DOT: 8.56,
  MATIC: 0.5134,
  LINK: 18.92,
  UNI: 12.47,
  ARB: 1.38,
};

/* ── 24h Changes ── */

export const MOCK_PRICE_CHANGES_24H: Record<string, number> = {
  BTC: 2.34,
  ETH: -1.12,
  SOL: 5.67,
  DOGE: -3.45,
  ADA: 1.89,
  XRP: 0.45,
  AVAX: -2.78,
  DOT: 3.21,
  MATIC: -0.98,
  LINK: 4.56,
  UNI: -1.34,
  ARB: 7.82,
};

/* ── Helper: generate price history ── */

function generatePriceHistory(
  symbol: string,
  days: number,
  predictionMarkers?: {
    dayOffset: number;
    predictionId: string;
    direction: "bullish" | "bearish";
    status: "correct" | "incorrect" | "pending";
  }[]
): PriceDataPoint[] {
  const basePrice = MOCK_PRICES[symbol] ?? 100;
  const volatility = symbol === "BTC" ? 0.015 : symbol === "ETH" ? 0.02 : 0.03;
  const points: PriceDataPoint[] = [];
  let price = basePrice * (1 - volatility * days * 0.3);

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, price * 0.5);

    const marker = predictionMarkers?.find((m) => m.dayOffset === i);

    points.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
      ...(marker
        ? {
            predictionMarker: {
              predictionId: marker.predictionId,
              direction: marker.direction,
              status: marker.status,
            },
          }
        : {}),
    });
  }

  return points;
}

/* ── Pre-generated Price Histories ── */

export const MOCK_BTC_PRICE_HISTORY: PriceDataPoint[] = generatePriceHistory(
  "BTC",
  90,
  [
    { dayOffset: 15, predictionId: "pred-001", direction: "bullish", status: "correct" },
    { dayOffset: 42, predictionId: "pred-005", direction: "bearish", status: "incorrect" },
    { dayOffset: 75, predictionId: "pred-012", direction: "bullish", status: "pending" },
  ]
);

export const MOCK_ETH_PRICE_HISTORY: PriceDataPoint[] = generatePriceHistory(
  "ETH",
  90,
  [
    { dayOffset: 20, predictionId: "pred-002", direction: "bullish", status: "correct" },
    { dayOffset: 55, predictionId: "pred-008", direction: "bullish", status: "correct" },
  ]
);

export const MOCK_SOL_PRICE_HISTORY: PriceDataPoint[] = generatePriceHistory(
  "SOL",
  90,
  [
    { dayOffset: 10, predictionId: "pred-003", direction: "bullish", status: "correct" },
    { dayOffset: 60, predictionId: "pred-010", direction: "bearish", status: "incorrect" },
    { dayOffset: 80, predictionId: "pred-015", direction: "bullish", status: "pending" },
  ]
);

export const MOCK_PRICE_HISTORIES: Record<string, PriceDataPoint[]> = {
  BTC: MOCK_BTC_PRICE_HISTORY,
  ETH: MOCK_ETH_PRICE_HISTORY,
  SOL: MOCK_SOL_PRICE_HISTORY,
};

/* ── Coin lookup helper ── */

export function getCoinBySymbol(symbol: string): CoinInfo | undefined {
  return MOCK_COINS.find((c) => c.symbol === symbol);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value >= 1 ? 2 : 4,
    maximumFractionDigits: value >= 1 ? 2 : 4,
  }).format(value);
}

export function formatPriceChange(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
