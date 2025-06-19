import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { ElectronicDevice } from "@/types/calculator";
import deviceIcon from "../../../public/device.svg";
import deleteIcon from "../../../public/deleteIcon.svg";

// Pre-defined options for the device dropdown
const DEVICE_OPTIONS = [
  "Select a device", "Air Conditioner", "Refrigerator", "Washing Machine", "Microwave",
  "Television", "Computer", "Ceiling Fan", "LED Light", "Water Pump", "Other"
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

  const handleDeviceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "deviceType") {
        if (value === "Other") {
            setShowOtherInput(true);
            setNewDevice((prev) => ({ ...prev, deviceType: "" })); // Clear deviceType for user input
        } else {
            setShowOtherInput(false);
            setNewDevice((prev) => ({ ...prev, deviceType: value }));
        }
    } else {
        setNewDevice((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addElectronicDevice = () => {
    if (
      newDevice.deviceType &&
      newDevice.noOfUnits &&
      newDevice.wattage &&
      newDevice.dailyUsage
    ) {
      const device: ElectronicDevice = { id: uuidv4(), ...newDevice };
      setDevices([...devices, device]);
      setNewDevice({ deviceType: "", noOfUnits: "", wattage: "", dailyUsage: "" });
      setShowOtherInput(false);
    }
  };

  const removeDevice = (id: string) => {
    setDevices(devices.filter((device) => device.id !== id));
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532]">
          {title}
        </h2>
        <button
          onClick={addElectronicDevice}
          className="hidden lg:block underline font-semibold text-[#123532] cursor-pointer whitespace-nowrap"
        >
          + Add Device
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <select
          name="deviceType"
          value={showOtherInput ? "Other" : newDevice.deviceType}
          onChange={handleDeviceChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
        >
          {DEVICE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
        {showOtherInput && (
            <input
                type="text"
                name="deviceType"
                placeholder="Enter Device Name"
                value={newDevice.deviceType}
                onChange={handleDeviceChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
            />
        )}
        <input
          type="number" name="noOfUnits" placeholder="No. of Units"
          value={newDevice.noOfUnits} onChange={handleDeviceChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
        />
        <input
          type="number" name="wattage" placeholder="Wattage"
          value={newDevice.wattage} onChange={handleDeviceChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
        />
        <input
          type="number" name="dailyUsage" placeholder="Daily Usage (hrs)"
          value={newDevice.dailyUsage} onChange={handleDeviceChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
        />
        <button
          onClick={addElectronicDevice}
          className="block lg:hidden underline font-semibold text-[#123532] cursor-pointer whitespace-nowrap"
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
                <Image src={deviceIcon} alt="device icon" />
                {device.deviceType} × {device.noOfUnits}
              </span>
              <div className="text-sm text-gray-600 pl-8">
                {device.wattage} Watts | {device.dailyUsage}h Daily Usage
              </div>
            </div>
            <button onClick={() => removeDevice(device.id)} className="cursor-pointer">
              <Image src={deleteIcon} alt="Delete" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}