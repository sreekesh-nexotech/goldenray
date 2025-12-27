#!/bin/bash

echo "Testing Backend API for EMI details..."
echo "======================================="
echo ""

response=$(curl -s -X POST http://127.0.0.1:8000/api/calculate-solar-new/ \
  -H "Content-Type: application/json" \
  -d '{"monthly_bill": 8000, "pincode": "682304", "property_type": "Commercial"}')

echo "Full Response:"
echo "$response" | python3 -m json.tool

echo ""
echo "======================================="
echo "EMI Details:"
echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(json.dumps(data.get('emi_details', 'NOT FOUND'), indent=2))"
