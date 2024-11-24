#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

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

run_playwright_tests "index-working-page3.tsx" "--input-texts example-files/input-texts.txt --wait 3000 --ignore-ai-in-test" "1 passed" "ybyb"

pkill -f "next"

echo -e "${GREEN}"
echo "******************************************"
echo "******************************************"
echo "Testing successful"
echo "******************************************"
echo "******************************************"
echo -e "${NC}"
