import requests
import json

# Test Basic Calculator API
print("Testing Basic Calculator API...")
url = "http://127.0.0.1:8000/api/calculate-solar-new/"
payload = {
    "monthly_bill": 8000,
    "pincode": "682001",
    "property_type": "Residential"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("\n✓ API Response received successfully!")
        print(f"\nEMI Details:")
        if 'emi_details' in data:
            print(f"  ✓ emi_details found in response")
            print(f"  - emi_per_month: ₹{data['emi_details'].get('emi_per_month', 'N/A')}")
            print(f"  - total_payment: ₹{data['emi_details'].get('total_payment', 'N/A')}")
        else:
            print("  ✗ emi_details NOT found in response")
        
        print(f"\nOther Financial Details:")
        print(f"  - total_cost: ₹{data.get('total_cost', 'N/A')}")
        print(f"  - subsidy: ₹{data.get('subsidy', 'N/A')}")
        print(f"  - final_cost: ₹{data.get('final_cost', 'N/A')}")
        print(f"  - interest_rate: {data.get('interest_rate', 'N/A')}%")
        
        print("\n" + "="*50)
        print("Full Response:")
        print(json.dumps(data, indent=2))
    else:
        print(f"✗ Error: {response.text}")
except Exception as e:
    print(f"✗ Exception occurred: {e}")
