import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default function handler() {
  return new ImageResponse(
    {
      type: "div",
      props: {
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "-60px",
                left: "-40px",
                width: "400px",
                height: "400px",
                borderRadius: "200px",
                background: "rgba(0,168,107,0.15)",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "-80px",
                right: "-60px",
                width: "350px",
                height: "350px",
                borderRadius: "175px",
                background: "rgba(0,102,204,0.12)",
              },
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
                    style: { fontSize: 24, color: "#00E68A", letterSpacing: 6, marginBottom: 12, fontWeight: 600 },
                    children: "GANGWON TRAVEL",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { fontSize: 72, fontWeight: 800, color: "white", lineHeight: 1.2 },
                    children: "DB-DEEP",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { fontSize: 22, color: "rgba(255,255,255,0.6)", marginTop: 16 },
                    children: "18 regions, your perfect route",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { display: "flex", gap: 12, marginTop: 32 },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: { fontSize: 15, background: "rgba(0,168,107,0.25)", color: "#00E68A", padding: "8px 18px", borderRadius: 20, border: "1px solid rgba(0,168,107,0.4)" },
                          children: "170+ Spots",
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: { fontSize: 15, background: "rgba(0,168,107,0.25)", color: "#00E68A", padding: "8px 18px", borderRadius: 20, border: "1px solid rgba(0,168,107,0.4)" },
                          children: "250+ Restaurants",
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: { fontSize: 15, background: "rgba(0,168,107,0.25)", color: "#00E68A", padding: "8px 18px", borderRadius: 20, border: "1px solid rgba(0,168,107,0.4)" },
                          children: "18 Cities",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        },
      },
    },
    { width: 1200, height: 630 }
  );
}
