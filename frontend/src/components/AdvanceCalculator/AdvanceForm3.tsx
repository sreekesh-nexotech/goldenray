"use client";
import { useRef } from "react";
import Button from "../ui/Button";
import { BasicInfoFormData, Electronic_device } from "@/types/types";
import DeviceManager from "./AdvanceDeviceManager";

interface NewHomeDetailsStepProps {
  formData: BasicInfoFormData;
  setFormData: React.Dispatch<React.SetStateAction<BasicInfoFormData>>;
  onNext: () => void;
  onBack: () => void;
}

export default function NewHomeDetailsStep({
  formData,
  setFormData,
  onNext,
  onBack,
}: NewHomeDetailsStepProps) {
  const deviceManagerValidator = useRef<(() => boolean) | null>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const setBackupDevices: React.Dispatch<
    React.SetStateAction<Electronic_device[]>
  > = (updater) => {
    setFormData((prev) => ({
      ...prev,
      electronic_devices:
        typeof updater === "function"
          ? updater(prev.electronic_devices)
          : updater,
    }));
  };

  const handleCalculate = () => {
    let isValid = true;

    // Validate DeviceManager inputs
    if (deviceManagerValidator.current && !deviceManagerValidator.current()) {
      isValid = false;
    }

    if (isValid) {
      onNext();
    }
  };

  const backup_hours = formData.backup_hours;
  const sliderPercentage = (backup_hours / 24) * 100;

  return (
    <div className="space-y-8 p-0 md:p-6">
      <div>
        <label className="text-xl md:text-2xl font-semibold text-[#123532] mb-6">
          How many hours of backup power do you need?
        </label>
        <input
          type="range"
          name="backup_hours"
          min="0"
          max="24"
          step="1"
          value={backup_hours}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #F7BA41 0%, #F7BA41  ${sliderPercentage}%, #E5E7EB  ${sliderPercentage}%, #E5E7EB 100%)`,
          }}
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2 px-1">
          <span>0h</span>
          <span className="font-bold text-black">{backup_hours} hrs</span>
          <span>24h</span>
        </div>
      </div>
      <DeviceManager
        devices={formData.electronic_devices}
        setDevices={setBackupDevices}
        title="What devices need backup power?"
        validateInputs={(validator) =>
          (deviceManagerValidator.current = validator)
        }
      />
      <div className="flex justify-between mt-8">
        <Button
          onClick={onBack}
          className="bg-white border-2 border-[#F7BA41] text-[#F7BA41] hover:bg-[#FFFBEB]"
        >
          Back
        </Button>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
    </div>
  );
}
