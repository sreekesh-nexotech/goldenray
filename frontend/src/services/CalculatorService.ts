import { apiCall } from './apiService';
import { mockBasicCalculatorData} from '@/data/mock-calculator';
import { USE_MOCK_DATA } from '@/config';
import { BasicCalculatorData, AdvancedCalculatorData, SolarBasicPayload, SolarCalculatorApiResponse, SolarAdvancedPayload, AdvancedCalculatorTransformedData } from '@/types/types';

// Endpoints
const SOLAR_CALCULATOR_ENDPOINT = 'calculate-solar-new/';
const ADVANCED_SOLAR_CALCULATOR_ENDPOINT = 'calculate-solar-advanced/';

// Basic calculator API call
export async function getSolarAdvantageData(
  payload: SolarBasicPayload
): Promise<BasicCalculatorData> {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for getSolarAdvantageData");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBasicCalculatorData);
      }, 1000);
    });
  }

  try {
    console.log("Sending POST request to:", SOLAR_CALCULATOR_ENDPOINT, "with payload:", payload);
    const response = await apiCall<SolarCalculatorApiResponse>(SOLAR_CALCULATOR_ENDPOINT, "POST", payload);

    if (!response) {
      throw new Error("No response received from the backend.");
    }

    // Validate required fields
    if (typeof response.total_cost !== 'number' || typeof response.subsidy !== 'number') {
      console.error("Invalid response:", response);
      throw new Error(`Invalid or missing financial data in response for bill ${payload.monthly_bill || 'unknown'}`);
    }

    // Transform the API response
    const transformedData: BasicCalculatorData = {
      specifications: {
        power_requirement: `${response.solar_capacity_kW} kW`,
        area_requirement: `${response.area_required} sq.ft`,
        installation_time: `${response.installation_time_days} days`,
      },
      financialDetails: {
        lifetime_savings: `₹${response.savings.toLocaleString('en-IN')}`, 
        overall_cost: `₹${response.total_cost.toLocaleString('en-IN')}`,
        government_subsidy: `₹${response.subsidy.toLocaleString('en-IN')}`,
        final_cost: `₹${(response.total_cost - response.subsidy).toLocaleString('en-IN')}`,
        monthlyEBReduction: "₹1,416", 
        starting_EMI: "₹1,450", 
      },
      graph_data: {
        labels: ["Year 0", "Year 5", "Year 10", "Year 15", "Year 20", "Year 25"],
        datasets: [
          { data: response.datasets[0].data},
          {data: response.datasets[1].data }
        ],
      },
    };

    console.log("Transformed API response:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Error in getSolarAdvantageData:", error, "Payload:", payload);
    throw error;
  }
}

// Advanced calculator API call
export async function getSolarAdvancedData(
  payload: SolarAdvancedPayload
): Promise<AdvancedCalculatorTransformedData> {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for getSolarAdvancedData");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          power_capacity: 12,
          time_to_complete: "3-18",
          total_cost: 720000,
          total_subsidy: 78000,
          area_required: 960,
          final_cost: 642000,
          battery_capacity: 9.6,
          actual_backup_time: 20,
          overall_setup_cost: 776800,
          graph_without_solar: [0, 252957, 575802, 987842, 1513722, 2184893],
          graph_with_solar: [698800, 801187, 904234, 908122, 913084, 919418],
          savings: 1265475
        });
      }, 1000);
    });
  }

  try {
    console.log("Sending POST request to:", ADVANCED_SOLAR_CALCULATOR_ENDPOINT, "with payload:", payload);
    const response = await apiCall<AdvancedCalculatorData>(ADVANCED_SOLAR_CALCULATOR_ENDPOINT, "POST", payload);

    if (!response) {
      throw new Error("No response received from the backend.");
    }

    // Validate required fields
    if (!response.specifications || !response.financialDetails || !response.backupDetails || !response.graph_data) {
      console.error("Invalid response:", response);
      throw new Error("Invalid or missing data in advanced calculator response");
    }

    // Transform the API response
    const transformedData = {
      power_capacity: parseFloat(response.specifications.power_requirement) || 0,
      time_to_complete: response.specifications.installation_time.replace(' days', '') || '0',
      total_cost: parseFloat(response.financialDetails.overall_cost.replace('₹', '').replace(/,/g, '')) || 0,
      total_subsidy: parseFloat(response.financialDetails.government_subsidy.replace('₹', '').replace(/,/g, '')) || 0,
      area_required: parseFloat(response.specifications.area_requirement) || 0,
      final_cost: parseFloat(response.financialDetails.final_cost.replace('₹', '').replace(/,/g, '')) || 0,
      battery_capacity: parseFloat(response.backupDetails.battery_requirement) || 0,
      actual_backup_time: parseFloat(response.backupDetails.autonomy_rate) || 0,
      overall_setup_cost: parseFloat(response.financialDetails.overall_cost.replace('₹', '').replace(/,/g, '')) || 0,
      graph_without_solar: response.graph_data.datasets[0]?.data || [],
      graph_with_solar: response.graph_data.datasets[1]?.data || [],
      savings: response.lifetime_bill_comparison?.with_solar_amount_saved || 0
    };

    console.log("Transformed API response:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Error in getSolarAdvancedData:", error, "Payload:", payload);
    throw error;
  }
}