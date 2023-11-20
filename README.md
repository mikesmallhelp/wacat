TODO:

- yksinkertaista testing.yamlia mikäli mahdollista
- run-tests.sh 
  - pitkä if muutamalle eri riville
- lisää taas: "posttest": "npm run lint",
- virhetekstit sivuilta tiedostosta konfigurointi
- virheet "selaimen konsolista" ja jos onnistuu, niin tiedostosta konfigurointi
- jos konfigurointi tiedosto, niin otetaan sieltä input kenttien syötteet
- tee sovelluksen generoimista input kenttien syötteistä eri pituisia ja sisällöltään monipuolisempia
- kellonaika lokituksiin
- paina nappeja yms. niin pitkään, että palautetun sivun sisältö ei enää muutu
    - vai onko järkevää, jos muuttuu koko ajan (esim. aikaleima tms.), pitääkö asettaa jokin raja miten pitkään haetaan samalta sivulta tms.
    - voi olla liian monimutkaista
- pkill -f "next" voi tappaa tarpeettomia prosesseja
- Voisiko yksi moodi olla vain linkkien läpikäynti, savutesti
  - tekeekö Checkly tätä samaa
- Voisiko AI löytää virheitä koodista ja kehittää Playwright testejä (koodin tai ajettavan ohjelman perusteella), jotka soveltuvat tiettyyn käyttöliittymään
- https://blog.appsignal.com/2023/08/16/pitfalls-to-avoid-in-playwright-for-nodejs.html