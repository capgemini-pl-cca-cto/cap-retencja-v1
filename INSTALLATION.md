# Instrukcja dla Administratora WordPress: ręczna instalacja komponentu webowego

**Cel:** Dodanie komponentu webowego (`retencja-v1-app`) do witryny
WordPress.

## 1. Przygotowanie plików

- W paczce znajdują się pliki:
  - `dist/retencja-v1-app.js`
  - `dist/retencja-v1-app.css`
  - `dist/retencja-v1-app.png`
  - `dist/assets/` (zawiera czcionki, obrazy, załączniki, dane bazowe itp.)
  - `dist/index.html` (nie jest potrzebny do instalacji, zawiera przykład użycia)
  - `dist/INSTALLATION.md` (ta instrukcja, nie jest potrzebna do instalacji)

## 2. Umieszczenie plików na serwerze

1.  Zaloguj się do panelu **WordPress → Media → Biblioteka** lub użyj
    **FTP / cPanel**.\

2.  Skopiuj cały folder `dist/` do katalogu:

        wp-content/uploads/retencja-app/

    Dzięki temu otrzymasz strukturę:

        wp-content/uploads/retencja-app/dist/
            ├── retencja-v1-app.js
            ├── retencja-v1-app.css
            ├── retencja-v1-app.png
            └── assets/

## 3. Dodanie skryptu i stylu do strony

1.  Przejdź do edycji strony/postu, gdzie chcesz umieścić komponent.

2.  Dodaj blok **HTML**.

3.  Wklej:

    ```html
    <link
      rel="stylesheet"
      href="/wp-content/uploads/retencja-app/dist/retencja-v1-app.css"
    />
    <script
      type="module"
      src="/wp-content/uploads/retencja-app/dist/retencja-v1-app.js"
    ></script>

    <!-- Wywołanie komponentu -->
    <retencja-v1-app></retencja-v1-app>
    ```

## 4. Weryfikacja

- Odśwież stronę w trybie **incognito** (żeby pominąć cache).
- Sprawdź w konsoli przeglądarki (F12 → Console), czy nie ma błędów
  związanych z ładowaniem plików.
- Upewnij się, że ścieżki do `assets/` działają poprawnie (np.
  czcionki).

## 5. Strona demonstracyjna

Działającą wersję komponentu można zobaczyć pod adresem: https://capgemini-pl-cca-cto.github.io/cap-retencja-v1/

## 6. Rozwiązywanie problemów

Jeśli wystąpią błędy:

1. Sprawdź w konsoli przeglądarki (F12 → Console), jakie komunikaty się pojawiają.
1. Upewnij się, że wszystkie pliki (.js, .css, folder `assets/`) zostały poprawnie wgrane na serwer.
1. Sprawdź poprawność ścieżek (częsty błąd to literówki lub brak `/wp-content/uploads/retencja/`).
1. W przypadku problemów z cache wyczyść pamięć podręczną przeglądarki i/lub cache WordPress (np. wtyczki cache).
1. Jeśli komponent się nie ładuje, spróbuj wczytać stronę bez wtyczek optymalizacyjnych (np. Autoptimize, WP Rocket), które mogą łączyć/kompresować skrypty.
