import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { Electric_vehicle } from "@/types/types";
import deviceIcon from "../../../public/device.svg";
import deleteIcon from "../../../public/deleteIcon.svg";

const VEHICLE_OPTIONS = ["Select A Vehicle Type", "Car", "Bike", "Scooty", "Other"];

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
  const [customVehicleType, setCustomVehicleType] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "vehicleType") {
      setNewVehicle((prev) => ({ ...prev, vehicleType: value })); // Set vehicleType to the selected value (e.g., "Other")
      if (value === "Other") {
        setCustomVehicleType(""); // Reset custom input when "Other" is selected
      } else {
        setCustomVehicleType(""); // Clear custom input when switching back from "Other"
      }
    } else {
      setNewVehicle((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addElectric_vehicle = () => {
    const no_of_unitsNum = parseFloat(newVehicle.no_of_units);
    const wattageNum = parseFloat(newVehicle.wattage);
    const daily_usageNum = parseFloat(newVehicle.daily_usage);

    // Determine the actual vehicle type to use for validation and storage
    const vehicleTypeToValidate = newVehicle.vehicleType === "Other" ? customVehicleType : newVehicle.vehicleType;

    if (
      vehicleTypeToValidate && // Ensure vehicleType (or customVehicleType) is not empty
      vehicleTypeToValidate !== "Select A Vehicle Type" && // Ensure a valid selection
      !isNaN(no_of_unitsNum) &&
      no_of_unitsNum > 0 &&
      !isNaN(wattageNum) &&
      wattageNum > 0 &&
      !isNaN(daily_usageNum) &&
      daily_usageNum >= 0
    ) {
      const vehicle: Electric_vehicle = {
        id: uuidv4(),
        device_type: vehicleTypeToValidate, // Use the determined vehicle type
        no_of_units: parseFloat(newVehicle.no_of_units),
        wattage: parseFloat(newVehicle.wattage),
        daily_usage: parseFloat(newVehicle.daily_usage),
      };
      setelectric_vehicles((prev) => [...prev, vehicle]);
      setNewVehicle({ vehicleType: "", no_of_units: "", wattage: "", daily_usage: "" });
      setCustomVehicleType("");
      setErrorMessage(null);
    } else {
      let message = "Please enter valid positive numbers for units, wattage, and daily usage.";
      if (!vehicleTypeToValidate || vehicleTypeToValidate === "Select A Vehicle Type") {
        message = "Please select a vehicle type or enter a custom type if 'Other' is selected.";
      }
      setErrorMessage(message);
    }
  };

  const removeVehicle = (id: string) => {
    setelectric_vehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-start justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532]">
          Add your electric vehicle (if any)
        </h2>
        <button
          onClick={addElectric_vehicle}
          className="hidden lg:block underline font-semibold text-[#123532] cursor-pointer whitespace-nowrap"
        >
          + Add Vehicle
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <select
          name="vehicleType"
          value={newVehicle.vehicleType}
          onChange={handleVehicleChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          aria-label="Select vehicle type"
        >
          {VEHICLE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {newVehicle.vehicleType === "Other" && (
          <input
            type="text"
            name="customVehicleType"
            placeholder="Enter vehicle type"
            value={customVehicleType}
            onChange={(e) => setCustomVehicleType(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
            aria-label="Custom vehicle type"
          />
        )}
        <input
          type="number"
          name="no_of_units"
          placeholder="No. of Units"
          value={newVehicle.no_of_units}
          onChange={handleVehicleChange}
          className="p-3 border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          aria-label="Number of units"
        />
        <input
          type="number"
          name="wattage"
          placeholder="Charger Wattage"
          value={newVehicle.wattage}
          onChange={handleVehicleChange}
          className="p-3 border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          aria-label="Charger wattage"
        />
        <input
          type="number"
          name="daily_usage"
          placeholder="Daily Charging (hrs)"
          value={newVehicle.daily_usage}
          onChange={handleVehicleChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          aria-label="Daily charging hours"
        />
        <button
          onClick={addElectric_vehicle}
          className="block lg:hidden underline font-semibold text-[#123532] cursor-pointer whitespace-nowrap"
        >
          + Add Vehicle
        </button>
      </div>
      {errorMessage && <p className="text-sm text-red-600 mt-2">{errorMessage}</p>}
      <div className="mt-4 space-y-3">
        {electric_vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="flex justify-between items-center p-3 rounded-2xl border border-[#DBD8D8]"
          >
            <div>
              <span className="font-semibold flex gap-2 items-center">
                <Image src={deviceIcon} alt="vehicle icon" />
                {vehicle.device_type} × {vehicle.no_of_units}
              </span>
              <div className="text-sm text-gray-600 pl-8">
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