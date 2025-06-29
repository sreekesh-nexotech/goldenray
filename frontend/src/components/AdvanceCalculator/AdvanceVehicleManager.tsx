import React, { useState, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { Electric_vehicle, VehicleType } from "@/types/types"; 
import deleteIcon from "../../../public/deleteIcon.svg";
import { getVehicleTypes } from "@/services/vehicleService";

interface Electric_vehicleManagerProps {
  electric_vehicles: Electric_vehicle[];
  setelectric_vehicles: React.Dispatch<React.SetStateAction<Electric_vehicle[]>>;
}

export default function Electric_vehicleManager({
  electric_vehicles,
  setelectric_vehicles,
}: Electric_vehicleManagerProps) {
  const [newVehicle, setNewVehicle] = useState({
    model: "",
    no_of_vehicles: "",
    daily_avg_km: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiVehicleTypes, setApiVehicleTypes] = useState<VehicleType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchVehicles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedTypes = await getVehicleTypes();
      setApiVehicleTypes(fetchedTypes);
    } catch (err: unknown) {
      console.error("Failed to fetch vehicle types:", err);
      let errorMessage = "Failed to load vehicle types.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const usableVehicleTypes = useMemo(() => {
    return apiVehicleTypes ? apiVehicleTypes.filter((vehicle) => vehicle.show_in_ui) : [];
  }, [apiVehicleTypes]);

  const filteredVehicles = useMemo(() => {
    if (!searchTerm) {
      return usableVehicleTypes;
    }
    return usableVehicleTypes.filter((vehicle) =>
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usableVehicleTypes, searchTerm]);

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setNewVehicle((prev) => ({ ...prev, model: value }));
    setIsDropdownOpen(true);
    setErrorMessage(null);
  };

  const handleSelectVehicle = (vehicleName: string) => {
    setNewVehicle((prev) => ({ ...prev, model: vehicleName }));
    setSearchTerm(vehicleName);
    setIsDropdownOpen(false);
    setErrorMessage(null);
  };

  const addElectric_vehicle = () => {
    const scrollY = window.scrollY;
    const no_of_unitsNum = parseFloat(newVehicle.no_of_vehicles);
    const daily_usageNum = parseFloat(newVehicle.daily_avg_km);
    const vehicleTypeToValidate = newVehicle.model;

    // Find the selected vehicle from usableVehicleTypes to get its category
    const selectedVehicle = usableVehicleTypes.find(v => v.name === vehicleTypeToValidate);

    if (
      vehicleTypeToValidate &&
      vehicleTypeToValidate !== "" &&
      selectedVehicle && // Ensure selectedVehicle is found
      !isNaN(no_of_unitsNum) &&
      no_of_unitsNum > 0 &&
      !isNaN(daily_usageNum) &&
      daily_usageNum >= 0
    ) {
      const vehicle: Electric_vehicle = {
        id: uuidv4(),
        model: vehicleTypeToValidate,
        no_of_vehicles: no_of_unitsNum,
        daily_avg_km: daily_usageNum,
        // Add the category property to the Electric_vehicle object
        category: selectedVehicle.category,
      };
      setelectric_vehicles((prev) => [...prev, vehicle]);
      setNewVehicle({ model: "", no_of_vehicles: "",  daily_avg_km: "" });
      setSearchTerm("");
      setErrorMessage(null);
    } else {
      let message = "Please enter valid positive numbers for units, wattage, and daily usage.";
      if (!vehicleTypeToValidate || !selectedVehicle) {
        message = "Please select a valid vehicle type from the list.";
      } else if (isNaN(no_of_unitsNum) || no_of_unitsNum <= 0) {
        message = "Please enter a valid positive number for units.";
      } else if (isNaN(daily_usageNum) || daily_usageNum < 0) {
        message = "Please enter a valid non-negative number for daily usage.";
      }
      setErrorMessage(message);
    }
    window.scrollTo(0, scrollY);
  };

  const removeVehicle = (id: string) => {
    const scrollY = window.scrollY;
    setelectric_vehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
    window.scrollTo(0, scrollY);
  };

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
        <button
          onClick={addElectric_vehicle}
          className="hidden lg:block underline font-semibold text-[#123532] cursor-pointer whitespace-nowrap"
          aria-label="Add a new electric vehicle"
        >
          + Add Vehicle
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="relative" ref={inputWrapperRef}>
          <input
            type="text"
            placeholder="Search & Select Vehicle Type"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsDropdownOpen(true)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            aria-label="Search and select vehicle type"
          />
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-[8rem] overflow-y-auto shadow-lg"
            >
              {filteredVehicles.length > 0 ? (
                <>
                  {usableVehicleTypes.some(v => v.category === "Car") && filteredVehicles.filter(v => v.category === "Car").length > 0 && (
                    <div className="p-2 text-gray-500 font-semibold text-sm sticky top-0 bg-white border-b border-gray-200">Cars</div>
                  )}
                  {filteredVehicles.filter(v => v.category === "Car").map((vehicle) => (
                    <div
                      key={vehicle.name}
                      onMouseDown={() => handleSelectVehicle(vehicle.name)}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      {vehicle.name}
                    </div>
                  ))}
                  {usableVehicleTypes.some(v => v.category === "Scooter") && filteredVehicles.filter(v => v.category === "Scooter").length > 0 && (
                    <div className="p-2 text-gray-500 font-semibold text-sm sticky top-0 bg-white border-b border-gray-200 mt-1 pt-1">Scooters</div>
                  )}
                  {filteredVehicles.filter(v => v.category === "Scooter").map((vehicle) => (
                    <div
                      key={vehicle.name}
                      onMouseDown={() => handleSelectVehicle(vehicle.name)}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      {vehicle.name}
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-3 text-gray-500">No vehicles found. Try searching.</div>
              )}
            </div>
          )}
          {errorMessage?.includes("vehicle type") && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
        <div className="relative">
          <input
            type="number"
            name="no_of_vehicles"
            placeholder="No. of Vehicles"
            value={newVehicle.no_of_vehicles}
            onChange={handleVehicleChange}
            className="p-3 border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            min="1"
            step="1"
            aria-label="Number of Vehicles"
          />
          {errorMessage?.includes("units") && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
        
        <div className="relative">
          <input
            type="number"
            name="daily_avg_km"
            placeholder="Daily Usage (Km)"
            value={newVehicle.daily_avg_km}
            onChange={handleVehicleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            min="0"
            step="0.1"
            aria-label="Daily charging hours"
          />
          {errorMessage?.includes("daily usage") && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
        <button
          onClick={addElectric_vehicle}
          className="block lg:hidden underline font-semibold text-[#123532] cursor-pointer whitespace-nowrap"
          aria-label="Add a new electric vehicle"
        >
          + Add Vehicle
        </button>
      </div>
      {errorMessage && !errorMessage.includes("vehicle type") && !errorMessage.includes("units") && !errorMessage.includes("wattage") && !errorMessage.includes("daily usage") && (
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
                  src={vehicle.category === "Car" ? "https://gym-manager-pull.b-cdn.net/golden_ray/icons/car.svg" : "https://gym-manager-pull.b-cdn.net/golden_ray/icons/scooter.svg"} // Dynamically choose icon based on category
                  alt={`Icon for ${vehicle.model}`}
                  width={24}
                  height={24}
                />
                {vehicle.model} × {vehicle.no_of_vehicles}
              </span>
              <div className="text-sm text-gray-600">
                {vehicle.daily_avg_km}Km Daily Usage
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