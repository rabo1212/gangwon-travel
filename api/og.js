import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default function handler() {
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
        },
        children: [
          {
            type: "div",
            props: {
              style: { fontSize: 28, color: "#00E68A", letterSpacing: 6, fontWeight: 600 },
              children: "GANGWON TRAVEL",
            },
          },
          {
            type: "div",
            props: {
              style: { fontSize: 80, fontWeight: 800, marginTop: 8 },
              children: "DB-DEEP",
            },
          },
          {
            type: "div",
            props: {
              style: { fontSize: 24, color: "rgba(255,255,255,0.5)", marginTop: 20 },
              children: "18 regions, your perfect route",
            },
          },
        ],
      },
    },
    { width: 1200, height: 630 }
  );
}
