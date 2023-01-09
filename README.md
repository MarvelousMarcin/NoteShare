# NoteShare - bezpieczna aplikacja do tworzenia notatek

## Zawartość

  <ol>
    <li>
      <a href="#o-aplikacji">O aplikacji</a>
      <ul>
        <li><a href="#narzędzia">Narzędzia</a></li>
      </ul>
    </li>
    <li><a href="#tworzenie-konta">Tworzenie konta</a></li>
    <li><a href="#logowanie">Logowanie</a></li>
    <li><a href="#strona-główna">Strona Główna</a></li>
    <li><a href="#notatka-publiczna">Notatka Publiczna</a></li>
    <li><a href="#udostępnienie-notatki">Udostępnienie notatki</a></li>
    <li><a href="#szyfrowanie-notatek">Szyfrowanie notatek</a></li>
    <li><a href="#statystyki-logowań">Statystyki logowań</a></li>

  </ol>

## O aplikacji

Aplikacja umożliwa tworzenie notatek, przy pomocy notacji Markdown. Notatki możemy dodatkowo udostępniać wybranym użytkownikom oraz wysyłać je do wszystkich publicznie. Ważnym elementem narzędzia jest także możliwość szyfrowania notatek przy pomocy hasła.

## Narzędzia

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## HTTPS

Aplikacja używa protokołu szyfrowania TLS. Szyfrowanie umożliwa dodatkowy kontener z nginx, który to przy użyciu self-signed certyfikatami, przekierowuje szyfrowany ruch do aplikacji.

Przekierowanie ruchu http na https

```docker
  server {
     listen 80 default_server;
     listen [::]:80 default_server;
     server_name 127.0.0.1;
     return 301 https://$server_name$request_uri;
   }
```

Użycie self-signed certyfikatów

```docker
  server {
      listen 443 ssl default_server;
      listen [::]:443 http2 default_server;
      ssl_certificate /etc/nginx/certs/client-cert.pem;
      ssl_certificate_key /etc/nginx/certs/client-key.pem;
  }
```

### Instalacja

1. Sklonuj repo
   ```sh
   git clone https://github.com/MarvelousMarcin/NoteShare
   ```
2. Dodaj plik z .env z JWT(przykładowy token, na którym są zrobione testowe dane) do folderu backend
   ```sh
   JWT_TOKEN='dashdioasjndioasiodhnasiodshnaindai0pdhnaisda'
   ```
3. Uruchom docker compose
   ```sh
    docker compose up
   ```
4. Stworzą się trzy kontenery **client**, **api** oraz **nginx**

5. Wejdź na linki https://localhost lub http://localhost

## *Testowe loginy*

* Email: marcin@gmail.com Hasło: 1234
* Email: test@gmail.com Hasło: 1234

## **Tworzenie konta**

Aby stworzyć nowe konto musimy podać trzy podstawowe informacje: **imię**, **email** oraz **hasło**.

<img src="./readmeAssets/register.png" width=800 />

### Zabezpieczenia

Formularz sprawdza złożoność hasła na podstawie entropii. Jeżeli entropia hasła jest mniejsza niż 3 to hasło nie zostanie przepuszczone.

- **Wyliczanie entropii**

  ```js
  const checkPassword = (password) => {
    let entropy = 0;
    let size = password.length;

    for (let i = 0; i < 256; i++) {
      let prob = (password.split(String.fromCharCode(i)).length - 1) / size;
      if (prob > 0) {
        entropy += prob * Math.log2(prob);
      }
    }

    return -entropy;
  };
  ```

- **Email musi być unikalny oraz musi być "E-Mailem"** - jeżeli system napotka jakiś błąd formularz wyświetli odpowiedni komunikat.

- **Hasło jest haszowane** - przed dodaniem hasła do bazy jest ono szyfrowane przy pomocy bcrypta z solą.

      const hashedPassword = bcrypt.hashSync(password, saltRounds);

## **Logowanie**

Aby się zaglować musimy podać email oraz hasło.

<img src="./readmeAssets/login.png" width=800  />

### Zabezpieczenia

