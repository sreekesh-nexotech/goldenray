#!/bin/bash

echo "Testing Advanced Calculator (Hybrid) API for EMI details..."
echo "==========================================================="
echo ""

response=$(curl -s -X POST http://127.0.0.1:8000/api/calculate-solar-advanced/ \
  -H "Content-Type: application/json" \
  -d '{
    "Specifications": {
      "home_type": "Existing Home",
      "grid_type": "Hybrid",
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
      "backup_hours": 3,
      "preference_electronic_devices": [
        {"device_type": "Fan", "no_of_units": 2, "daily_usage": 3}
      ]
    }
  }')

echo "Financial Summary:"
echo "$response" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f\"Overall Setup Cost: ₹{data.get('overall_setup_cost', 'N/A'):,.2f}\")
print(f\"Final Cost: ₹{data.get('final_cost', 'N/A'):,.2f}\")
print(f\"Interest Rate: {data.get('interest_rate', 'N/A')}%\")
print(f\"Battery Capacity: {data.get('battery_capacity', 'N/A')} kWh\")
print(f\"Battery Price: ₹{data.get('battery_price', 'N/A'):,.2f}\")
print(f\"Total Battery Cost: ₹{data.get('total_battery_cost', 'N/A'):,.2f}\")
"

echo ""
echo "EMI Details:"
echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); emi=data.get('emi_details', {}); print(f\"EMI per month: ₹{emi.get('emi_per_month', 0):,.2f}\"); print(f\"Total payment: ₹{emi.get('total_payment', 0):,.2f}\")"
