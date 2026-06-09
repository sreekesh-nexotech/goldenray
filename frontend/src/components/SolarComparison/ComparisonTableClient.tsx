"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { SolarPanel } from "@/types/solarPanel";
import ComparisonTable from "@/components/SolarComparison/ComparisonTable";

interface ComparisonTableClientProps {
  initialSelectedPanels: SolarPanel[];
  allPanels: SolarPanel[];
}

export default function ComparisonTableClient({
  initialSelectedPanels,
  allPanels,
}: ComparisonTableClientProps) {
  const router = useRouter();
  const [selectedPanels, setSelectedPanels] =
    useState<SolarPanel[]>(initialSelectedPanels);

  // Update URL when panels change
  const updateURL = useCallback(
    (newPanelIds: string[]) => {
      const params = new URLSearchParams();
      if (newPanelIds.length > 0) {
        params.set("panels", newPanelIds.join(","));
      }
      router.replace(`/comparison-table?${params.toString()}`, {
        scroll: false,
      });
    },
    [router],
  );

  const handleRemovePanel = (panelId: string) => {
    const newSelected = selectedPanels.filter((p) => p.id !== panelId);
    setSelectedPanels(newSelected);
    updateURL(newSelected.map((p) => p.id));
  };

  const handleAddPanel = (panelId: string) => {
    if (selectedPanels.length >= 3) return;
    const panelToAdd = allPanels.find((p) => p.id === panelId);
    if (panelToAdd && !selectedPanels.find((p) => p.id === panelId)) {
      const newSelected = [...selectedPanels, panelToAdd];
      setSelectedPanels(newSelected);
      updateURL(newSelected.map((p) => p.id));
    }
  };

  const handleBackToComparison = () => {
    router.push("/solar-comparison");
  };

  return (
    <ComparisonTable
      selectedPanels={selectedPanels}
      allPanels={allPanels}
      onRemovePanel={handleRemovePanel}
      onAddPanel={handleAddPanel}
      onClose={handleBackToComparison}
    />
  );
}
