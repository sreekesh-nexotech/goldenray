// src/components/ui/FaqAnswer.tsx
//
// Renders an FAQ answer from either source: the shipped copy (plain strings)
// or the Studio (§6.5 allows light HTML — <p>, <ul>, <li>, <strong>, <a>).
// Plain text renders as before; anything carrying a tag renders as markup.
// The HTML comes from signed-in Studio editors, the same trust boundary as
// the blog body, so no client-side sanitising is layered on top.

import React from "react";

const HAS_TAG = /<\/?[a-z][\s\S]*>/i;

export default function FaqAnswer({ answer, className }: { answer: string; className?: string }) {
  if (HAS_TAG.test(answer)) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: answer }} />;
  }
  return <div className={className}>{answer}</div>;
}
