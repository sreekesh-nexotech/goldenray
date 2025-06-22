/* golden-ray/frontend/src/components/AdvanceCalculator/AdvanceForm2.tsx */

import Button from "../ui/Button";
import { UsageDetailsFormData, Electric_vehicle, Electronic_device } from "@/types/types";
import DeviceManager from "./AdvanceDeviceManager"; // Import the reusable component

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
  



  /**
   * This is a wrapper function passed to the DeviceManager component.
   * It allows the child component to update the `electronic_devices` array,
   * which is part of the parent's `usageDetails` state object.
   */
  const setelectronic_devices: React.Dispatch<React.SetStateAction<Electronic_device[]>> = (
    updater
  ) => {
    setFormData((prev) => ({
      ...prev,
      electronic_devices: typeof updater === "function" ? updater(prev.electronic_devices) : updater,
    }));
  };


  // Wrapper function for updating electric_vehicles in formData
  const setelectric_vehicles: React.Dispatch<React.SetStateAction<Electric_vehicle[]>> = (
    updater
  ) => {
    setFormData((prev) => ({
      ...prev,
      electric_vehicles: typeof updater === "function" ? updater(prev.electric_vehicles) : updater,
    }));
  };

  

  return (
    <div className="space-y-12 p-0 md:p-6">
      {/* --- Electronic Devices Section (Using Reusable Component) --- */}
      <DeviceManager
        devices={formData.electronic_devices}
        setDevices={setelectronic_devices}
        title="Tell us what electronics you want to include?"
      />

      {/* --- Electric Vehicles Section --- */}
      <AdvanceVehicleManager
        electric_vehicles={formData.electric_vehicles}
        setelectric_vehicles={setelectric_vehicles}
      />

      {/* --- Navigation Button --- */}
      <div className="flex justify-end mt-8">
        <Button onClick={onCalculate} disabled={loading}>
          {loading ? "Processing..." : grid_type === "Hybrid" ? "Next" : "Calculate"}
        </Button>
      </div>
    </div>
  );
}