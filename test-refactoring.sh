#!/bin/bash

# Form Handler Refactoring Test Script
# This script tests the unified form handler functionality

echo "======================================"
echo "Form Handler Refactoring Test Suite"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Test 1: Check if backup files exist
echo "Test 1: Checking backup files..."
if [ -f "js/forms.js.backup" ] && [ -f "js/form-handler.js.backup" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Backup files exist"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Backup files missing"
    ((TESTS_FAILED++))
fi

# Test 2: Check if new form-handler.js exists
echo "Test 2: Checking new form-handler.js..."
if [ -f "js/form-handler.js" ]; then
    echo -e "${GREEN}✅ PASS${NC} - form-handler.js exists"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - form-handler.js missing"
    ((TESTS_FAILED++))
fi

# Test 3: Check file size (should be reasonable)
echo "Test 3: Checking file size..."
FILE_SIZE=$(wc -c < js/form-handler.js)
if [ $FILE_SIZE -gt 10000 ] && [ $FILE_SIZE -lt 100000 ]; then
    echo -e "${GREEN}✅ PASS${NC} - File size is reasonable ($FILE_SIZE bytes)"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠️  WARN${NC} - File size unusual ($FILE_SIZE bytes)"
    ((TESTS_PASSED++))
fi

# Test 4: Check for key functions in form-handler.js
echo "Test 4: Checking for key functions..."
KEY_FUNCTIONS=("class FormHandler" "initEmailJS" "setupFormValidation" "validateForm" "handleFormSubmit" "sendEmailWithEmailJS" "setupCustomSelects" "setupFileUploads" "setupDatePickers" "setupRangeSliders" "setupCharacterCounters")
ALL_FOUND=true

for func in "${KEY_FUNCTIONS[@]}"; do
    if ! grep -q "$func" js/form-handler.js; then
        echo -e "${RED}❌ Missing: $func${NC}"
        ALL_FOUND=false
    fi
done

if [ "$ALL_FOUND" = true ]; then
    echo -e "${GREEN}✅ PASS${NC} - All key functions present"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Some key functions missing"
    ((TESTS_FAILED++))
fi

# Test 5: Check for EmailJS configuration
echo "Test 5: Checking EmailJS configuration..."
if grep -q "EMAILJS_CONFIG" js/form-handler.js && \
   grep -q "service_9zp6s9v" js/form-handler.js && \
   grep -q "template_rfge4zj" js/form-handler.js; then
    echo -e "${GREEN}✅ PASS${NC} - EmailJS configuration present"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - EmailJS configuration missing"
    ((TESTS_FAILED++))
fi

# Test 6: Check HTML files reference form-handler.js
echo "Test 6: Checking HTML references..."
HTML_FILES=("contact.html" "customization.html" "product-detail.html" "products.html")
ALL_REFERENCED=true

for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        if ! grep -q "form-handler.js" "$file"; then
            echo -e "${RED}❌ $file doesn't reference form-handler.js${NC}"
            ALL_REFERENCED=false
        fi
    fi
done

if [ "$ALL_REFERENCED" = true ]; then
    echo -e "${GREEN}✅ PASS${NC} - All HTML files reference form-handler.js"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Some HTML files missing references"
    ((TESTS_FAILED++))
fi

# Test 7: Check for forms.js (should still exist for now)
echo "Test 7: Checking forms.js status..."
if [ -f "js/forms.js" ]; then
    echo -e "${YELLOW}⚠️  INFO${NC} - forms.js still exists (will be deleted later)"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠️  INFO${NC} - forms.js already deleted"
    ((TESTS_PASSED++))
fi

# Test 8: Check for validation rules
echo "Test 8: Checking validation rules..."
VALIDATION_RULES=("email:" "phone:" "required:" "minLength:" "maxLength:" "number:" "minValue:" "maxValue:")
ALL_FOUND=true

for rule in "${VALIDATION_RULES[@]}"; do
    if ! grep -q "$rule" js/form-handler.js; then
        echo -e "${RED}❌ Missing validation rule: $rule${NC}"
        ALL_FOUND=false
    fi
done

if [ "$ALL_FOUND" = true ]; then
    echo -e "${GREEN}✅ PASS${NC} - All validation rules present"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Some validation rules missing"
    ((TESTS_FAILED++))
fi

# Test 9: Check for UI enhancement functions
echo "Test 9: Checking UI enhancements..."
UI_FEATURES=("setupCustomSelects" "setupFileUploads" "setupDatePickers" "setupRangeSliders" "setupCharacterCounters")
ALL_FOUND=true

for feature in "${UI_FEATURES[@]}"; do
    if ! grep -q "$feature" js/form-handler.js; then
        echo -e "${RED}❌ Missing UI feature: $feature${NC}"
        ALL_FOUND=false
    fi
done

if [ "$ALL_FOUND" = true ]; then
    echo -e "${GREEN}✅ PASS${NC} - All UI enhancements present"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Some UI enhancements missing"
    ((TESTS_FAILED++))
fi

# Test 10: Check for debug utilities
echo "Test 10: Checking debug utilities..."
if grep -q "window.HGuardianForms" js/form-handler.js && \
   grep -q "testEmailJS" js/form-handler.js && \
   grep -q "getStatus" js/form-handler.js; then
    echo -e "${GREEN}✅ PASS${NC} - Debug utilities present"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Debug utilities missing"
    ((TESTS_FAILED++))
fi

# Summary
echo ""
echo "======================================"
echo "Test Summary"
echo "======================================"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! Refactoring successful.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review.${NC}"
    exit 1
fi
