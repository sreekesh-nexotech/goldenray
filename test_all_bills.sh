#!/bin/bash

echo "Testing Basic Calculator - Residential"
echo "======================================"
echo ""

for bill in 6000 8000 10000 15500 20000; do
  echo "Bill: ₹$bill"
  curl -s -X POST http://127.0.0.1:8000/api/calculate-solar-new/ \
    -H "Content-Type: application/json" \
    -d "{\"monthly_bill\": $bill, \"pincode\": \"682304\", \"property_type\": \"Residential\"}" \
    | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'  Final Cost: ₹{data[\"final_cost\"]:,.2f}'); print(f'  EMI: ₹{data[\"emi_details\"][\"emi_per_month\"]:,.2f}')"
  echo ""
done

echo ""
echo "Testing Basic Calculator - Commercial"
echo "====================================="
echo ""

for bill in 6000 8000 10000 15500 20000; do
  echo "Bill: ₹$bill"
  curl -s -X POST http://127.0.0.1:8000/api/calculate-solar-new/ \
    -H "Content-Type: application/json" \
    -d "{\"monthly_bill\": $bill, \"pincode\": \"682304\", \"property_type\": \"Commercial\"}" \
    | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'  Final Cost: ₹{data[\"final_cost\"]:,.2f}'); print(f'  EMI: ₹{data[\"emi_details\"][\"emi_per_month\"]:,.2f}')"
  echo ""
done
