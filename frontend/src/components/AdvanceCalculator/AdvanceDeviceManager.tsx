import React, { useState, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { Electronic_device, DeviceType } from "@/types/types";
import deviceIcon from "../../../public/icons/common-device.svg";
import deleteIcon from "../../../public/deleteIcon.svg";
import { getDeviceTypes } from "@/services/deviceService";

interface DeviceManagerProps {
  devices: Electronic_device[];
  setDevices: React.Dispatch<React.SetStateAction<Electronic_device[]>>;
  title: string;
  validateInputs?: (validator: () => boolean) => void;
}

export default function DeviceManager({
  devices,
  setDevices,
  title,
  validateInputs,
}: DeviceManagerProps) {
  const [newDevice, setNewDevice] = useState({
    device_type: "",
    no_of_units: "",
    daily_usage: "",
    url: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiDeviceTypes, setApiDeviceTypes] = useState<DeviceType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // NEW: highlight state for keyboard navigation
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchDevices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTypes = await getDeviceTypes();
      setApiDeviceTypes(fetchedTypes);
    } catch (err: unknown) {
      let errorMessage = "Failed to load device types.";
      if (err instanceof Error) errorMessage = err.message;
      else if (typeof err === "string") errorMessage = err;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const usableDeviceTypes = useMemo(() => {
    return apiDeviceTypes
      ? apiDeviceTypes.filter((device) => device.show_in_ui).sort((a, b) => a.name.localeCompare(b.name))
      : [];
  }, [apiDeviceTypes]);

  const filteredDevices = useMemo(() => {
    if (!searchTerm) return usableDeviceTypes;
    return usableDeviceTypes.filter((device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usableDeviceTypes, searchTerm]);

  const validateDeviceInputsForAdd = () => {
    const newErrors: { [key: string]: string } = {};
    if (
      !newDevice.device_type ||
      !usableDeviceTypes.some((d) => d.name === newDevice.device_type)
    ) {
      newErrors.device_type = "Please select a valid device type";
    }
    const units = parseFloat(newDevice.no_of_units);
    if (!newDevice.no_of_units || isNaN(units) || units <= 0) {
      newErrors.no_of_units = "Number of units must be a positive number";
    }
    const daily_usage = parseFloat(newDevice.daily_usage);
    if (!newDevice.daily_usage || isNaN(daily_usage) || daily_usage < 0 || daily_usage > 24) {
      newErrors.daily_usage = "Enter a valid Usage Hours per day (0-24)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDeviceInputs = () => {
    if (newDevice.device_type || newDevice.no_of_units || newDevice.daily_usage) {
      setErrors((prev) => ({
        ...prev,
        form: "Please click 'Add Device' to save your input.",
      }));
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (validateInputs) {
      validateInputs(validateDeviceInputs);
    }
  }, [newDevice, validateInputs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDevice((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setNewDevice((prev) => ({ ...prev, device_type: value, url: "" }));
    setIsDropdownOpen(true);
    setHighlightedIndex(0); // highlight first by default
    setErrors((prev) => ({ ...prev, device_type: "", form: "" }));
  };

  const handleSelectDevice = (deviceName: string) => {
    const selectedDevice = usableDeviceTypes.find((device) => device.name === deviceName);
    setNewDevice((prev) => ({
      ...prev,
      device_type: deviceName,
      url: selectedDevice?.url || deviceIcon.src,
    }));
    setSearchTerm(deviceName);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    setErrors((prev) => ({ ...prev, device_type: "", form: "" }));
  };

  const scrollToHighlighted = (index: number) => {
    if (dropdownRef.current) {
      const optionEl = dropdownRef.current.children[index] as HTMLElement;
      if (optionEl) {
        optionEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsDropdownOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const newIndex = prev < filteredDevices.length - 1 ? prev + 1 : 0;
        scrollToHighlighted(newIndex);
        return newIndex;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const newIndex = prev > 0 ? prev - 1 : filteredDevices.length - 1;
        scrollToHighlighted(newIndex);
        return newIndex;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isDropdownOpen && highlightedIndex >= 0 && highlightedIndex < filteredDevices.length) {
        handleSelectDevice(filteredDevices[highlightedIndex].name);
      } else {
        addElectronic_device();
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleAnyFieldKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addElectronic_device();
    }
  };

  const addElectronic_device = () => {
    if (validateDeviceInputsForAdd()) {
      const selectedDevice = usableDeviceTypes.find(
        (d) => d.name === newDevice.device_type
      );
      const urlToUse = selectedDevice?.url || deviceIcon.src;
      const device: Electronic_device = {
        id: uuidv4(),
        device_type: newDevice.device_type,
        no_of_units: parseFloat(newDevice.no_of_units),
        daily_usage: parseFloat(newDevice.daily_usage),
        url: urlToUse,
      };
      setDevices([...devices, device]);
      setNewDevice({ device_type: "", no_of_units: "", daily_usage: "", url: "" });
      setSearchTerm("");
      setErrors({});
    }
  };

  const removeDevice = (id: string) => {
    setDevices(devices.filter((device) => device.id !== id));
  };

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl md:text-2xl font-semibold text-[#123532]">{title}</h2>
        <p className="mt-4 text-gray-700">Loading device types...</p>
      </div>
    );
  }

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
          className="hidden lg:block underline font-semibold text-[#123532] cursor-pointer"
          aria-label="Add a new electronic device"
        >
          + Add Device
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="relative" ref={inputWrapperRef}>
          <label className="block text-sm font-medium text-[#123532] mb-1">
            Device Type
          </label>
          <input
            id="device_type"
            type="text"
            placeholder="Search & Select Device Type"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => {
              setIsDropdownOpen(true);
              setHighlightedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            aria-label="Search and select device type"
          />
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-[8rem] overflow-y-auto shadow-lg"
            >
              {filteredDevices.length > 0 ? (
                filteredDevices.map((device, index) => (
                  <div
                    key={device.name}
                    onMouseDown={() => handleSelectDevice(device.name)}
                    className={`p-2 cursor-pointer ${
                      highlightedIndex === index ? "bg-gray-200" : "hover:bg-gray-100"
                    }`}
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
          <label className="block text-sm font-medium text-[#123532] mb-1">
            Number of Devices
          </label>
          <input
            id="no_of_units"
            type="number"
            name="no_of_units"
            placeholder="No. of Devices"
            value={newDevice.no_of_units}
            onChange={handleInputChange}
            onKeyDown={handleAnyFieldKeyDown}
            min="1"
            step="1"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            aria-label="Number of Devices"
          />
          {errors.no_of_units && (
            <p className="text-red-500 text-sm mt-1">{errors.no_of_units}</p>
          )}
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-[#123532] mb-1">
            Daily Usage (Hours)
          </label>
          <input
            id="daily_usage"
            type="number"
            name="daily_usage"
            placeholder="Daily Usage (Hours)"
            value={newDevice.daily_usage}
            onChange={handleInputChange}
            onKeyDown={handleAnyFieldKeyDown}
            min="0"
            step="0.1"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7BA41] w-full"
            aria-label="Daily usage in hours"
          />
          {errors.daily_usage && (
            <p className="text-red-500 text-sm mt-1">{errors.daily_usage}</p>
          )}
        </div>
        <button
          onClick={addElectronic_device}
          className="block lg:hidden underline font-semibold text-[#123532] cursor-pointer"
          aria-label="add electronic device"
        >
          + Add Device
        </button>
      </div>
      {errors.form && <p className="text-sm text-red-600 mt-2">{errors.form}</p>}
      <div className="mt-4 space-y-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className="flex justify-between items-center p-3 rounded-2xl border border-[#DBD8D8]"
          >
            <div>
              <span className="font-semibold flex gap-2 items-center">
                <Image src={device.url} alt="" width={24} height={24} />
                {device.device_type} × {device.no_of_units}
              </span>
              <div className="text-sm text-gray-600 pl-8">
                {device.daily_usage}h Daily Usage
              </div>
            </div>
            <button onClick={() => removeDevice(device.id)} className="cursor-pointer" aria-label="remove device">
              <Image src={deleteIcon} alt="" width={24} height={24} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
