#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

run_playwright_tests() {
    local test_filename="$1"
    local test_command_extra_parameters="$2"
    local test_type="$3"

    echo
    echo "******************************************"
    echo "Testing:"
    echo "$test_filename"
    echo "******************************************"
    echo

    cp "test-app/test-app/pages/$test_filename" test-app/test-app/pages/index.tsx

    sleep 5

    test_output=$(wacat test $test_command_extra_parameters http://localhost:3000 2>&1)

    echo "$test_output"

    if ([[ $test_output == *"1 failed"* ]] && \
        ([[ $test_output == *"expect(content).not.toContain"* ]] || \
         [[ $test_output == *"Request to http://localhost:3000/api/http-500 resulted in status code 500"* ]] \
        ) && \
        [[ $test_type == *"testFails"* ]] \
       ) \
       || ([[ $test_output == *"1 passed"* ]] && [[ $test_type == *"testPasses"* ]]); then \
        echo -e "${GREEN}"
        echo "******************************************"
        echo "Testing:"
        echo "$test_filename"
        echo "successful" 
        echo "******************************************"
        echo
        echo -e "${NC}"
    else
        echo -e "${RED}"
        echo "******************************************"
        echo "******************************************"
        echo "Testing failed!"
        echo "******************************************"
        echo "******************************************"
        echo -e "${NC}"
        
        pkill -f "next"
        exit 1
    fi
}

echo
echo "******************************************"
echo "******************************************"
echo "Start testing"
echo "******************************************"
echo "******************************************"
echo

(cd test-app/test-app && npm run dev &)
sleep 10

run_playwright_tests "index-error-text-in-page.tsx" "--error-texts example-files/error-texts.txt" "testFails"
run_playwright_tests "index-button-push-causes-error.tsx" "--error-texts example-files/error-texts.txt" "testFails"
run_playwright_tests "index-input-field-and-button-push-causes-error.tsx" "--error-texts example-files/error-texts.txt" "testFails"
run_playwright_tests "index-drop-down-list-selection-and-button-push-causes-error.tsx" "--error-texts example-files/error-texts.txt" "testFails"
run_playwright_tests "index-api-returns-http-500.tsx" "--error-texts example-files/error-texts.txt" "testFails"
run_playwright_tests "index-working-page2.tsx" "--error-texts example-files/error-texts.txt" "testPasses"

pkill -f "next"

echo -e "${GREEN}"
echo "******************************************"
echo "******************************************"
echo "Testing successful"
echo "******************************************"
echo "******************************************"
echo -e "${NC}"