- **Opóźnienie w logowaniu** - system nie dopuszcza wykonywania więcej niż jednego requesta w ciągu 2 sekund. Jeżeli będziemy próbowali brute-forcować system nas powtrzyma.

<img src="./readmeAssets/logintofast.png" width=500  />

- **Blokada konta** - jeżeli źle wpiszemy hasło po raz 30. System uzna to jako próbę włamania i zablokuje zupełnie możliwość logowania. Jedyna opcja odblokowania to wiadomość do administracji.

<img src="./readmeAssets/blocked.png" width=500 />

- **Śledzenie ip logujących się osób** - po prawidłowym wejściu na konto, system wysyła do bazy informację o ip zalogowane user oraz o godzinie, kiedy zalogowanie nastąpiło.

## **Strona główna**

Po zalogowaniu na swoje konto zobaczymy wszystkie nasze notatki w liście po lewej stronie. Każdą notatka ma przy sobie zębatkę służąco do wykonywania operacji na danej notatce. Symbolem plus możemy stworzyć nową notatkę. Notatki tworzymy przy pomocy Markdowna a system z niego wygeneruje nam wystylizowany output. Po utworzeniu notatki doda się ona do naszej listy.

<img src="./readmeAssets/main.png" width=800 />

### **Przykładowa notatka z headerami**

<img src="./readmeAssets/note.png" width=900 />

### **Przykładowa notatka ze zdjęciem**

<img src="./readmeAssets/vader.png" width=900 />

### **Opcje notatki**

<img src="./readmeAssets/options.png" width=500 />

### **Tworzenie notatki**

<img src="./readmeAssets/wrtitngnote.png" width=500 />

## **Notatka publiczna**

Przy pomocy przełącznika znajdującego się w panelu opcji notatki, możemy notatkę ustawić jako publiczną. Po takim działaniu trafi ona do zakładki Public, którą widzi każdy użytkownik ze swojego konta.

<img src="./readmeAssets/public.png" width=200 />

Po prawej stronie widzimy, kto jest autrem danej notatki.

<img src="./readmeAssets/pub.png" width=800 />

## **Udostępnienie notatki**

W panelu notatki możemy również udostępnić notatkę wybranemu użytkownikowi. Wystarczy że znamy jego e-mail. Po wpisaniu emaila i zatwierdzeniu notatka pojawi się temu użytkownikowi w zakładace **Share to me**.

<img src="./readmeAssets/share.png" width=400 />

Zalogujmy się na konto **test** i zobaczmy

<img src="./readmeAssets/shared.png" width=800 />

Jeżeli spróbujemy udostępnić notatkę użytkownikowi który nie istnieje zostaniemy o tym poinformowani.

<img src="./readmeAssets/shareErr.gif" width=800 />

Nie możemy także udostępniać zaszyfrowanych notatek.

<img src="./readmeAssets/shareErr2.gif" width=800 />

**_Możemy jednak zaszyfrować udostępnioną już notatkę._**

## **Szyfrowanie notatek**

Oprócz oczywiście usuwania notatki mamy jeszcze jedną funkcję czyli zaszyfrowanie notatki. Jeżeli jest ona niezaszyfrowana podajemy tajne hasło i zobaczymy, że treść notatki została zmodyfikowana. Szyfrowanie jest wykonywanie przy pomocy algorytmu **AES**.

<img src="./readmeAssets/cipher2.gif" width=800 />

Notatke możemy też oczywiście odszyfrować podając poprawne hasło.

<img src="./readmeAssets/cipher3.gif" width=800 />

Jeśli podamy błędne hasło zostaniemy o tym poinformaowani.

<img src="./readmeAssets/cipher4.gif" width=800 />

**Zdjęcia także możemy szyfrować**

<img src="./readmeAssets/fotoSz.gif" width=800 />

## **Statystyki logowań**

W zakładce settings możemy zobaczyć wszystkie skutecznie próby logowania wraz z adresami ip przypisanymi do urządzenia z którego nastąpiło zalogowanie.

<img src="./readmeAssets/loggedd.png" width=600 />
