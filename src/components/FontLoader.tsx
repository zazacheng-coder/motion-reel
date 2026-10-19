import React, { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

/**
 * Local variable fonts, loaded before the first frame is measured.
 * Space Grotesk 300–700, Instrument Serif 400 + italic, JetBrains Mono 400–700.
 */
export const FontLoader: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading reel typography"));

  useEffect(() => {
    let cancelled = false;
    const faces = [
      new FontFace("Space Grotesk", `url(${staticFile("fonts/SpaceGrotesk.woff2")})`, {
        weight: "300 700",
        style: "normal",
        display: "block",
      }),
      new FontFace("Instrument Serif", `url(${staticFile("fonts/InstrumentSerif.woff2")})`, {
        weight: "400",
        style: "normal",
        display: "block",
      }),
      new FontFace("Instrument Serif", `url(${staticFile("fonts/InstrumentSerif-Italic.woff2")})`, {
        weight: "400",
        style: "italic",
        display: "block",
      }),
      new FontFace("JetBrains Mono", `url(${staticFile("fonts/JetBrainsMono.woff2")})`, {
        weight: "400 700",
        style: "normal",
        display: "block",
      }),
    ];

    Promise.all(faces.map((face) => face.load()))
      .then(() => {
        if (cancelled) return;
        faces.forEach((face) => document.fonts.add(face));
        return document.fonts.ready;
      })
      .then(() => {
        if (!cancelled) continueRender(handle);
      })
      .catch((err) => cancelRender(err));

    return () => {
      cancelled = true;
    };
  }, [handle]);

  return null;
};
