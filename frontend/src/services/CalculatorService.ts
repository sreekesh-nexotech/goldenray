import { apiCall } from './apiService';
import { mockAdvancedCalculatorData, mockBasicCalculatorData, } from '@/data/mock-calculator';
import { USE_MOCK_DATA } from '@/config';
import { BasicCalculatorData, AdvancedCalculatorData, SolarBasicPayload, SolarCalculatorApiResponse, SolarAdvancedPayload, AdvancedCalculatorApiResponse } from '@/types/types';

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
): Promise<AdvancedCalculatorData> {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for getSolarAdvancedData");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAdvancedCalculatorData);
      }, 1000);
    });
  }

  try {
    
    console.log("Sending POST request to:", ADVANCED_SOLAR_CALCULATOR_ENDPOINT, "with payload:", payload);
    const response = await apiCall<AdvancedCalculatorApiResponse>(ADVANCED_SOLAR_CALCULATOR_ENDPOINT, "POST", payload);
    console.log("Raw API response:", response);

    if (!response) {
      throw new Error("No response received from the backend.");
    }


    // Calculate sums
    const graph_without_solar_sum = response.graph_without_solar.reduce((sum, val) => sum + val, 0);
    const graph_with_solar_sum = response.graph_with_solar.reduce((sum, val) => sum + val, 0);

    // Transform the API response
    const advancedTransformedData : AdvancedCalculatorData = {
      specifications: {
        power_requirement: `${response.power_capacity} kW`,
        area_requirement: `${response.area_required} sq.ft`,
        installation_time: `${response.time_to_complete} Days`,
      },
      financialDetails: {
        lifetime_savings: `₹${response.savings}`,
        overall_cost: `₹${response.overall_setup_cost}`,
        government_subsidy: `₹${response.total_subsidy}`,
        final_cost: `₹${response.final_cost}`,
        starting_EMI: "₹1,450",
      },
      backupDetails: {
        battery_requirement: `${response.battery_capacity} KWh`,
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
        without_solar_amount: graph_without_solar_sum, 
        with_solar_amount_payable: graph_with_solar_sum, 
        with_solar_amount_saved: graph_without_solar_sum - graph_with_solar_sum, 
      },
    };
    console.log("Transformed API response:", advancedTransformedData);
    return advancedTransformedData;
  } catch (error) {
    console.error("Error in getSolarAdvancedData:", error, "Payload:", payload);
    throw error;
  }
}