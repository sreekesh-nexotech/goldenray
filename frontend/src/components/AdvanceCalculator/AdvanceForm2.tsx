import {  useRef } from "react";
import Button from "../ui/Button";
import { UsageDetailsFormData, Electric_vehicle, Electronic_device } from "@/types/types";
import DeviceManager from "./AdvanceDeviceManager";
import AdvanceVehicleManager from "./AdvanceVehicleManager";

interface UsageDetailsStepProps {
  formData: UsageDetailsFormData;
  setFormData: React.Dispatch<React.SetStateAction<UsageDetailsFormData>>;
  onCalculate: () => void;
  loading: boolean;
  grid_type: "On Grid" | "Hybrid" | null;
}

export default function UsageDetailsStep({
  formData,
  setFormData,
  onCalculate,
  loading,
  grid_type,
}: UsageDetailsStepProps) {
  const vehicleManagerValidator = useRef<(() => boolean) | null>(null);
  const deviceManagerValidator = useRef<(() => boolean) | null>(null);

  const setelectronic_devices: React.Dispatch<React.SetStateAction<Electronic_device[]>> = (
    updater
  ) => {
    setFormData((prev) => ({
      ...prev,
      electronic_devices: typeof updater === "function" ? updater(prev.electronic_devices) : updater,
    }));
  };

  const setelectric_vehicles: React.Dispatch<React.SetStateAction<Electric_vehicle[]>> = (
    updater
  ) => {
    setFormData((prev) => ({
      ...prev,
      electric_vehicles: typeof updater === "function" ? updater(prev.electric_vehicles) : updater,
    }));
  };

  const handleCalculate = () => {
    let isValid = true;

    // Validate DeviceManager inputs
    if (deviceManagerValidator.current && !deviceManagerValidator.current()) {
      isValid = false;
    }

    // Validate VehicleManager inputs
    if (vehicleManagerValidator.current && !vehicleManagerValidator.current()) {
      isValid = false;
    }

    if (isValid) {
      onCalculate();
    }
  };

  return (
    <div className="space-y-12 p-0 md:p-6">
 
      <DeviceManager
        devices={formData.electronic_devices}
        setDevices={setelectronic_devices}
        title="Tell us what electronics you want to include?"
        validateInputs={(validator) => (deviceManagerValidator.current = validator)}
      />
      <AdvanceVehicleManager
        electric_vehicles={formData.electric_vehicles}
        setelectric_vehicles={setelectric_vehicles}
        validateInputs={(validator) => (vehicleManagerValidator.current = validator)}
      />
      <div className="flex justify-end mt-8">
        <Button onClick={handleCalculate} disabled={loading}>
          {loading ? "Processing..." : grid_type === "Hybrid" ? "Next" : "Calculate"}
        </Button>
      </div>
    </div>
  );
}