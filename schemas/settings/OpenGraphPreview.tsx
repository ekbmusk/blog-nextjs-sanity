"use client";

import { useEffect, useState } from "react";
import { Settings } from "./types"; // adjust import if needed
import { fontsPromise } from "./fonts"; // make sure this points to the original fontsPromise

export default function OpenGraphPreview(props: Settings['ogImage']) {
  const [fonts, setFonts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fontsPromise
      .then((loadedFonts) => {
        if (isMounted) {
          setFonts(loadedFonts);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load fonts:", err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <div>Loading Open Graph Preview...</div>;

  return (
    <div>
      {/* Replace this with your actual OpenGraphPreview rendering logic */}
      <p>Fonts loaded! Ready to render OpenGraph preview.</p>
    </div>
  );
}