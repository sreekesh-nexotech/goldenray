"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Popup,
  useMap,
} from "react-leaflet";
import { MapPin } from "lucide-react";
import type { ServiceLocation } from "@/data/service-area-content";

// Ring + core pin (matching the reference map design). Green when idle,
// brand-yellow when selected. Built as a divIcon so we can style it via CSS
// classes and sidestep Leaflet's default image-asset path issues.
function pinIcon(active: boolean) {
  const ringSize = active ? 40 : 28;

  return L.divIcon({
    className: `gr-pin${active ? " gr-pin--active" : ""}`,
    html: `<span class="gr-pin__ring"></span><span class="gr-pin__core"></span>`,
    iconSize: [ringSize, ringSize],
    iconAnchor: [ringSize / 2, ringSize / 2],
    tooltipAnchor: [0, -ringSize / 2],
    popupAnchor: [0, -ringSize / 2],
  });
}

// Inside the MapContainer: pans/zooms to the active place and opens its popup
// smoothly whenever the active selection changes.
function MapController({
  place,
  marker,
}: {
  place?: ServiceLocation;
  marker?: L.Marker | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!place) return;
    map.flyTo([place.lat, place.lng], 12, { duration: 0.8 });
    marker?.openPopup();
  }, [place, marker, map]);
  return null;
}

type Props = {
  places: ServiceLocation[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export default function LocationsMap({ places, activeIndex, onSelect }: Props) {
  const bounds = useMemo(
    () =>
      L.latLngBounds(places.map((p) => [p.lat, p.lng] as [number, number])),
    [places],
  );
  const active = activeIndex >= 0 ? places[activeIndex] : undefined;
  const markerRefs = useRef<(L.Marker | null)[]>([]);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [50, 50] }}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: "#eef1f5" }}
    >
      {/* Global styles for the pin + popup card (leaflet renders them outside React scope). */}
      <style jsx global>{`
        .gr-pin {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .gr-pin__ring {
          position: absolute;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(31, 122, 80, 0.16);
          border: 1.5px solid rgba(31, 122, 80, 0.55);
          transition: all 0.2s ease;
        }
        .gr-pin__core {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #1f7a50;
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.85);
          transition: all 0.2s ease;
        }
        .gr-pin--active .gr-pin__ring {
          width: 40px;
          height: 40px;
          background: rgba(247, 186, 65, 0.24);
          border-color: #d9860f;
        }
        .gr-pin--active .gr-pin__core {
          width: 15px;
          height: 15px;
          background: #f7ba41;
        }

        .flarize-popup .leaflet-popup-content-wrapper {
          border-radius: 14px;
          padding: 0;
          box-shadow: 0 14px 34px rgba(22, 36, 28, 0.22);
          border: 1px solid #edeff2;
        }
        .flarize-popup .leaflet-popup-content {
          margin: 0;
          width: 230px !important;
        }
        .flarize-popup .leaflet-popup-tip {
          background: #ffffff;
        }
        .flarize-popup .popup-inner {
          padding: 16px;
        }
        .flarize-popup .popup-name {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 17px;
          color: #123532;
        }
        .flarize-popup .popup-stat {
          margin-top: 8px;
          font-weight: 700;
          font-size: 22px;
          line-height: 1.1;
          color: #f7ba41;
        }
        .flarize-popup .popup-stat-label {
          margin-top: 2px;
          font-size: 11px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #757575;
        }
        .flarize-popup .popup-desc {
          margin-top: 10px;
          font-size: 12.5px;
          line-height: 1.5;
          color: #757575;
        }
        .flarize-popup .popup-tag {
          display: inline-block;
          margin-top: 10px;
          font-size: 11px;
          color: #f7ba41;
          background: #f7ba412e;
          border: 1px solid #f7ba41;
          padding: 3px 9px;
          border-radius: 100px;
        }
      `}</style>

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
          ref={(m) => {
            markerRefs.current[i] = m;
          }}
          eventHandlers={{
            // Tapping a pin selects it (highlights its card + opens the modal).
            click: () => onSelect(i),
          }}
        >
          <Tooltip direction="top" opacity={1} permanent={i === activeIndex}>
            {place.name}
          </Tooltip>

          <Popup className="flarize-popup" closeButton autoPan={false}>
            <div className="popup-inner">
              <div className="popup-name">
                <MapPin size={16} color="#F7BA41" />
                {place.name}
              </div>

              {place.installs != null && (
                <>
                  <div className="popup-stat">{place.installs}+</div>
                  <div className="popup-stat-label">Installations Completed</div>
                </>
              )}

              <div className="popup-desc">{place.description}</div>

              {place.tag && <span className="popup-tag">{place.tag}</span>}
            </div>
          </Popup>
        </Marker>
      ))}

      <MapController place={active} marker={markerRefs.current[activeIndex]} />
    </MapContainer>
  );
}
