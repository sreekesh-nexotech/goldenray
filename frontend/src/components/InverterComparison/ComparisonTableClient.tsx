"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { SolarInverter } from "@/types/solarInverter";
import ComparisonTable from "@/components/InverterComparison/ComparisonTable";

interface ComparisonTableClientProps {
  initialSelectedInverters: SolarInverter[];
  allInverters: SolarInverter[];
}

export default function ComparisonTableClient({
  initialSelectedInverters,
  allInverters,
}: ComparisonTableClientProps) {
  const router = useRouter();
  const [selectedInverters, setSelectedInverters] = useState<SolarInverter[]>(
    initialSelectedInverters,
  );

  const updateURL = useCallback(
    (newIds: string[]) => {
      const params = new URLSearchParams();
      if (newIds.length > 0) {
        params.set("inverters", newIds.join(","));
      }
      router.replace(`/inverter-comparison-table?${params.toString()}`, {
        scroll: false,
      });
    },
    [router],
  );

  const handleRemoveInverter = (inverterId: string) => {
    const newSelected = selectedInverters.filter((p) => p.id !== inverterId);
    setSelectedInverters(newSelected);
    updateURL(newSelected.map((p) => p.id));
  };

  const handleAddInverter = (inverterId: string) => {
    if (selectedInverters.length >= 3) return;
    const toAdd = allInverters.find((p) => p.id === inverterId);
    if (toAdd && !selectedInverters.find((p) => p.id === inverterId)) {
      const newSelected = [...selectedInverters, toAdd];
      setSelectedInverters(newSelected);
      updateURL(newSelected.map((p) => p.id));
    }
  };

  const handleBack = () => {
    router.push("/inverter-comparison");
  };

  return (
    <ComparisonTable
      selectedInverters={selectedInverters}
      allInverters={allInverters}
      onRemoveInverter={handleRemoveInverter}
      onAddInverter={handleAddInverter}
      onClose={handleBack}
    />
  );
}
