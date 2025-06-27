import { apiCall } from './apiService';
import { mockBasicCalculatorData, mockAdvancedCalculatorData } from '@/data/mock-calculator';
import { USE_MOCK_DATA } from '@/config';
import { BasicCalculatorData, AdvancedCalculatorData,  SolarBasicPayload, SolarCalculatorApiResponse } from '@/types/types';

// Endpoints
const SOLAR_CALCULATOR_ENDPOINT = 'calculate-solar-new/';
// const ADVANCED_SOLAR_CALCULATOR_ENDPOINT = 'calculate-solar/';

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
        starting_EMI: "₹2,000", 
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
  // payload: SolarAdvancedPayload
): Promise<AdvancedCalculatorData> {
  // if (USE_MOCK_DATA) {
    console.log("Using mock data for getSolarAdvancedData");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAdvancedCalculatorData);
      }, 1000);
    });
  }

//   try {
//     console.log("Making API call to:", ADVANCED_SOLAR_CALCULATOR_ENDPOINT, "with payload:", payload);
//     const response = await apiCall<AdvancedCalculatorData>(
//       ADVANCED_SOLAR_CALCULATOR_ENDPOINT,
//       "POST",
//       payload
//     );
//     if (response.error) {
//       throw new Error(response.error);
//     }
//     if (response.data === null) {
//       throw new Error("No data returned from the API");
//     }
//     console.log("API response received:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error in getSolarAdvancedData:", error);
//     throw error;
//   }
// }