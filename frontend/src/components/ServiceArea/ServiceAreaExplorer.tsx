"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ServiceAreaSearch from "./ServiceAreaSearch";
import PopularServiceAreas from "./PopularServiceAreas";
import {
  allServiceAreas,
  normalizeDistrict,
  ALL_REGIONS,
  ALL_SERVICES,
  type ServiceType,
} from "@/data/service-area-data";

export default function ServiceAreaExplorer() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState(ALL_REGIONS);
  const [service, setService] = useState(ALL_SERVICES);

  // Apply deep-linked filters from the navbar (e.g. /service-area?region=Alappuzha).
  useEffect(() => {
    const regionParam = searchParams.get("region");
    const serviceParam = searchParams.get("service");
    const searchParam = searchParams.get("search");

    if (regionParam) setRegion(regionParam);
    if (serviceParam) setService(serviceParam);
    if (searchParam) setSearch(searchParam);

    // Scroll the results into view when arriving with a filter applied.
    if (regionParam || serviceParam || searchParam) {
      const el = document.getElementById("service-areas");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchParams]);

  const filteredAreas = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allServiceAreas.filter((area) => {
      const matchesRegion =
        region === ALL_REGIONS ||
        normalizeDistrict(area.district) === normalizeDistrict(region);

      const matchesService =
        service === ALL_SERVICES ||
        area.services.includes(service as ServiceType);

      const matchesSearch =
        !query ||
        area.district.toLowerCase().includes(query) ||
        normalizeDistrict(area.district).toLowerCase().includes(query);

      return matchesRegion && matchesService && matchesSearch;
    });
  }, [search, region, service]);

  const isFiltered =
    region !== ALL_REGIONS || service !== ALL_SERVICES || search.trim() !== "";

  const handleExplore = () => {
    const el = document.getElementById("service-areas");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectRegion = (value: string) => {
    setRegion(value);
    handleExplore();
  };

  return (
    <>
      <ServiceAreaSearch
        search={search}
        setSearch={setSearch}
        region={region}
        setRegion={setRegion}
        service={service}
        setService={setService}
        onExplore={handleExplore}
      />
      <PopularServiceAreas
        areas={filteredAreas}
        region={region}
        onSelectRegion={handleSelectRegion}
        isFiltered={isFiltered}
      />
    </>
  );
}
