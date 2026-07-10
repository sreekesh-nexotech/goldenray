"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import type { ServiceLocation } from "@/data/service-area-content";

// Custom teardrop pin as an inline SVG divIcon — lets us colour the active pin
// with the brand yellow and avoids Leaflet's default image-asset path issues.
function pinIcon(active: boolean) {
  const color = active ? "#F7BA41" : "#8C97A7";
  const size = active ? 46 : 32;
  return L.divIcon({
    className: "gr-pin",
    html: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
           style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3)); cursor: pointer;">
        <path d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 15 9 15s9-8.25 9-15c0-4.97-4.03-9-9-9z"
              fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="12" cy="9" r="3.1" fill="#ffffff"/>
      </svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    tooltipAnchor: [0, -size + 6],
  });
}

// Pans/zooms the map to the active location whenever it changes.
function FlyToActive({ place }: { place?: ServiceLocation }) {
  const map = useMap();
  useEffect(() => {
    if (place) {
      map.flyTo([place.lat, place.lng], 12, { duration: 0.8 });
    }
  }, [place, map]);
  return null;
}

type Props = {
  places: ServiceLocation[];
  activeIndex: number;
};

export default function LocationsMap({ places, activeIndex }: Props) {
  const bounds = useMemo(
    () =>
      L.latLngBounds(places.map((p) => [p.lat, p.lng] as [number, number])),
    [places],
  );
  const active = activeIndex >= 0 ? places[activeIndex] : undefined;

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [50, 50] }}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: "#eef1f5" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      {places.map((place, i) => (
        <Marker
          key={place.name}
          position={[place.lat, place.lng]}
          icon={pinIcon(i === activeIndex)}
          zIndexOffset={i === activeIndex ? 1000 : 0}
          eventHandlers={{
            // Clicking a pin opens the location in Google Maps.
            click: () =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`,
                "_blank",
                "noopener,noreferrer",
              ),
          }}
        >
          <Tooltip direction="top" opacity={1} permanent={i === activeIndex}>
            {place.name}
          </Tooltip>
        </Marker>
      ))}

      <FlyToActive place={active} />
    </MapContainer>
  );
}
