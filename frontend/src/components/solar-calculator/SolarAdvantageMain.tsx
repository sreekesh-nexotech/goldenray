"use client";
import { mockBackendData, BackendData } from '@/data/mock-calculator'; // Import mock data
import SolarBasicResult from './SolarBasicResult';
import SolarAdvantage from './solar-advantage';
import { useState } from 'react';


export default function SolarAdvantageMain(){

                const [showResults, setShowResults] = useState(false);
            const [calculatorData, setCalculatorData] = useState<BackendData | null>(null);
            const [formInputs, setFormInputs] = useState({
                pincode: "",
                propertyType: "",
                electricityBill: "",
            });

            // This function simulates fetching data based on form inputs
            const fetchSolarData = async (
                pincode: string,
                propertyType: string,
                electricityBill: string
            ): Promise<BackendData> => {
                // In a real application, you would make an API call here.
                // For now, we'll just return the mock data.
                console.log("Fetching data for:", { pincode, propertyType, electricityBill });
                return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(mockBackendData); // Always return mock data for now
                }, 500); // Simulate network delay
                });
            };

            const handleCalculateSubmit = async (
                pincode: string,
                propertyType: string,
                electricityBill: string
            ) => {
                setFormInputs({ pincode, propertyType, electricityBill });
                const data = await fetchSolarData(pincode, propertyType, electricityBill);
                setCalculatorData(data);
                setShowResults(true); // Show the results component
            };

            const handleResubmitChanges = async (
                pincode: string,
                propertyType: string,
                electricityBill: string
            ) => {
                setFormInputs({ pincode, propertyType, electricityBill });
                const data = await fetchSolarData(pincode, propertyType, electricityBill);
                setCalculatorData(data); // Update only the data, stay on the results page
            };

            const handleGoBackToForm = () => {
                setShowResults(false); // Go back to the input form
            };
    return(
        <section className="relative">


            {showResults && calculatorData ? (
                <SolarBasicResult
                initialPincode={formInputs.pincode}
                initialPropertyType={formInputs.propertyType}
                initialElectricityBill={formInputs.electricityBill}
                calculatedData={calculatorData}
                onResubmit={handleResubmitChanges}
                onGoBack={handleGoBackToForm}
                />
            ) : (
                <SolarAdvantage
                onSubmit={handleCalculateSubmit}
                // Optionally pass initial values if we want them to be there when going back
                initialPincode={formInputs.pincode}
                initialPropertyType={formInputs.propertyType}
                initialElectricityBill={formInputs.electricityBill}
                />
            )}

        </section>
    )
}