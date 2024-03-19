call wacat test --wait 5000 --headless https://mikesmallhelp-test-application.vercel.app
call wacat test --wait 5000 https://mikesmallhelp-test-application-http-500-error.vercel.app/
call wacat test --wait 5000 --conf example-files/configuration-error-texts.json https://mikesmallhelp-test-application-error-in-page.vercel.app/
call wacat test --wait 5000 https://mikesmallhelp-test-application-error-in-browser-console.vercel.app
call wacat test --wait 5000 --random-input-texts-min-length 1 --random-input-texts-max-length 3 --random-input-texts-charset ®©¥¬¿ https://mikesmallhelp-test-application.vercel.app/
call wacat test --wait 5000 --input-texts example-files/input-texts.txt https://mikesmallhelp-test-application.vercel.app/
call wacat test --wait 5000 --input-texts https://raw.githubusercontent.com/mikesmallhelp/wacat/main/example-files/input-texts.txt https://mikesmallhelp-test-application.vercel.app/
call wacat test --wait 5000 --only-links https://mikesmallhelp-test-application.vercel.app/
call wacat test --wait 5000 --conf example-files/configuration-authentication.json https://mikesmallhelp-test-application-simple-authentication.vercel.app/
call wacat test --wait 5000 --conf example-files/configuration-complicated-authentication.json https://mikesmallhelp-test-application-more-complicated-authentication.vercel.app/
call wacat test --wait 5000 --conf example-files/configuration-complicated-authentication-with-not-visit-link-urls-remote.json https://mikesmallhelp-test-application-more-complicated-authentication.vercel.app/
call wacat test --timeout 1 https://mikesmallhelp-test-application.vercel.app
call wacat test --help
