import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default function handler() {
  return new ImageResponse(
    {
      type: "div",
      props: {
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
        children: [
          // Background mountains
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "300px",
                display: "flex",
                alignItems: "flex-end",
              },
              children: {
                type: "svg",
                props: {
                  width: "1200",
                  height: "300",
                  viewBox: "0 0 1200 300",
                  children: [
                    {
                      type: "path",
                      props: {
                        d: "M0 300 L200 80 L400 220 L600 40 L800 180 L1000 60 L1200 200 L1200 300 Z",
                        fill: "#00A86B",
                        opacity: "0.3",
                      },
                    },
                    {
                      type: "path",
                      props: {
                        d: "M0 300 L150 150 L350 250 L550 100 L750 220 L950 120 L1200 260 L1200 300 Z",
                        fill: "#00A86B",
                        opacity: "0.15",
                      },
                    },
                  ],
                },
              },
            },
          },
          // Stars
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "40px",
                right: "80px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "white",
                opacity: "0.6",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "80px",
                right: "200px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "white",
                opacity: "0.4",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "60px",
                left: "120px",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "white",
                opacity: "0.3",
              },
            },
          },
          // Main content
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 1,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "28px",
                      color: "#00E68A",
                      letterSpacing: "8px",
                      marginBottom: "16px",
                      fontWeight: 600,
                    },
                    children: "GANGWON TRAVEL",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "72px",
                      fontWeight: 800,
                      color: "white",
                      lineHeight: 1.1,
                      textAlign: "center",
                    },
                    children: "DB-DEEP 강원",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "24px",
                      color: "rgba(255,255,255,0.7)",
                      marginTop: "20px",
                      textAlign: "center",
                    },
                    children: "가볍게 누르고, 깊게 빠지다",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      gap: "12px",
                      marginTop: "32px",
                    },
                    children: [
                      { type: "span", props: { style: { fontSize: "16px", background: "rgba(0,168,107,0.3)", color: "#00E68A", padding: "8px 16px", borderRadius: "20px", border: "1px solid rgba(0,168,107,0.5)" }, children: "170+ 관광지" } },
                      { type: "span", props: { style: { fontSize: "16px", background: "rgba(0,168,107,0.3)", color: "#00E68A", padding: "8px 16px", borderRadius: "20px", border: "1px solid rgba(0,168,107,0.5)" }, children: "250+ 맛집" } },
                      { type: "span", props: { style: { fontSize: "16px", background: "rgba(0,168,107,0.3)", color: "#00E68A", padding: "8px 16px", borderRadius: "20px", border: "1px solid rgba(0,168,107,0.5)" }, children: "18개 시군구" } },
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
}
