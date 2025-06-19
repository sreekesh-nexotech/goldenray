/* golden-ray/frontend/src/components/AdvanceCalculator/AdvanceForm2.tsx */
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import Button from "../ui/Button";
import { UsageDetailsFormData, ElectricVehicle, ElectronicDevice } from "@/types/calculator";
import DeviceManager from "./AdvanceDeviceManager"; // Import the reusable component
import deviceIcon from "../../../public/device.svg";
import deleteIcon from "../../../public/deleteIcon.svg";

interface UsageDetailsStepProps {
  formData: UsageDetailsFormData;
  setFormData: React.Dispatch<React.SetStateAction<UsageDetailsFormData>>;
  onCalculate: () => void;
  loading: boolean;
  gridType: "On Grid" | "Hybrid" | null;
}

export default function UsageDetailsStep({
  formData,
  setFormData,
  onCalculate,
  loading,
  gridType,
}: UsageDetailsStepProps) {
  

  // State for the new vehicle input fields
  const [newVehicle, setNewVehicle] = useState({
    deviceType: "",
    noOfUnits: "",
    wattage: "",
    dailyUsage: "",
  });

  /**
   * This is a wrapper function passed to the DeviceManager component.
   * It allows the child component to update the `electronicDevices` array,
   * which is part of the parent's `usageDetails` state object.
   */
  const setElectronicDevices: React.Dispatch<React.SetStateAction<ElectronicDevice[]>> = (
    updater
  ) => {
    setFormData((prev) => ({
      ...prev,
      electronicDevices: typeof updater === "function" ? updater(prev.electronicDevices) : updater,
    }));
  };


  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const addElectricVehicle = () => {
    if (
      newVehicle.deviceType &&
      newVehicle.noOfUnits &&
      newVehicle.wattage &&
      newVehicle.dailyUsage
    ) {
      const vehicle: ElectricVehicle = {
        id: uuidv4(),
        deviceType: newVehicle.deviceType,
        noOfUnits: newVehicle.noOfUnits,
        wattage: newVehicle.wattage,
        dailyUsage: newVehicle.dailyUsage,
      };
      setFormData((prev) => ({
        ...prev,
        electricVehicles: [...prev.electricVehicles, vehicle],
      }));
      // Reset the input fields after adding
      setNewVehicle({ deviceType: "", noOfUnits: "", wattage: "", dailyUsage: "" });
    }
  };

  const removeVehicle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      electricVehicles: prev.electricVehicles.filter((vehicle) => vehicle.id !== id),
    }));
  };

  return (
    <div className="space-y-12 p-0 md:p-6">
      {/* --- Electronic Devices Section (Using Reusable Component) --- */}
      <DeviceManager
        devices={formData.electronicDevices}
        setDevices={setElectronicDevices}
        title="Tell us what electronics you want to include?"
      />

      {/* --- Electric Vehicles Section --- */}
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
          <input
            type="text"
            name="deviceType"
            placeholder="Vehicle Type (e.g., Car)"
            value={newVehicle.deviceType}
            onChange={handleVehicleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          />
          <input
            type="number"
            name="noOfUnits"
            placeholder="No. of Units"
            value={newVehicle.noOfUnits}
            onChange={handleVehicleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          />
          <input
            type="number"
            name="wattage"
            placeholder="Charger Wattage"
            value={newVehicle.wattage}
            onChange={handleVehicleChange}
            className="p-3 border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          />
          <input
            type="number"
            name="dailyUsage"
            placeholder="Daily Charging (hrs)"
            value={newVehicle.dailyUsage}
            onChange={handleVehicleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          />

          <button
          onClick={addElectricVehicle}
          className="block lg:hidden underline font-semibold text-[#123532] cursor-pointer whitespace-nowrap"
        >
          + Add Device
        </button>
        </div>

        <div className="mt-4 space-y-3">
          {formData.electricVehicles.map((vehicle) => (
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
              >
                <Image src={deleteIcon} alt="Delete" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- Navigation Button --- */}
      <div className="flex justify-end mt-8">
        <Button onClick={onCalculate} disabled={loading}>
          {loading ? "Processing..." : gridType === "Hybrid" ? "Next" : "Calculate"}
        </Button>
      </div>
    </div>
  );
}