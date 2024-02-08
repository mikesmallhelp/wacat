call wacat test --debug https://mikesmallhelp-test-application.vercel.app
call wacat test --debug https://mikesmallhelp-test-application-http-500-error.vercel.app/
call wacat test --debug --conf example-files/configuration-error-texts.json https://mikesmallhelp-test-application-error-in-page.vercel.app/
call wacat test --debug --input-texts example-files/input-texts.txt https://mikesmallhelp-test-application.vercel.app/
call wacat test --debug --input-texts https://raw.githubusercontent.com/mikesmallhelp/wacat/main/example-files/input-texts.txt https://mikesmallhelp-test-application.vercel.app/
call wacat test --debug --conf example-files/configuration-authentication.json https://mikesmallhelp-test-application-simple-authentication.vercel.app/
call wacat test --debug --conf example-files/configuration-complicated-authentication.json https://mikesmallhelp-test-application-more-complicated-authentication.vercel.app/
call wacat test --debug --conf example-files/configuration-complicated-authentication-with-not-visit-link-urls-remote.json https://mikesmallhelp-test-application-more-complicated-authentication.vercel.app/
