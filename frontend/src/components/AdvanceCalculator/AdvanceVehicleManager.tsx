import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { ElectricVehicle } from "@/types/calculator";
import deviceIcon from "../../../public/device.svg";
import deleteIcon from "../../../public/deleteIcon.svg";

const VEHICLE_OPTIONS = ["Select A Vehicle Type", "Car", "Bike", "Scooty", "Other"];

interface ElectricVehicleManagerProps {
  electricVehicles: ElectricVehicle[];
  setElectricVehicles: React.Dispatch<React.SetStateAction<ElectricVehicle[]>>;
}

export default function ElectricVehicleManager({
  electricVehicles,
  setElectricVehicles,
}: ElectricVehicleManagerProps) {
  
  const [newVehicle, setNewVehicle] = useState({
    vehicleType: "",
    noOfUnits: "",
    wattage: "",
    dailyUsage: "",
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

  const addElectricVehicle = () => {
    const noOfUnitsNum = parseFloat(newVehicle.noOfUnits);
    const wattageNum = parseFloat(newVehicle.wattage);
    const dailyUsageNum = parseFloat(newVehicle.dailyUsage);

    // Determine the actual vehicle type to use for validation and storage
    const vehicleTypeToValidate = newVehicle.vehicleType === "Other" ? customVehicleType : newVehicle.vehicleType;

    if (
      vehicleTypeToValidate && // Ensure vehicleType (or customVehicleType) is not empty
      vehicleTypeToValidate !== "Select A Vehicle Type" && // Ensure a valid selection
      !isNaN(noOfUnitsNum) &&
      noOfUnitsNum > 0 &&
      !isNaN(wattageNum) &&
      wattageNum > 0 &&
      !isNaN(dailyUsageNum) &&
      dailyUsageNum >= 0
    ) {
      const vehicle: ElectricVehicle = {
        id: uuidv4(),
        deviceType: vehicleTypeToValidate, // Use the determined vehicle type
        noOfUnits: parseFloat(newVehicle.noOfUnits),
        wattage: parseFloat(newVehicle.wattage),
        dailyUsage: parseFloat(newVehicle.dailyUsage),
      };
      setElectricVehicles((prev) => [...prev, vehicle]);
      setNewVehicle({ vehicleType: "", noOfUnits: "", wattage: "", dailyUsage: "" });
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
    setElectricVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-start justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532]">
          Add your electric vehicle (if any)
        </h2>
        <button
          onClick={addElectricVehicle}
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
          name="noOfUnits"
          placeholder="No. of Units"
          value={newVehicle.noOfUnits}
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
          name="dailyUsage"
          placeholder="Daily Charging (hrs)"
          value={newVehicle.dailyUsage}
          onChange={handleVehicleChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          aria-label="Daily charging hours"
        />
        <button
          onClick={addElectricVehicle}
          className="block lg:hidden underline font-semibold text-[#123532] cursor-pointer whitespace-nowrap"
        >
          + Add Vehicle
        </button>
      </div>
      {errorMessage && <p className="text-sm text-red-600 mt-2">{errorMessage}</p>}
      <div className="mt-4 space-y-3">
        {electricVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="flex justify-between items-center p-3 rounded-2xl border border-[#DBD8D8]"
          >
            <div>
              <span className="font-semibold flex gap-2 items-center">
                <Image src={deviceIcon} alt="vehicle icon" />
                {vehicle.deviceType} × {vehicle.noOfUnits}
              </span>
              <div className="text-sm text-gray-600 pl-8">
                {vehicle.wattage} Watts | {vehicle.dailyUsage}h Daily Usage
              </div>
            </div>
            <button
              onClick={() => removeVehicle(vehicle.id)}
              className="cursor-pointer"
              aria-label={`Remove ${vehicle.deviceType}`}
            >
              <Image src={deleteIcon} alt="Delete" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}