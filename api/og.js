import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

/**
 * OG Image endpoint — generates a 1200x630 PNG for social sharing.
 *
 * Uses satori-compatible React-element objects.
 * The key difference from the broken version: we build the element tree
 * using the exact shape satori expects:
 *   { type: string, props: { style, children } }
 * where `children` is either a string or an array of element objects.
 *
 * NOTE: a static fallback at /og-image.png is used in index.html
 * in case this endpoint has issues. This endpoint can still be called
 * directly at /api/og for dynamic OG images if needed.
 */
export default function handler(req) {
  try {
    return new ImageResponse(
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#1A1A2E",
            color: "white",
            fontFamily: "sans-serif",
            padding: "40px",
          },
          children: [
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  fontSize: 28,
                  color: "#00E68A",
                  letterSpacing: "8px",
                  fontWeight: 600,
                },
                children: "GANGWON TRAVEL",
              },
            },
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  fontSize: 96,
                  fontWeight: 800,
                  marginTop: 8,
                  letterSpacing: "-2px",
                },
                children: "DB-DEEP",
              },
            },
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  fontSize: 28,
                  color: "rgba(255,255,255,0.7)",
                  marginTop: 16,
                },
                children: "\uAC15\uC6D0\uB3C4 \uB9DE\uCDA4 \uC5EC\uD589 \uB8E8\uD2B8 \uCD94\uCC9C",
              },
            },
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "row",
                  gap: 80,
                  marginTop: 48,
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: { display: "flex", fontSize: 22, fontWeight: 700, color: "#00E68A" },
                            children: "18",
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: { display: "flex", fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 4 },
                            children: "\uC2DC\uAD70\uAD6C",
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: { display: "flex", fontSize: 22, fontWeight: 700, color: "#00E68A" },
                            children: "170+",
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: { display: "flex", fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 4 },
                            children: "\uAD00\uAD11\uC9C0",
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: { display: "flex", fontSize: 22, fontWeight: 700, color: "#00E68A" },
                            children: "250+",
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: { display: "flex", fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 4 },
                            children: "\uB9DB\uC9D1",
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("OG image generation failed:", e);
    return new Response("OG image generation failed", { status: 500 });
  }
}
