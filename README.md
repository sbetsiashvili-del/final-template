# Retro Game Vault

Retro Game Vault არის ბრაუზერზე დაფუძნებული ვებ აპლიკაცია, სადაც მომხმარებლებს შეუძლიათ მოძებნონ და აღმოაჩინონ უფასო თამაშები, შეინახონ საყვარელი თამაშები პერსონალურ ბიბლიოთეკაში, ნახონ თითოეული თამაშის დეტალური ინფორმაცია მოდალურ ფანჯარაში, და ადევნონ თვალი რომელი თამაში ითამაშეს — ყოველივე ეს სრულიად უფასოდ, სერვერის გარეშე, მხოლოდ სახელის შეყვანით.

## ტექნოლოგიური სტეკი

| ტექნოლოგია | გამოყენება |
|---|---|
| HTML5 | სტრუქტურა და სემანტიკა |
| CSS3 (Vanilla) | სტილი, CSS Grid, Flexbox, CSS Custom Properties |
| Vanilla JavaScript (ES Modules) | ლოგიკა, DOM მანიპულაცია, fetch API |
| [Free-to-Play Games API via RapidAPI](https://rapidapi.com/digiwalls/api/free-to-play-games-database) | თამაშების მონაცემები |
| `localStorage` | შენახული ბიბლიოთეკა, played სტატუსი, სესიის მართვა |
| Cookies | ავტორიზაციის სტატუსი |

> არანაირი ფრეიმვორკი, არანაირი ბექენდი, არანაირი build step.

## ფაილების სტრუქტურა

```
final-template/
├── index.html          ← მთავარი გვერდი (ძიება + შედეგები + მოდალი)
├── login.html          ← შესვლის გვერდი (სახელის შეყვანა)
├── saved.html          ← შენახული თამაშების ბიბლიოთეკა
├── css/
│   └── style.css       ← გლობალური სტილი (dark theme, responsive)
├── js/
│   ├── api.js          ← API მოთხოვნები (RapidAPI) + localStorage დამხმარეები
│   ├── login.js        ← შესვლის ლოგიკა (cookie + redirect)
│   ├── main.js         ← entry point index.html-ისთვის
│   └── saved.js        ← entry point saved.html-ისთვის
├── assets/             ← სტატიკური ასეტები
├── .gitignore
└── README.md
```

## როგორ გავუშვა

> [!IMPORTANT]
> ვებსაიტი **ადგილობრივი HTTP სერვერის გარეშე არ იმუშავებს** — პირდაპირ `file://`-ით გახსნა ბლოკავს JavaScript-ის მოდულებს და API fetch() მოთხოვნებს. ქვემოთ მოცემული ნებისმიერი ვარიანტი გამოდგება.

### ვარიანტი A — Python (რეკომენდებულია)
```powershell
# გახსენი PowerShell final-template საქაღალდეში და გაუშვი:
python -m http.server 8080
```
შემდეგ ბრაუზერში გახსენი: **http://localhost:8080/login.html**

### ვარიანტი B — VS Code Live Server
1. VS Code → Extensions → მოძებნე **"Live Server"** (Ritwick Dey) → Install
2. `index.html`-ზე მარჯვენა კლიკი → **"Open with Live Server"**
3. ბრაუზერი ავტომატურად გაიხსნება **http://127.0.0.1:5500**

### ვარიანტი C — Node.js
```powershell
npx serve .
```
შემდეგ გახსენი: **http://localhost:3000/login.html**

### მომხმარებლის მარშრუტი
1. სერვერის გაშვების შემდეგ გახსენი **`/login.html`**
2. შეიყვანე შენი სახელი და დააჭირე "დაწყება →"
3. ავტომატურად გადამისამართდები მთავარ გვერდზე
4. თამაშები **ავტომატურად** ჩაიტვირთება — ძიების ღილაკის დაჭერა არ სჭირდება
5. გამოიყენე ფორმა ფილტრაციისთვის (სახელი, ჟანრი, პლატფორმა)


## Features

- 🔍 **ძიება და ფილტრაცია** — თამაშების ძიება სახელით, ჟანრით (MMORPG, Shooter, Strategy…) და პლატფორმით (PC / Browser / ყველა); კლიენტზე სახელის ფილტრი + API-ზე კატეგორია/პლატფორმა
- 💾 **ბიბლიოთეკაში შენახვა** — "შენახვა / შენახულია ✓" toggle თითოეულ ბარათზე; `localStorage`-ში ინახება მუდმივად, გვერდის განახლების შემდეგაც
- 🪟 **დეტალების მოდალი** — "დეტალები" ღილაკით იხსნება popup: სათაური, ჟანრი, პლატფორმა, გამოშვების თარიღი, სრული აღწერა, მინ. სისტემური მოთხოვნები, სქრინშოტების გალერეა (CSS Grid)
- 🎮 **Played სტატუსი** — saved.html-ზე "სათამაშოდ / თამაშებული ✓" toggle; მდგომარეობა `localStorage`-ში ინახება
- 👤 **მდგრადი სესია** — სახელზე დაფუძნებული "შესვლა / გასვლა" cookie-ს საშუალებით; ავტორიზაციის გარეშე ყველა გვერდი login.html-ზე გადამისამართდება
- ♿ **Accessibility** — `role="alert"` შეცდომის ელემენტებზე, `aria-live="polite"` loading მდგომარეობებზე, `aria-label` მოდალის ✕ ღილაკზე, ყველა input-ს აქვს `<label>`
- 📱 **Responsive** — 1-სვეტიანი layout ≤600px, 3+ სვეტი ≥1024px; მოდალი ეტევა პატარა ეკრანებზეც

## API

[Free-to-Play Games Database](https://rapidapi.com/digiwalls/api/free-to-play-games-database) via RapidAPI.

- `GET /api/games` — თამაშების სია (ფილტრი: `category`, `platform`)
- `GET /api/game?id={id}` — კონკრეტული თამაშის დეტალები (screenshots, system requirements)
