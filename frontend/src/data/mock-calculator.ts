import { BasicCalculatorData, AdvancedCalculatorData, DeviceType, VehicleType } from "@/types/types";

// Mock data for Basic Calculator
export const mockBasicCalculatorData: BasicCalculatorData = {
  specifications: {
    power_requirement: "5 kW",
    area_requirement: "500 sq.ft",
    installation_time: "3-5 days",
  },
  financialDetails: {
    lifetime_savings: "₹15,00,000",
    overall_cost: "₹3,50,000",
    government_subsidy: "₹80,000",
    final_cost: "₹2,70,000",
    monthlyEBReduction: "Reduce monthly EB from ₹6,000 to just ₹1,416",
    starting_EMI: "₹5,000",
  },

    graph_data: {
    labels: ["Year 1", "Year 5", "Year 10", "Year 15", "Year 20"],
    datasets: [
      {
        data: [50000, 60000, 75000, 90000, 110000],
      },
      {
        data: [15000, 18000, 22500, 27000, 33000],
      },
    ],
  },
};

// Mock data for Advanced Calculator
export const mockAdvancedCalculatorData: AdvancedCalculatorData = {
  specifications: {
    power_requirement: "7 kW",
    area_requirement: "700 sq.ft",
    installation_time: "5-7 days",
  },
  financialDetails: {
    lifetime_savings: "₹20,00,000",
    overall_cost: "₹5,00,000",
    government_subsidy: "₹1,00,000",
    final_cost: "₹4,00,000",
    starting_EMI: "₹7,500",
  },
  backupDetails: {
    battery_requirement: "10 kWh",
    autonomy_rate: "85%",
  },
  graph_data: {
    labels: ["Year 1", "Year 5", "Year 10", "Year 15", "Year 20", "Year 25"],
    datasets: [
      {
        data: [60000, 72000, 90000, 108000, 132000, 160000],
      },
      {
        data: [60000, 14400, 18000, 21600, 26400, 32000],
      },
    ],
  },
  lifetime_bill_comparison: {
    without_solar_amount: 2250000, // ₹22,50,000
    with_solar_amount_payable: 600000, // ₹6,00,000
    with_solar_amount_saved: 1650000, // ₹16,50,000
  },
};


export const mockDeviceTypes: DeviceType[] = [
  { name: 'Air Conditioner', show_in_ui: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { name: 'Refrigerator', show_in_ui: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { name: 'Washing Machine', show_in_ui: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { name: 'Microwave', show_in_ui: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { name: 'Television', show_in_ui: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { name: 'Computer', show_in_ui: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { name: 'Ceiling Fan', show_in_ui: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { name: 'LED Light', show_in_ui: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { name: 'Water Pump', show_in_ui: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-mq:00:00Z' },
  { name: 'EV Car', show_in_ui: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { name: 'EV Scooter', show_in_ui: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
];

export const mockVehicleTypes: VehicleType[] = [
  { name: "Tata Nexon EV", category: "Car", show_in_ui: true, created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
  { name: "Ola S1 Pro", category: "Scooter", show_in_ui: true, created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
];