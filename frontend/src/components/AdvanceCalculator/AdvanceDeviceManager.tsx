import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { ElectronicDevice } from "@/types/calculator";
import deviceIcon from "../../../public/device.svg";
import deleteIcon from "../../../public/deleteIcon.svg";

// Pre-defined options for the device dropdown
const DEVICE_OPTIONS = [
  { value: "", label: "Select a device", disabled: true },
  { value: "Air Conditioner", label: "Air Conditioner" },
  { value: "Refrigerator", label: "Refrigerator" },
  { value: "Washing Machine", label: "Washing Machine" },
  { value: "Microwave", label: "Microwave" },
  { value: "Television", label: "Television" },
  { value: "Computer", label: "Computer" },
  { value: "Ceiling Fan", label: "Ceiling Fan" },
  { value: "LED Light", label: "LED Light" },
  { value: "Water Pump", label: "Water Pump" },
  { value: "Other", label: "Other" },
];

interface DeviceManagerProps {
  devices: ElectronicDevice[];
  setDevices: React.Dispatch<React.SetStateAction<ElectronicDevice[]>>;
  title: string;
}

export default function DeviceManager({ devices, setDevices, title }: DeviceManagerProps) {
  const [newDevice, setNewDevice] = useState({
    deviceType: "",
    noOfUnits: "",
    wattage: "",
    dailyUsage: "",
  });
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validate input fields
  const validateInputs = () => {
    const errors: { [key: string]: string } = {};
    if (!newDevice.deviceType || newDevice.deviceType === "") {
      errors.deviceType = "Device type is required";
    }
    const units = parseFloat(newDevice.noOfUnits);
    if (!newDevice.noOfUnits || isNaN(units) || units <= 0) {
      errors.noOfUnits = "Number of units must be a positive number";
    }
    const wattage = parseFloat(newDevice.wattage);
    if (!newDevice.wattage || isNaN(wattage) || wattage <= 0) {
      errors.wattage = "Wattage must be a positive number";
    }
    const dailyUsage = parseFloat(newDevice.dailyUsage);
    if (!newDevice.dailyUsage || isNaN(dailyUsage) || dailyUsage <= 0) {
      errors.dailyUsage = "Daily usage must be a positive number";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleDeviceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "deviceType") {
      if (e.target instanceof HTMLSelectElement) {
        // Handle select element changes
        if (value === "Other") {
          setShowOtherInput(true);
          setNewDevice((prev) => ({ ...prev, deviceType: "" }));
        } else {
          setShowOtherInput(false);
          setNewDevice((prev) => ({ ...prev, deviceType: value }));
        }
      } else {
        // Handle custom input changes
        setNewDevice((prev) => ({ ...prev, deviceType: value }));
      }
    } else {
      setNewDevice((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Add a new device
  const addElectronicDevice = () => {
    if (validateInputs()) {
      const device: ElectronicDevice = {
        id: uuidv4(),
        deviceType: newDevice.deviceType,
        noOfUnits: parseFloat(newDevice.noOfUnits),
        wattage: parseFloat(newDevice.wattage),
        dailyUsage: parseFloat(newDevice.dailyUsage),
      };
      setDevices([...devices, device]);
      setNewDevice({ deviceType: "", noOfUnits: "", wattage: "", dailyUsage: "" });
      setShowOtherInput(false);
    }
  };

  // Remove a device
  const removeDevice = (id: string) => {
    const deviceExists = devices.some((device) => device.id === id);
    if (deviceExists) {
      setDevices(devices.filter((device) => device.id !== id));
    } else {
      console.warn(`Device with id ${id} not found`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532]">
          {title}
        </h2>
        <button
          onClick={addElectronicDevice}
          className="hidden lg:block underline font-semibold text-[#123532] cursor-pointer whitespace-nowrap"
          aria-label="Add a new electronic device"
        >
          + Add Device
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <select
            name="deviceType"
            value={showOtherInput ? "Other" : newDevice.deviceType}
            onChange={handleDeviceChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            aria-label="Select device type"
          >
            {DEVICE_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          {errors.deviceType && (
            <p className="text-red-500 text-sm mt-1">{errors.deviceType}</p>
          )}
        </div>
        {showOtherInput && (
          <div className="relative">
            <input
              type="text"
              name="deviceType"
              placeholder="Enter Device Name"
              value={newDevice.deviceType}
              onChange={handleDeviceChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
              aria-label="Enter custom device name"
            />
            {errors.deviceType && (
              <p className="text-red-500 text-sm mt-1">{errors.deviceType}</p>
            )}
          </div>
        )}
        <div className="relative">
          <input
            type="number"
            name="noOfUnits"
            placeholder="No. of Units"
            value={newDevice.noOfUnits}
            onChange={handleDeviceChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            min="1"
            step="1"
            aria-label="Number of units"
          />
          {errors.noOfUnits && (
            <p className="text-red-500 text-sm mt-1">{errors.noOfUnits}</p>
          )}
        </div>
        <div className="relative">
          <input
            type="number"
            name="wattage"
            placeholder="Wattage"
            value={newDevice.wattage}
            onChange={handleDeviceChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            min="1"
            step="1"
            aria-label="Wattage in watts"
          />
          {errors.wattage && (
            <p className="text-red-500 text-sm mt-1">{errors.wattage}</p>
          )}
        </div>
        <div className="relative">
          <input
            type="number"
            name="dailyUsage"
            placeholder="Daily Usage (hrs)"
            value={newDevice.dailyUsage}
            onChange={handleDeviceChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            min="0.1"
            step="0.1"
            aria-label="Daily usage in hours"
          />
          {errors.dailyUsage && (
            <p className="text-red-500 text-sm mt-1">{errors.dailyUsage}</p>
          )}
        </div>
        <button
          onClick={addElectronicDevice}
          className="block lg:hidden underline font-semibold text-[#123532] cursor-pointer whitespace-nowrap"
          aria-label="Add a new electronic device"
        >
          + Add Device
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className="flex justify-between items-center p-3 rounded-2xl border border-[#DBD8D8]"
          >
            <div>
              <span className="font-semibold flex gap-2 items-center">
                <Image
                  src={deviceIcon}
                  alt={`Icon for ${device.deviceType}`}
                  width={24}
                  height={24}
                />
                {device.deviceType} × {device.noOfUnits}
              </span>
              <div className="text-sm text-gray-600 pl-8">
                {device.wattage} Watts | {device.dailyUsage}h Daily Usage
              </div>
            </div>
            <button
              onClick={() => removeDevice(device.id)}
              className="cursor-pointer"
              aria-label={`Remove ${device.deviceType}`}
            >
              <Image
                src={deleteIcon}
                alt={`Remove ${device.deviceType}`}
                width={24}
                height={24}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}