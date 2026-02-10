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
          // Decorative circles
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "-60px",
                left: "-40px",
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background: "rgba(0,168,107,0.12)",
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
                borderRadius: "50%",
                background: "rgba(0,102,204,0.1)",
              },
            },
          },
          // Top label
          {
            type: "div",
            props: {
              style: {
                fontSize: "24px",
                color: "#00E68A",
                letterSpacing: "6px",
                marginBottom: "12px",
                fontWeight: "600",
              },
              children: "GANGWON TRAVEL",
            },
          },
          // Main title
          {
            type: "div",
            props: {
              style: {
                fontSize: "64px",
                fontWeight: "800",
                color: "white",
                lineHeight: "1.2",
                textAlign: "center",
              },
              children: "DB-DEEP",
            },
          },
          // Subtitle
          {
            type: "div",
            props: {
              style: {
                fontSize: "22px",
                color: "rgba(255,255,255,0.6)",
                marginTop: "16px",
                textAlign: "center",
              },
              children: "18 regions, your perfect route",
            },
          },
          // Tags row
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                gap: "12px",
                marginTop: "28px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "15px",
                      background: "rgba(0,168,107,0.25)",
                      color: "#00E68A",
                      padding: "8px 18px",
                      borderRadius: "20px",
                      border: "1px solid rgba(0,168,107,0.4)",
                    },
                    children: "170+ Spots",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "15px",
                      background: "rgba(0,168,107,0.25)",
                      color: "#00E68A",
                      padding: "8px 18px",
                      borderRadius: "20px",
                      border: "1px solid rgba(0,168,107,0.4)",
                    },
                    children: "250+ Restaurants",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "15px",
                      background: "rgba(0,168,107,0.25)",
                      color: "#00E68A",
                      padding: "8px 18px",
                      borderRadius: "20px",
                      border: "1px solid rgba(0,168,107,0.4)",
                    },
                    children: "18 Cities",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: 1200, height: 630 }
  );
}
