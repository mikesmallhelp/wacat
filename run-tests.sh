#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

run_playwright_tests_failing_error_text_found() {
    local test_filename="$1"
    local test_command_extra_parameters="$2"

    run_playwright_tests "$test_filename" "$test_command_extra_parameters" "1 failed" "expect(content).not.toContain"
}

run_playwright_tests() {
    local test_filename="$1"
    local test_command_extra_parameters="$2"
    local output_contains_test_result="$3"
    local output_contains_text="$4"

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

    if ([[ $test_output == *$output_contains_test_result* ]] && \
        [[ $test_output == *$output_contains_text* ]]); then \
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

run_playwright_tests_failing_error_text_found "index-error-text-in-page.tsx" \
        "--error-texts https://raw.githubusercontent.com/mikesmallhelp/wacat/main/example-files/error-texts.txt"
run_playwright_tests_failing_error_text_found "index-button-push-causes-error.tsx" "--error-texts example-files/error-texts.txt"
run_playwright_tests_failing_error_text_found "index-input-field-and-button-push-causes-error.tsx" "--error-texts example-files/error-texts.txt"
run_playwright_tests_failing_error_text_found "index-drop-down-list-selection-and-button-push-causes-error.tsx" \
        "--error-texts example-files/error-texts.txt"
run_playwright_tests "index-api-returns-http-500.tsx" "--error-texts example-files/error-texts.txt" "1 failed" \
        "Request to http://localhost:3000/api/http-500 resulted in status code 500"
run_playwright_tests "index-working-page2.tsx" "--error-texts example-files/error-texts.txt" "1 passed" \
        "Check the page not contain the Error occurred! text"
run_playwright_tests "index-working-page2.tsx" "" "1 passed" "Push the button #0"

pkill -f "next"

echo -e "${GREEN}"
echo "******************************************"
echo "******************************************"
echo "Testing successful"
echo "******************************************"
echo "******************************************"
echo -e "${NC}"
