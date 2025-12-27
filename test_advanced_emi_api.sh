#!/bin/bash

echo "Testing Advanced Calculator API for EMI details..."
echo "=================================================="
echo ""

response=$(curl -s -X POST http://127.0.0.1:8000/api/calculate-solar-advanced/ \
  -H "Content-Type: application/json" \
  -d '{
    "Specifications": {
      "home_type": "Existing Home",
      "grid_type": "On Grid",
      "average_bill": "8000",
      "bill_frequency": "Bi-Monthly",
      "home_size": "1500",
      "estimated_base_load": ""
    },
    "usageDetails": {
      "usage_electronic_devices": [],
      "electric_vehicles": []
    },
    "preferenceDetails": {
      "backup_hours": 0,
      "preference_electronic_devices": []
    }
  }')

echo "Full Response:"
echo "$response" | python3 -m json.tool

echo ""
echo "=================================================="
echo "EMI Details:"
echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(json.dumps(data.get('emi_details', 'NOT FOUND'), indent=2))"

echo ""
echo "Financial Summary:"
echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f\"Final Cost: ₹{data.get('final_cost', 'N/A'):,}\"); print(f\"Interest Rate: {data.get('interest_rate', 'N/A')}%\")"
