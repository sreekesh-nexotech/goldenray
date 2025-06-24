// golden-ray/frontend/src/components/AdvanceCalculator/AdvanceVehicleManager.tsx
import React, { useState, useEffect, useMemo, useRef } from "react"; // Import useRef
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
    vehicleType: "",
    no_of_units: "",
    wattage: "",
    daily_usage: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiVehicleTypes, setApiVehicleTypes] = useState<VehicleType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ref for the input wrapper to position the dropdown
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  // Ref for the dropdown itself to close when clicking outside
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch vehicle types
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

  // Effect to close dropdown when clicking outside
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

  // Filter vehicle types for UI
  const usableVehicleTypes = useMemo(() => {
    return apiVehicleTypes ? apiVehicleTypes.filter((vehicle) => vehicle.show_in_ui) : [];
  }, [apiVehicleTypes]);

  // Filtered vehicles based on search term
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
    setNewVehicle((prev) => ({ ...prev, vehicleType: value })); // Update newVehicle.vehicleType as well for validation
    setIsDropdownOpen(true);
    setErrorMessage(null); // Clear error message when typing
  };

  const handleSelectVehicle = (vehicleName: string) => {
    setNewVehicle((prev) => ({ ...prev, vehicleType: vehicleName }));
    setSearchTerm(vehicleName);
    setIsDropdownOpen(false);
    setErrorMessage(null); // Clear error message on successful selection
  };

  const addElectric_vehicle = () => {
    const scrollY = window.scrollY;
    const no_of_unitsNum = parseFloat(newVehicle.no_of_units);
    const wattageNum = parseFloat(newVehicle.wattage);
    const daily_usageNum = parseFloat(newVehicle.daily_usage);
    const vehicleTypeToValidate = newVehicle.vehicleType;

    if (
      vehicleTypeToValidate &&
      vehicleTypeToValidate !== "" &&
      // Check if the selected vehicle type actually exists in usableVehicleTypes
      usableVehicleTypes.some(v => v.name === vehicleTypeToValidate) &&
      !isNaN(no_of_unitsNum) &&
      no_of_unitsNum > 0 &&
      !isNaN(wattageNum) &&
      wattageNum > 0 &&
      !isNaN(daily_usageNum) &&
      daily_usageNum >= 0
    ) {
      const vehicle: Electric_vehicle = {
        id: uuidv4(),
        device_type: vehicleTypeToValidate,
        no_of_units: no_of_unitsNum,
        wattage: wattageNum,
        daily_usage: daily_usageNum,
      };
      setelectric_vehicles((prev) => [...prev, vehicle]);
      setNewVehicle({ vehicleType: "", no_of_units: "", wattage: "", daily_usage: "" });
      setSearchTerm("");
      setErrorMessage(null);
    } else {
      let message = "Please enter valid positive numbers for units, wattage, and daily usage.";
      if (!vehicleTypeToValidate || !usableVehicleTypes.some(v => v.name === vehicleTypeToValidate)) {
        message = "Please select a valid vehicle type from the list.";
      } else if (isNaN(no_of_unitsNum) || no_of_unitsNum <= 0) {
        message = "Please enter a valid positive number for units.";
      } else if (isNaN(wattageNum) || wattageNum <= 0) {
        message = "Please enter a valid positive number for wattage.";
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

  // Render loading state
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

  // Render error state with retry button
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
            // No onBlur needed here as handled by global click listener
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            aria-label="Search and select vehicle type"
          />
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              // Changed max-h to display 2-4 options and then scroll
              className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-[8rem] overflow-y-auto shadow-lg"
            >
              {filteredVehicles.length > 0 ? (
                <>
                  {/* Conditionally render 'Cars' category if there are cars in filteredVehicles */}
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
                  {/* Conditionally render 'Scooters' category if there are scooters in filteredVehicles */}
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
            name="no_of_units"
            placeholder="No. of Units"
            value={newVehicle.no_of_units}
            onChange={handleVehicleChange}
            className="p-3 border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            min="1"
            step="1"
            aria-label="Number of units"
          />
          {errorMessage?.includes("units") && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
        <div className="relative">
          <input
            type="number"
            name="wattage"
            placeholder="Wattage (Watts)"
            value={newVehicle.wattage}
            onChange={handleVehicleChange}
            className="p-3 border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            min="1"
            step="1"
            aria-label="Charger wattage"
          />
          {errorMessage?.includes("wattage") && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
        <div className="relative">
          <input
            type="number"
            name="daily_usage"
            placeholder="Daily Usage (Hours)"
            value={newVehicle.daily_usage}
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
                  {vehicle.device_type} × {vehicle.no_of_units}
              </span>
              <div className="text-sm text-gray-600">
                {vehicle.wattage} Watts | {vehicle.daily_usage}h Daily Usage
              </div>
            </div>
            <button
              onClick={() => removeVehicle(vehicle.id)}
              className="cursor-pointer"
              aria-label={`Remove ${vehicle.device_type}`}
            >
              <Image src={deleteIcon} alt="Delete" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}