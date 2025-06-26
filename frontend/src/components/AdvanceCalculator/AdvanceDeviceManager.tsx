/* golden-ray/frontend/src/components/AdvanceCalculator/AdvanceDeviceManager.tsx */
// src/components/AdvanceCalculator/AdvanceDeviceManager.tsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { Electronic_device, DeviceType } from "@/types/types";
import deviceIcon from "../../../public/icons/common-device.svg"; // This will be a fallback if API doesn't provide
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
    url: "", // Changed back to 'url'
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiDeviceTypes, setApiDeviceTypes] = useState<DeviceType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for custom searchable dropdown
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Refs for click outside detection and dropdown positioning
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch device types
  const fetchDevices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedTypes = await getDeviceTypes();
      setApiDeviceTypes(fetchedTypes);
      console.log("Fetched device types from API:", fetchedTypes);//debugging

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

  // Filter device types for UI
  const usableDeviceTypes = useMemo(() => {
    return apiDeviceTypes ? apiDeviceTypes.filter((device) => device.show_in_ui) : [];
  }, [apiDeviceTypes]);

  // Filtered devices based on search term for the custom dropdown
  const filteredDevices = useMemo(() => {
    if (!searchTerm) {
      return usableDeviceTypes;
    }
    return usableDeviceTypes.filter((device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usableDeviceTypes, searchTerm]);

  // Validate input fields
  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate device type: must be selected from the list and not just typed
    if (!newDevice.device_type || newDevice.device_type === "" || !usableDeviceTypes.some(d => d.name === newDevice.device_type)) {
      newErrors.device_type = "Please select a valid device type";
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
    if (!newDevice.daily_usage || isNaN(daily_usage) || daily_usage < 0 || daily_usage > 24) {
      newErrors.daily_usage = "Enter a valid Usage Hours per day (0-24)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes (for units, wattage, daily usage)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDevice((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear specific error on change
  };

  // Handle search input change (for device type)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setNewDevice((prev) => ({ ...prev, device_type: value, url: '' })); // Clear url when typing new device type
    setIsDropdownOpen(true); // Open dropdown when typing
    setErrors((prev) => ({ ...prev, device_type: "" })); // Clear device_type error on typing
  };

  // Handle selection from custom dropdown
  const handleSelectDevice = (deviceName: string) => {
    const selectedDevice = usableDeviceTypes.find((device) => device.name === deviceName);
    setNewDevice((prev) => ({
      ...prev,
      device_type: deviceName,
      url: selectedDevice?.url || deviceIcon.src, // Use selected device's icon_url or a common fallback, assign to 'url'
    }));
    setSearchTerm(deviceName); // Set search term to selected name
    setIsDropdownOpen(false); // Close dropdown
    setErrors((prev) => ({ ...prev, device_type: "" })); // Clear device_type error on selection
    console.log("Selected device icon_url:", selectedDevice?.url);

  };

  // Add a new device
  const addElectronic_device = () => {
    if (validateInputs()) {
      // Find the selected device from the usableDeviceTypes to get its icon_url
      const selectedDevice = usableDeviceTypes.find(d => d.name === newDevice.device_type);
      const urlToUse = selectedDevice?.url || deviceIcon.src; // Fallback to common icon if not found, assign to 'url'

      const device: Electronic_device = {
        id: uuidv4(),
        device_type: newDevice.device_type,
        no_of_units: parseFloat(newDevice.no_of_units),
        wattage: parseFloat(newDevice.wattage),
        daily_usage: parseFloat(newDevice.daily_usage),
        url: urlToUse, // Use the determined icon URL
      };
      setDevices([...devices, device]);
      setNewDevice({ device_type: "", no_of_units: "", wattage: "", daily_usage: "", url: "" }); // Reset url
      setSearchTerm(""); // Clear search term after adding
      setErrors({});
       console.log('Device URL:', device.url);

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
        <div className="relative" ref={inputWrapperRef}>
          {/* Custom Searchable Dropdown Input */}
          <input
            type="text"
            placeholder="Search & Select Device Type"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsDropdownOpen(true)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            aria-label="Search and select device type"
          />
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-[8rem] overflow-y-auto shadow-lg"
            >
              {filteredDevices.length > 0 ? (
                filteredDevices.map((device) => (
                  <div
                    key={device.name}
                    onMouseDown={() => handleSelectDevice(device.name)}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {device.name}
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500">No devices found. Try searching.</div>
              )}
            </div>
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
            onChange={handleInputChange}
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
            placeholder="Wattage (Watts)"
            value={newDevice.wattage}
            onChange={handleInputChange}
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
            placeholder="Daily Usage (Hours)"
            value={newDevice.daily_usage}
            onChange={handleInputChange}
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
                {/* Use device.url for the Image src */}
                <Image
                  src={device.url} // Changed to device.url
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