// golden-ray/frontend/src/components/AdvanceCalculator/AdvanceVehicleManager.tsx
import React, { useState, useEffect } from "react";
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

  // Filter vehicle types for UI
  const usableVehicleTypes = apiVehicleTypes ? apiVehicleTypes.filter((vehicle) => vehicle.show_in_ui) : [];

  // Group vehicles by category
  const cars = usableVehicleTypes.filter((vehicle) => vehicle.category === "Car");
  const scooters = usableVehicleTypes.filter((vehicle) => vehicle.category === "Scooter");

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
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
      setErrorMessage(null);
    } else {
      let message = "Please enter valid positive numbers for units, wattage, and daily usage.";
      if (!vehicleTypeToValidate) {
        message = "Please select a vehicle type.";
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
        <div className="relative">
          {cars.length === 0 && scooters.length === 0 ? (
            <p className="text-gray-500 p-3 border border-gray-300 rounded-lg w-full">
              No vehicles available
            </p>
          ) : (
            <select
              name="vehicleType"
              value={newVehicle.vehicleType}
              onChange={handleVehicleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
              aria-label="Select vehicle type"
            >
              <option value="" disabled>
                Select A Vehicle Type
              </option>
              {cars.length > 0 && (
                <optgroup label="Cars">
                  {cars.map((vehicle) => (
                    <option key={vehicle.name} value={vehicle.name}>
                      {vehicle.name}
                    </option>
                  ))}
                </optgroup>
              )}
              {scooters.length > 0 && (
                <optgroup label="Scooters">
                  {scooters.map((vehicle) => (
                    <option key={vehicle.name} value={vehicle.name}>
                      {vehicle.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
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
            placeholder="Wattage"
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
            placeholder="Daily Usage"
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