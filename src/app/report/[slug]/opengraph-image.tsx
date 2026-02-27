import { ImageResponse } from "next/og";
import { MOCK_INFLUENCERS } from "@/data/mock-influencers";
import { getPredictionsByInfluencer } from "@/data/mock-predictions";
import { calculateAvgReturn, getTopCoins } from "@/lib/scoring";

export const runtime = "edge";

export const alt = "CryptoCallout Report Card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function getAccuracyHex(score: number) {
  if (score >= 70) return "#10B981";
  if (score >= 50) return "#F59E0B";
  return "#EF4444";
}

function getTierLabel(score: number) {
  if (score >= 85) return "Legendary";
  if (score >= 70) return "Expert";
  if (score >= 50) return "Intermediate";
  if (score >= 25) return "Novice";
  return "Unranked";
}

function getTierColor(score: number) {
  if (score >= 85) return "#10B981";
  if (score >= 70) return "#6366F1";
  if (score >= 50) return "#F59E0B";
  if (score >= 25) return "#94A3B8";
  return "#64748B";
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const influencer = MOCK_INFLUENCERS.find((inf) => inf.id === slug);

  if (!influencer) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0A0E17",
            color: "#F1F5F9",
            fontSize: 40,
            fontFamily: "sans-serif",
          }}
        >
          Report Card Not Found
        </div>
      ),
      { ...size }
    );
  }

  const predictions = getPredictionsByInfluencer(influencer.id);
  const resolved = predictions.filter((p) => p.status !== "pending");
  const correct = resolved.filter((p) => p.status === "correct");
  const avgReturn = calculateAvgReturn(predictions);
  const topCoins = getTopCoins(predictions, 3);
  const accuracyColor = getAccuracyHex(influencer.accuracyScore);
  const tierLabel = getTierLabel(influencer.accuracyScore);
  const tierColor = getTierColor(influencer.accuracyScore);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0A0E17",
          fontFamily: "sans-serif",
          padding: "48px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background accent glow */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: tierColor,
            opacity: 0.06,
            filter: "blur(80px)",
          }}
        />

        {/* Top bar: branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: "#6366F1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              CC
            </div>
            <span
              style={{
                color: "#94A3B8",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              CryptoCallout
            </span>
          </div>
          <div
            style={{
              color: "#64748B",
              fontSize: 16,
            }}
          >
            Report Card
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: 48,
          }}
        >
          {/* Left side: influencer info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {/* Avatar + name */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#1A2332",
                  border: `3px solid ${tierColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#F1F5F9",
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                {influencer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div
                  style={{
                    color: "#F1F5F9",
                    fontSize: 32,
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  {influencer.name}
                </div>
                <div
                  style={{
                    color: "#64748B",
                    fontSize: 18,
                  }}
                >
                  {influencer.handle}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  <div
                    style={{
                      background: "#1A2332",
                      color: tierColor,
                      fontSize: 13,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 6,
                    }}
                  >
                    {tierLabel}
                  </div>
                  {influencer.rank <= 10 && (
                    <div
                      style={{
                        background: "#1A2332",
                        color: "#6366F1",
                        fontSize: 13,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 6,
                      }}
                    >
                      #{influencer.rank} Ranked
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#111827",
                  border: "1px solid #1E293B",
                  borderRadius: 10,
                  padding: "12px 18px",
                  flex: 1,
                }}
              >
                <span style={{ color: "#64748B", fontSize: 12 }}>Predictions</span>
                <span style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 700 }}>
                  {resolved.length}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#111827",
                  border: "1px solid #1E293B",
                  borderRadius: 10,
                  padding: "12px 18px",
                  flex: 1,
                }}
              >
                <span style={{ color: "#64748B", fontSize: 12 }}>Correct</span>
                <span style={{ color: "#10B981", fontSize: 22, fontWeight: 700 }}>
                  {correct.length}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#111827",
                  border: "1px solid #1E293B",
                  borderRadius: 10,
                  padding: "12px 18px",
                  flex: 1,
                }}
              >
                <span style={{ color: "#64748B", fontSize: 12 }}>Avg Return</span>
                <span
                  style={{
                    color: avgReturn >= 0 ? "#10B981" : "#EF4444",
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  {avgReturn >= 0 ? "+" : ""}
                  {avgReturn.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Top coins */}
            {topCoins.length > 0 && (
              <div style={{ display: "flex", gap: 8 }}>
                {topCoins.map((coin) => (
                  <div
                    key={coin.coinSymbol}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#111827",
                      border: "1px solid #1E293B",
                      borderRadius: 8,
                      padding: "6px 12px",
                    }}
                  >
                    <span style={{ color: "#F1F5F9", fontSize: 14, fontWeight: 600 }}>
                      {coin.coinSymbol}
                    </span>
                    <span
                      style={{
                        color: coin.accuracy >= 70 ? "#10B981" : coin.accuracy >= 50 ? "#F59E0B" : "#EF4444",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {coin.accuracy}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side: large accuracy ring */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 260,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 200,
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Ring background */}
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                <circle
                  cx="100"
                  cy="100"
                  r="88"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="10"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="88"
                  fill="none"
                  stroke={accuracyColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(influencer.accuracyScore / 100) * 2 * Math.PI * 88} ${2 * Math.PI * 88}`}
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <span
                  style={{
                    color: accuracyColor,
                    fontSize: 48,
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {influencer.accuracyScore.toFixed(1)}%
                </span>
                <span
                  style={{
                    color: "#64748B",
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                  }}
                >
                  Accuracy
                </span>
              </div>
            </div>

            {influencer.streak > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 16,
                  color: influencer.streak >= 5 ? "#F59E0B" : "#94A3B8",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {influencer.streak}W streak
                {influencer.streak >= 5 && " 🔥"}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #1E293B",
            paddingTop: 16,
            marginTop: 16,
          }}
        >
          <span style={{ color: "#64748B", fontSize: 14 }}>
            AI-tracked prediction accuracy
          </span>
          <span style={{ color: "#64748B", fontSize: 14 }}>
            cryptocallout.com/report/{slug}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
