import { apiCall } from './apiService';

export interface EMICalculatorPayload {
  installation_id?: number;
  power_capacity?: number;
  property_type?: string;
  tenure_years?: number;
  interest_rate?: number;
  apply_subsidy?: boolean;
  principal?: number;
}

export interface EMICalculatorResponse {
  installation_id?: number;
  power_capacity_kW: number;
  property_type: string;
  total_cost: number;
  total_subsidy: number;
  final_cost: number;
  apply_subsidy: boolean;
  principal: number;
  principal_source: string;
  interest_rate: number;
  tenure_years: number;
  tenure_months: number;
  emi_per_month: number;
  total_payment: number;
  total_interest: number;
}

const EMI_CALCULATOR_ENDPOINT = 'emi-calculator/';

export async function calculateEMI(
  payload: EMICalculatorPayload
): Promise<EMICalculatorResponse> {
  try {
    const response = await apiCall<EMICalculatorResponse>(
      EMI_CALCULATOR_ENDPOINT,
      'POST',
      payload
    );

    if (!response) {
      throw new Error('No response received from the EMI calculator API');
    }

    // Validate required fields in response
    if (
      typeof response.emi_per_month !== 'number' ||
      typeof response.principal !== 'number'
    ) {
      console.error('Invalid response:', response);
      throw new Error('Invalid or missing financial data in EMI calculator response');
    }

    return response;
  } catch (error) {
    console.error('Error in calculateEMI:', error, 'Payload:', payload);
    throw error;
  }
}
