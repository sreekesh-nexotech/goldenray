import React, { useState, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { Electric_vehicle, VehicleType } from "@/types/types";
import deleteIcon from "../../../public/deleteIcon.svg";
import { getVehicleTypes } from "@/services/vehicleService";

interface Electric_vehicleManagerProps {
  electric_vehicles: Electric_vehicle[];
  setelectric_vehicles: React.Dispatch<
    React.SetStateAction<Electric_vehicle[]>
  >;
  validateInputs?: (validator: () => boolean) => void;
}

export default function Electric_vehicleManager({
  electric_vehicles,
  setelectric_vehicles,
  validateInputs,
}: Electric_vehicleManagerProps) {
  const [newVehicle, setNewVehicle] = useState({
    model: "",
    no_of_vehicles: "",
    daily_avg_km: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiVehicleTypes, setApiVehicleTypes] = useState<VehicleType[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch vehicle types from API
  const fetchVehicles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTypes = await getVehicleTypes();
      setApiVehicleTypes(fetchedTypes);
    } catch (err: unknown) {
      console.error("Failed to fetch vehicle types:", err);
      setError(
        err instanceof Error
          ? err.message
          : String(err) || "Failed to load vehicle types."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Only show usable vehicles
  const usableVehicleTypes = useMemo(
    () => apiVehicleTypes?.filter((vehicle) => vehicle.show_in_ui) || [],
    [apiVehicleTypes]
  );

  // Filtered search list
  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return usableVehicleTypes;
    return usableVehicleTypes.filter((vehicle) =>
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usableVehicleTypes, searchTerm]);

  // Grouped vehicles in rendered order
  const filteredCars = useMemo(
    () => filteredVehicles.filter((v) => v.category === "Car"),
    [filteredVehicles]
  );
  const filteredScooters = useMemo(
    () => filteredVehicles.filter((v) => v.category === "Scooter"),
    [filteredVehicles]
  );
  const displayedVehicles = useMemo(
    () => [...filteredCars, ...filteredScooters],
    [filteredCars, filteredScooters]
  );

  // Handle input changes
  const handleVehicleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setNewVehicle((prev) => ({ ...prev, model: value }));
    setIsDropdownOpen(true);
    setHighlightedIndex(0);
    setErrorMessage(null);
  };

  // Select vehicle from dropdown
  const handleSelectVehicle = (vehicleName: string) => {
    setNewVehicle((prev) => ({ ...prev, model: vehicleName }));
    setSearchTerm(vehicleName);
    setIsDropdownOpen(false);
    setErrorMessage(null);
  };

  // Scroll to highlighted option without jitter
  const scrollToHighlighted = (index: number) => {
    if (dropdownRef.current) {
      const optionEl =
        dropdownRef.current.querySelectorAll<HTMLDivElement>("[data-option]")[
          index
        ];
      if (optionEl) {
        optionEl.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsDropdownOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const newIndex = prev < displayedVehicles.length - 1 ? prev + 1 : 0;
        scrollToHighlighted(newIndex);
        return newIndex;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const newIndex = prev > 0 ? prev - 1 : displayedVehicles.length - 1;
        scrollToHighlighted(newIndex);
        return newIndex;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isDropdownOpen && highlightedIndex >= 0) {
        handleSelectVehicle(displayedVehicles[highlightedIndex].name);
      } else {
        addElectric_vehicle();
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleAnyFieldKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addElectric_vehicle();
    }
  };

  // Preserve page scroll position after updates
  const preserveScroll = (callback: () => void) => {
    const scrollY = window.scrollY;
    callback();
    requestAnimationFrame(() => window.scrollTo(0, scrollY));
  };

  const addElectric_vehicle = () => {
    preserveScroll(() => {
      const no_of_unitsNum = parseFloat(newVehicle.no_of_vehicles);
      const daily_usageNum = parseFloat(newVehicle.daily_avg_km);
      const selectedVehicle = usableVehicleTypes.find(
        (v) => v.name === newVehicle.model
      );

      if (
        selectedVehicle &&
        !isNaN(no_of_unitsNum) &&
        no_of_unitsNum > 0 &&
        !isNaN(daily_usageNum) &&
        daily_usageNum >= 0
      ) {
        const vehicle: Electric_vehicle = {
          id: uuidv4(),
          model: selectedVehicle.name,
          no_of_vehicles: no_of_unitsNum,
          daily_avg_km: daily_usageNum,
          category: selectedVehicle.category,
        };
        setelectric_vehicles((prev) => [...prev, vehicle]);
        setNewVehicle({ model: "", no_of_vehicles: "", daily_avg_km: "" });
        setSearchTerm("");
        setErrorMessage(null);
      } else {
        setErrorMessage(
          !selectedVehicle
            ? "Please select a valid vehicle type from the list."
            : isNaN(no_of_unitsNum) || no_of_unitsNum <= 0
            ? "Please enter a valid positive number for units."
            : "Please enter a valid non-negative number for daily usage."
        );
      }
    });
  };

  const removeVehicle = (id: string) => {
    preserveScroll(() => {
      setelectric_vehicles((prev) =>
        prev.filter((vehicle) => vehicle.id !== id)
      );
    });
  };

  // Validate before form submission
  const validateVehicleInputs = () => {
    if (
      newVehicle.model ||
      newVehicle.no_of_vehicles ||
      newVehicle.daily_avg_km
    ) {
      setErrorMessage("Please click 'Add Vehicle' to save your input.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (validateInputs) validateInputs(validateVehicleInputs);
  }, [newVehicle, validateInputs]);

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532]">
          Add your electric vehicle (if any)
        </h2>
        <p className="mt-4 text-gray-700">Loading vehicle types...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532]">
          Add your electric vehicle (if any)
        </h2>
        <p className="mt-4">Error: {error}</p>
        <button
          onClick={fetchVehicles}
          className="mt-2 px-4 py-2 bg-[#F7BA41] text-white rounded-lg"
          aria-label="Retry loading vehicle types"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-start justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532]">
          Add your electric vehicle (if any)
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
        <div className="relative" ref={inputWrapperRef}>
          <label
            htmlFor="no_of_units"
            className="block text-sm font-medium text-[#123532] mb-1"
          >
            Vehicle Type
          </label>
          <input
            type="text"
            placeholder="Search & Select Vehicle Type"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => {
              setIsDropdownOpen(true);
              setHighlightedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            aria-label="Search and select vehicle type"
          />
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-[8rem] overflow-y-auto shadow-lg"
            >
              {displayedVehicles.length > 0 ? (
                <>
                  {usableVehicleTypes.some((v) => v.category === "Car") &&
                    filteredCars.length > 0 && (
                      <div className="p-2 text-gray-500 font-semibold text-sm sticky top-0 bg-white border-b border-gray-200">
                        Cars
                      </div>
                    )}
                  {filteredCars.map((vehicle, index) => (
                    <div
                      key={vehicle.name}
                      data-option
                      onMouseDown={() => handleSelectVehicle(vehicle.name)}
                      className={`p-2 cursor-pointer ${
                        highlightedIndex === index
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {vehicle.name}
                    </div>
                  ))}
                  {usableVehicleTypes.some((v) => v.category === "Scooter") &&
                    filteredScooters.length > 0 && (
                      <div className="p-2 text-gray-500 font-semibold text-sm sticky top-0 bg-white border-b border-gray-200 mt-1 pt-1">
                        Scooters
                      </div>
                    )}
                  {filteredScooters.map((vehicle, index) => (
                    <div
                      key={vehicle.name}
                      data-option
                      onMouseDown={() => handleSelectVehicle(vehicle.name)}
                      className={`p-2 cursor-pointer ${
                        highlightedIndex === index + filteredCars.length
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {vehicle.name}
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-3 text-gray-500">
                  No vehicles found. Try searching.
                </div>
              )}
            </div>
          )}
          {errorMessage?.includes("vehicle type") && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
        <div className="relative">
          <label
            htmlFor="no_of_units"
            className="block text-sm font-medium text-[#123532] mb-1"
          >
            Number of Vehicles
          </label>
          <input
            type="number"
            name="no_of_vehicles"
            placeholder="No. of Vehicles"
            value={newVehicle.no_of_vehicles}
            onChange={handleVehicleChange}
            className="p-3 border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            onKeyDown={handleAnyFieldKeyDown}
            min="1"
            step="1"
            aria-label="Number of Vehicles"
          />
          {errorMessage?.includes("units") && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
        <div className="relative">
          <label
            htmlFor="no_of_units"
            className="block text-sm font-medium text-[#123532] mb-1"
          >
            Daily Usage (KM)
          </label>
          <input
            type="number"
            name="daily_avg_km"
            placeholder="Daily Usage (Km)"
            value={newVehicle.daily_avg_km}
            onChange={handleVehicleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            onKeyDown={handleAnyFieldKeyDown}
            min="0"
            step="0.1"
            aria-label="Monthly Usage in KM"
          />
          {errorMessage?.includes("daily usage") && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
        <div className="flex items-end h-full">
          <button
            onClick={addElectric_vehicle}
            // target="new"
            className="text-[#007E85] font-bold border border-[#007E85] rounded-2xl hover:bg-[#007E85] hover:text-white transition-all ease-in-out text-sm px-5 py-3 md:text-base md:ml-4"
            aria-label="Add a new electric vehicle"
          >
            + Add Vehicle
          </button>
        </div>
      </div>
      {errorMessage &&
        !errorMessage.includes("vehicle type") &&
        !errorMessage.includes("units") &&
        !errorMessage.includes("wattage") &&
        !errorMessage.includes("daily usage") && (
          <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
        )}
      <div className="mt-4 space-y-3">
        {electric_vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="flex justify-between items-center p-3 rounded-2xl border border-[#DBD8D8]"
          >
            <div>
              <span className="font-semibold flex gap-2 items-center">
                <Image
                  src={
                    vehicle.category === "Car"
                      ? "https://gym-manager-pull.b-cdn.net/golden_ray/icons/car.svg"
                      : "https://gym-manager-pull.b-cdn.net/golden_ray/icons/scooter.svg"
                  }
                  alt={`Icon for ${vehicle.model}`}
                  width={24}
                  height={24}
                />
                {vehicle.model} × {vehicle.no_of_vehicles}
              </span>
              <div className="text-sm text-gray-600">
                {vehicle.daily_avg_km}Km Monthly Usage
              </div>
            </div>
            <button
              onClick={() => removeVehicle(vehicle.id)}
              className="cursor-pointer"
              aria-label={`Remove ${vehicle.model}`}
            >
              <Image src={deleteIcon} alt="Delete" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
