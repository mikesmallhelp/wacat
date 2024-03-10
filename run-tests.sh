#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

run_playwright_tests_failing_and_error_text_found() {
    local test_filename="$1"

    run_playwright_tests "$test_filename" "--conf example-files/configuration-error-texts.json --wait 2000 --bypass-browser-console-errors" \
                   "1 failed" "expect(content).not.toContain"
}

print_test_parameters() {
    local test_filename="$1"
    local test_command_extra_parameters="$2"
    local output_contains_test_result="$3"
    local output_contains_text="$4"
    local output_contains_text2="$5"
    local output_not_contains_text="$6"
    
    echo
    echo "******************************************"
    echo "Testing:"
    echo
    echo "filename: $test_filename"
    echo "wacat parameters: $test_command_extra_parameters"
    echo "contains result: $output_contains_test_result"
    echo "contains: $output_contains_text"

    if [[ -n "$output_contains_text2" ]]; then
        echo "contains: $output_contains_text2"
    fi

    if [[ -n "$output_not_contains_text" ]]; then
        echo "not contains: $output_not_contains_text"
    fi
}

run_playwright_tests() {
    local test_filename="$1"
    local test_command_extra_parameters="$2"
    local output_contains_test_result="$3"
    local output_contains_text="$4"
    local output_contains_text2="$5"
    local output_not_contains_text="$6"

    print_test_parameters "$test_filename" "$test_command_extra_parameters" "$output_contains_test_result" \
                          "$output_contains_text" "$output_contains_text2" "$output_not_contains_text"

    echo "******************************************"
    echo

    cp "test-app/test-app/pages/$test_filename" test-app/test-app/pages/index.tsx

    sleep 5

    test_output=$(wacat test --headless $test_command_extra_parameters http://localhost:3000 2>&1)

    echo "$test_output"

    if (
        [[ $test_output == *$output_contains_test_result* ]] && \
        [[ $test_output == *$output_contains_text* ]] && \
        ([[ -z "$output_contains_text2" ]] || [[ $test_output == *$output_contains_text2* ]]) && \
        ([[ -z "$output_not_contains_text" ]] || [[ ! $test_output == *$output_not_contains_text* ]]) \
    ); then \
        echo -e "${GREEN}"

        print_test_parameters "$test_filename" "$test_command_extra_parameters" "$output_contains_test_result" \
                          "$output_contains_text" "$output_contains_text2" "$output_not_contains_text"
        echo
        echo "successful" 
        echo "******************************************"
        echo
        echo -e "${NC}"
    else
        echo -e "${RED}"

        print_test_parameters "$test_filename" "$test_command_extra_parameters" "$output_contains_test_result" \
                          "$output_contains_text" "$output_contains_text2" "$output_not_contains_text"

        echo
        echo "failed!" 
        echo "******************************************"
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

run_playwright_tests_failing_and_error_text_found "index-input-field-and-button-push-causes-error.tsx"
run_playwright_tests_failing_and_error_text_found "index-error-text-in-page.tsx"
run_playwright_tests_failing_and_error_text_found "index-button-push-causes-error.tsx"

run_playwright_tests "index-input-field-and-button-push-causes-error.tsx" \
        "--conf example-files/configuration-error-texts.json --input-texts example-files/input-texts.txt --wait 2000" \
        "1 failed" "expect(content).not.toContain" "xaxa"
run_playwright_tests "index-input-field-and-button-push-causes-error.tsx" \
        "--conf example-files/configuration-error-texts.json --input-texts https://raw.githubusercontent.com/mikesmallhelp/wacat/main/example-files/input-texts.txt --wait 2000" "1 failed" "expect(content).not.toContain" "xaxa"        
run_playwright_tests_failing_and_error_text_found "index-drop-down-list-selection-and-button-push-causes-error.tsx"
run_playwright_tests "index-api-returns-http-500.tsx" "--wait 2000" "1 failed" \
        "http://localhost:3000/api-returns-http-500: Request to" \
        "http://localhost:3000/api/http-500 resulted in status code 500"
run_playwright_tests "index-api-returns-http-500.tsx" "--bypass-http-errors --wait 2000" "1 passed" \
        "In the page: http://localhost:3000/api-returns-http-500: Request to http://localhost:3000/api/http-500 resulted in status code 500"
run_playwright_tests "index-error-text-in-page.tsx" "" "1 failed" \
   "AssertionError: In the page: http://localhost:3000/error-text-in-page:" "Found an error message in the browser's log: Hello! Something wrong!"
run_playwright_tests "index-working-page2.tsx" "--conf example-files/configuration-error-texts.json --wait 2000" "1 passed" \
        "Check the page not contain the Error occurred! text"
run_playwright_tests "index-working-page2.tsx" "" "1 passed" "Push the button #1"
run_playwright_tests "index-working-page2.tsx" "--only-links --wait 2000" "1 passed" \
         "In the page: http://localhost:3000/working-page" \
         "In the page: http://localhost:3000/working-page2" "Push the button #0"
run_playwright_tests "index-auth.tsx" "--conf example-files/configuration-authentication.json --wait 2000" "1 passed" \
       "In the page: http://localhost:3000/working-page2"
run_playwright_tests "index-auth-complicated.tsx" "--conf example-files/configuration-complicated-authentication.json --wait 2000" \
        "1 passed" "In the page: http://localhost:3000/working-page2" "In the page: http://localhost:3000/logout"
run_playwright_tests "index-auth-complicated.tsx" \
        "--conf example-files/configuration-complicated-authentication-with-not-visit-link-urls.json --wait 2000" \
        "1 passed" "In the page: http://localhost:3000/working-page" "In the page: http://localhost:3000/working-page2" \
        "In the page: http://localhost:3000/logout"
run_playwright_tests "index-working-page2.tsx" "--timeout 1" "1 failed" "Test timeout of 1000ms exceeded."

pkill -f "next"

echo -e "${GREEN}"
echo "******************************************"
echo "******************************************"
echo "Testing successful"
echo "******************************************"
echo "******************************************"
echo -e "${NC}"
