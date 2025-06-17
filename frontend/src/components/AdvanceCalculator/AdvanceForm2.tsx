/* golden-ray/frontend/src/components/AdvanceCalculator/AdvanceForm2.tsx */
import React, { useState } from "react";
import { UsageDetailsFormData, ElectronicDevice, ElectricVehicle } from "./AdvanceCalculatorMain";
import { v4 as uuidv4 } from "uuid";
import Button from "../ui/Button";

interface UsageDetailsStepProps {
  formData: UsageDetailsFormData;
  setFormData: React.Dispatch<React.SetStateAction<UsageDetailsFormData>>;
  onCalculate: () => void;
  loading: boolean;
  homeType: "Existing Home" | "New Home" | null;
}

export default function UsageDetailsStep({
  formData,
  setFormData,
  onCalculate,
  loading,
  homeType,
}: UsageDetailsStepProps) {
  const [newDevice, setNewDevice] = useState({
    deviceType: "",
    noOfUnits: "",
    wattage: "",
    dailyUsage: "",
  });
  const [newVehicle, setNewVehicle] = useState({
    deviceType: "",
    noOfUnits: "",
    wattage: "",
    dailyUsage: "",
  });

  const handleDeviceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDevice((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const addElectronicDevice = () => {
    if (
      newDevice.deviceType &&
      newDevice.noOfUnits &&
      newDevice.wattage &&
      newDevice.dailyUsage
    ) {
      const device: ElectronicDevice = {
        id: uuidv4(),
        deviceType: newDevice.deviceType,
        noOfUnits: newDevice.noOfUnits,
        wattage: newDevice.wattage,
        dailyUsage: newDevice.dailyUsage,
      };
      setFormData((prev) => ({
        ...prev,
        electronicDevices: [...prev.electronicDevices, device],
      }));
      setNewDevice({ deviceType: "", noOfUnits: "", wattage: "", dailyUsage: "" });
    }
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
      setNewVehicle({ deviceType: "", noOfUnits: "", wattage: "", dailyUsage: "" });
    }
  };

  const removeDevice = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      electronicDevices: prev.electronicDevices.filter((device) => device.id !== id),
    }));
  };

  const removeVehicle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      electricVehicles: prev.electricVehicles.filter((vehicle) => vehicle.id !== id),
    }));
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-semibold text-[#123532] mb-4">
        Your Usage
      </h2>

      {/* Electronic Devices Section */}
      <div>
        <h3 className="text-lg font-medium text-[#123532] mb-2">
          Electronic Devices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            name="deviceType"
            placeholder="Device Type"
            value={newDevice.deviceType}
            onChange={handleDeviceChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          />
          <input
            type="number"
            name="noOfUnits"
            placeholder="No. of Units"
            value={newDevice.noOfUnits}
            onChange={handleDeviceChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          />
          <input
            type="number"
            name="wattage"
            placeholder="Wattage"
            value={newDevice.wattage}
            onChange={handleDeviceChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          />
          <input
            type="number"
            name="dailyUsage"
            placeholder="Daily Usage (hrs)"
            value={newDevice.dailyUsage}
            onChange={handleDeviceChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          />
        </div>
        <button
          onClick={addElectronicDevice}
          className="px-4 py-2 bg-[#235C58] text-white rounded-lg hover:bg-[#1e4e47]"
        >
          Add Device
        </button>
        <div className="mt-4">
          {formData.electronicDevices.map((device) => (
            <div
              key={device.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <span>
                {device.deviceType} - {device.noOfUnits} units, {device.wattage}W,{" "}
                {device.dailyUsage}hrs/day
              </span>
              <button
                onClick={() => removeDevice(device.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Electric Vehicles Section */}
      <div>
        <h3 className="text-lg font-medium text-[#123532] mb-2">
          Electric Vehicles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            name="deviceType"
            placeholder="Vehicle Type"
            value={newVehicle.deviceType}
            onChange={handleVehicleChange}
            className="p-3 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
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
            placeholder="Wattage"
            value={newVehicle.wattage}
            onChange={handleVehicleChange}
            className="p-3 border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          />
          <input
            type="number"
            name="dailyUsage"
            placeholder="Daily Usage (hrs)"
            value={newVehicle.dailyUsage}
            onChange={handleVehicleChange}
            className="p-3 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          />
        </div>
        <button
          onClick={addElectricVehicle}
          className="px-4 py-2 bg-[#235C58] text-white rounded-lg hover:bg-[#1e4e47]"
        >
          Add Vehicle
        </button>
        <div className="mt-4">
          {formData.electricVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <span>
                {vehicle.deviceType} - {vehicle.noOfUnits} units, {vehicle.wattage}W,{" "}
                {vehicle.dailyUsage}hrs/day
              </span>
              <button
                onClick={() => removeVehicle(vehicle.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={onCalculate}
          disabled={loading}
        >
          {loading ? "Processing..." : homeType === "New Home" ? "Next" : "Calculate"}
        </Button>
      </div>
    </div>
  );
}