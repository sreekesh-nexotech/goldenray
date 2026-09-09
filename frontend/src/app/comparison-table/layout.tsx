// Metadata for this route is generated per panel selection in ./page.tsx
// (generateMetadata), so the title can name the panels being compared while the
// canonical stays on the parameter-free URL. This layout only exists to give
// the segment a boundary for ./loading.tsx.
export default function ComparisonTableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
