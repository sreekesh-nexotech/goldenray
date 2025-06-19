"use client";
import React from "react";
import Button from "../ui/Button";
import { BasicInfoFormData, ElectronicDevice } from "@/types/calculator";
import DeviceManager from "./AdvanceDeviceManager"; 

interface NewHomeDetailsStepProps {
  formData: BasicInfoFormData;
  setFormData: React.Dispatch<React.SetStateAction<BasicInfoFormData>>;
  onNext: () => void;
}

export default function NewHomeDetailsStep({
  formData,
  setFormData,
  onNext,
}: NewHomeDetailsStepProps) {

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  // Wrapper function to update devices within the basicInfo state
  const setBackupDevices: React.Dispatch<React.SetStateAction<ElectronicDevice[]>> = (
    updater
  ) => {
    setFormData((prev) => ({
      ...prev,
      electronicDevices: typeof updater === "function" ? updater(prev.electronicDevices) : updater,
    }));
  };
  const backupHours = formData.backupHours;

  return (
    <div className="space-y-8 p-4 md:p-6">


      {/* Backup Power Hours Slider */}
      <div>
        <label className="text-xl md:text-2xl font-semibold text-[#123532] mb-6">
          How many hours of backup power do you need?
        </label>
        <input
          type="range"
          name="backupHours"
          min="3"
          max="24"
          step="1"
          value={backupHours}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #F7BA41 0%, #F7BA41 ${((backupHours - 3) / 21) * 100}%, #E5E7EB ${((backupHours - 3) / 21) * 100}%, #E5E7EB 100%)`,
          }}
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2 px-1">
          <span>3h</span>
          <span className="font-bold text-black">{backupHours} hrs</span>
          <span>24h</span>
        </div>
      </div>
      
      {/* Electronic Devices Section for Backup */}
      <DeviceManager
        devices={formData.electronicDevices}
        setDevices={setBackupDevices}
        title="What devices need backup power?"
      />

      <div className="flex justify-end mt-8">
        <Button onClick={onNext}>Calculate</Button>
      </div>
    </div>
  );
}