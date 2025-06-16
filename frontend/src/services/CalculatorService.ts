// src/services/solarService.ts (or basicCalcService.ts)

import { mockBackendData, BackendData } from "@/data/mock-calculator";
// import { apiCall, ApiResponse } from "./apiService";


// const SOLAR_CALCULATOR_ENDPOINT = "solar-calculator/"; 


export async function getSolarAdvantageData(
  pincode: string,
  propertyType: string,
  electricityBill: string
): Promise<BackendData> {
  // const queryParams = new URLSearchParams({
  //   pincode,
  //   propertyType,
  //   electricityBill,
  // }).toString();

  // const url = `${SOLAR_CALCULATOR_ENDPOINT}?${queryParams}`;

  // return apiCall<BackendData>(url, "GET");
  return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate an error condition (e.g., invalid pincode)
          if (pincode === "000000") {
            reject("Invalid Pincode. Please try again.");
          }else if(propertyType == null){
            reject("Select a property type");
          }else if(electricityBill == '0'){
            reject("Set valid Electricity Bill");
          }
          else {
            resolve(mockBackendData); // Always return mock data for now
          }
        }, 1000); // Simulate network delay
      });
    };
