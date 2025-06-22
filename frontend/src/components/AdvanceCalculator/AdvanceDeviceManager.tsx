// src/components/AdvanceCalculator/AdvanceDeviceManager.tsx
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { Electronic_device, DeviceType } from "@/types/types";
import deviceIcon from "../../../public/device.svg";
import deleteIcon from "../../../public/deleteIcon.svg";
import { getDeviceTypes } from "@/services/deviceService";

interface DeviceManagerProps {
  devices: Electronic_device[];
  setDevices: React.Dispatch<React.SetStateAction<Electronic_device[]>>;
  title: string;
}

export default function DeviceManager({ devices, setDevices, title }: DeviceManagerProps) {
  const [newDevice, setNewDevice] = useState({
    device_type: "",
    no_of_units: "",
    wattage: "",
    daily_usage: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiDeviceTypes, setApiDeviceTypes] = useState<DeviceType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch device types
  const fetchDevices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedTypes = await getDeviceTypes();
      setApiDeviceTypes(fetchedTypes);
    } catch (err: unknown) {
      console.error("Failed to fetch device types:", err);
      let errorMessage = "Failed to load device types.";
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
    fetchDevices();
  }, []);

  // Filter device types for UI
  const usableDeviceTypes = apiDeviceTypes ? apiDeviceTypes.filter(device => device.show_in_ui) : [];

  // Combine placeholder with API-fetched options
  const deviceOptions = [
    { value: "", label: "Select a device", disabled: true },
    ...usableDeviceTypes.map((device: DeviceType) => ({
      value: device.name,
      label: device.name,
      disabled: false,
    })),
  ];

  // Validate input fields
  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newDevice.device_type || newDevice.device_type === "") {
      newErrors.device_type = "Device type is required";
    }
    const units = parseFloat(newDevice.no_of_units);
    if (!newDevice.no_of_units || isNaN(units) || units <= 0) {
      newErrors.no_of_units = "Number of units must be a positive number";
    }
    const wattage = parseFloat(newDevice.wattage);
    if (!newDevice.wattage || isNaN(wattage) || wattage <= 0) {
      newErrors.wattage = "Wattage must be a positive number";
    }
    const daily_usage = parseFloat(newDevice.daily_usage);
    if (!newDevice.daily_usage || isNaN(daily_usage) || daily_usage < 0) {
      newErrors.daily_usage = "Daily usage must be a non-negative number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleDeviceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDevice((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Add a new device
  const addElectronic_device = () => {
    if (validateInputs()) {
      const device: Electronic_device = {
        id: uuidv4(),
        device_type: newDevice.device_type,
        no_of_units: parseFloat(newDevice.no_of_units),
        wattage: parseFloat(newDevice.wattage),
        daily_usage: parseFloat(newDevice.daily_usage),
      };
      setDevices([...devices, device]);
      setNewDevice({ device_type: "", no_of_units: "", wattage: "", daily_usage: "" });
      setErrors({});
    }
  };

  // Remove a device
  const removeDevice = (id: string) => {
    setDevices(devices.filter((device) => device.id !== id));
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532]">{title}</h2>
        <p className="mt-4 text-gray-700">Loading device types...</p>
      </div>
    );
  }

  // Render error state with retry button
  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532]">{title}</h2>
        <p className="mt-4">Error: {error}</p>
        <button
          onClick={fetchDevices}
          className="mt-2 px-4 py-2 bg-[#F7BA41] text-white rounded-lg"
          aria-label="Retry loading device types"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532]">{title}</h2>
        <button
          onClick={addElectronic_device}
          className="hidden lg:block underline font-semibold text-[#123532] cursor-pointer whitespace-nowrap"
          aria-label="Add a new electronic device"
        >
          + Add Device
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          {deviceOptions.length <= 1 ? (
            <p className="text-gray-500 p-3 border border-gray-300 rounded-lg w-full">
              No devices available
            </p>
          ) : (
            <select
              name="device_type"
              value={newDevice.device_type}
              onChange={handleDeviceChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
              aria-label="Select device type"
            >
              {deviceOptions.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {errors.device_type && (
            <p className="text-red-500 text-sm mt-1">{errors.device_type}</p>
          )}
        </div>
        <div className="relative">
          <input
            type="number"
            name="no_of_units"
            placeholder="No. of Units"
            value={newDevice.no_of_units}
            onChange={handleDeviceChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="1"
            step="1"
            aria-label="Number of units"
          />
          {errors.no_of_units && (
            <p className="text-red-500 text-sm mt-1">{errors.no_of_units}</p>
          )}
        </div>
        <div className="relative">
          <input
            type="number"
            name="wattage"
            placeholder="Wattage"
            value={newDevice.wattage}
            onChange={handleDeviceChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
            name="daily_usage"
            placeholder="Daily Usage (hrs)"
            value={newDevice.daily_usage}
            onChange={handleDeviceChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="0"
            step="0.1"
            aria-label="Daily usage in hours"
          />
          {errors.daily_usage && (
            <p className="text-red-500 text-sm mt-1">{errors.daily_usage}</p>
          )}
        </div>
        <button
          onClick={addElectronic_device}
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
                  alt={`Icon for ${device.device_type}`}
                  width={24}
                  height={24}
                />
                {device.device_type} × {device.no_of_units}
              </span>
              <div className="text-sm text-gray-600 pl-8">
                {device.wattage} Watts | {device.daily_usage}h Daily Usage
              </div>
            </div>
            <button
              onClick={() => removeDevice(device.id)}
              className="cursor-pointer"
              aria-label={`Remove ${device.device_type}`}
            >
              <Image
                src={deleteIcon}
                alt={`Remove ${device.device_type}`}
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