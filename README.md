TODO:

- virhetekstit sivuilta parametri jsonina konfigurointi
```
npm run build && npm i -g && wacat test --error-texts example-files/error-texts.txt http://localhost:3000
ROOT_URL=http://localhost:3000 PAGE_ERROR_TEXTS_FILE_PATH=example-files/error-texts.txt npx playwright test --project=chromium
ROOT_URL=http://localhost:3000 PAGE_ERROR_TEXTS_FILE_PATH=https://raw.githubusercontent.com/mikesmallhelp/wacat/main/example-files/error-texts.txt npx playwright test --project=chromium
```
```
Running 1 test using 1 worker
[chromium] › test.spec.ts:17:1 › test an application
In the page: http://localhost:3000/
Check the page not contain the xxx yyy text
In the page: http://localhost:3000/working-page
Check the page not contain the xxx yyy text
Fill the #0 input field a value: ds4yc397
#0 drop-down list. Select the option #1
Push the button #0
Check the page not contain the xxx yyy text
In the page: http://localhost:3000/working-page2
Check the page not contain the xxx yyy text
Fill the #0 input field a value: 2z5koue8
#0 drop-down list. Select the option #1
Push the button #0
Check the page not contain the xxx yyy text
  1 passed (7.8s)
lenovo@lenovo-ThinkPad-T460s:~/projektit/wacat$
```
- saako jsonin ilman kenomerkkejä, esim: https://reqbin.com/req/c-dwjszac0/curl-post-json-example  
- virheet "selaimen konsolista" ja jos onnistuu, niin tiedostosta konfigurointi
- jos konfigurointi tiedosto, niin otetaan sieltä input kenttien syötteet
- tee sovelluksen generoimista input kenttien syötteistä eri pituisia ja sisällöltään monipuolisempia
- kellonaika lokituksiin
- onko muita linttereitä
- paina nappeja yms. niin pitkään, että palautetun sivun sisältö ei enää muutu
    - vai onko järkevää, jos muuttuu koko ajan (esim. aikaleima tms.), pitääkö asettaa jokin raja miten pitkään haetaan samalta sivulta tms.
    - voi olla liian monimutkaista
- pkill -f "next" voi tappaa tarpeettomia prosesseja
- Voisiko yksi moodi olla vain linkkien läpikäynti, savutesti
  - tekeekö Checkly tätä samaa
- Voisiko AI löytää virheitä koodista ja kehittää Playwright testejä (koodin tai ajettavan ohjelman perusteella), jotka soveltuvat tiettyyn käyttöliittymään
- https://blog.appsignal.com/2023/08/16/pitfalls-to-avoid-in-playwright-for-nodejs.html