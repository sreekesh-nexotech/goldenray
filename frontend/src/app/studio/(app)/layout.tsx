// src/app/studio/(app)/layout.tsx
//
// Wraps every authenticated studio screen in the shared shell (sidebar +
// topbar). The sign-in screen sits outside this group and renders standalone.

import StudioShell from "@/components/Studio/shell/StudioShell";

export default function StudioAppLayout({ children }: { children: React.ReactNode }) {
  return <StudioShell>{children}</StudioShell>;
}
