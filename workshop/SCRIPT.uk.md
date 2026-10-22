# Сценарій воркшопу — повний текст, 80 хвилин

> Українська версія для ведучого: що казати, що показувати, коли. Англійський RUNBOOK.md — той самий план у стислому вигляді; промпти тут наведені дослівно англійською, бо саме так вони вставляються у Claude Code. Цей файл достатній сам по собі під час сесії.

Позначки: 🎤 — текст, який кажемо · 🖥 — що на екрані · 💬 — промпт (вставляємо як є) · ❓ — питання до аудиторії · ⚠️ — де не застрягти.

## Таймінг

| Час | Блок | Тег | Хв |
|---|---|---|---|
| 13:30 | Вступ і дискусія: «що ви зробите з вимогами завтра?» | `step-00` | 10 |
| 13:40 | Крок 1 · Середовище і аналіз вимог | `step-01` | 10 |
| 13:50 | Крок 2 · Рішення: мапа опцій у plan mode, ADR, ризики | `step-02` | 15 |
| 14:05 | Крок 3 · Ескіз архітектури, його картинка і перевірка за історіями | `step-03` | 12 |
| 14:17 | Кроки 4 + 5 · Claude для команди (огляд можливостей), скелет проєкту | `step-04`, `step-05` | 9 |
| 14:26 | Крок 6 · Техніка тестування і перші тести | `step-06` | 5 |
| 14:31 | Брейкаут-кімнати | — | 12 |
| 14:43 | Підсумок і передача естафети | `main` | 7 |

Наскрізна нитка всіх шести кроків: **контекст → обмеження → запит → перевірка → виправлення.** Назвати у вступі, повертатися в кожному кроці, повторити в підсумку.

Перед початком: термінал з великим шрифтом у корені репозиторію на `main`, IDE відкрита на `docs/`, браузерна вкладка з `docs/architecture/system.html` (темна тема), гілка `live/step-01` створена напередодні. Чат — відкритий на другому моніторі або в окремому вікні: туди підуть відповіді дискусії.

---

## 13:30–13:40 · Вступ і дискусія (10 хв) · `./workshop/go.sh 0`

### Відкриття (2 хв)

🎤
Доброго дня. Ви закінчуєте курс з оркестрації ШІ і за кілька тижнів починаєте фінальні проєкти. У кожного з вас уже є вимоги: опис продукту, персони, користувацькі сценарії, історії з критеріями приймання. Сьогодні ми говоримо про те, що лежить між цими вимогами і першим рядком коду. Але спочатку я хочу почути вас — бо те, що ви скажете зараз, і є темою наступних сімдесяти хвилин.

### Дискусія (7 хв)

❓ **Питання 1** (вголос, 2–3 людини; решта — одним рядком у чат):
🎤 «Уявіть: завтра ви відкриваєте папку з вимогами до свого проєкту. Що ви робите першим? Куди йдете з цими документами — у код, у ШІ, на дошку, у чат команди? Назвіть одну конкретну дію.»

🖥 Поки відповідають — нічого не показувати, слухати. Попросити одного зі студентів (або асистента) зберегти відповіді з чату: до них повернемося в підсумку.

🎤 **Як працювати з відповідями.** Типові варіанти і що з ними робити на ходу — групуємо вголос, не оцінюємо:
- *«Почну писати код / зроблю скелет / create-react-app»* → 🎤 «Добре. На якому стеку? Хто це вирішив і за яким критерієм?» — це *рішення*, прийняте мовчки.
- *«Попрошу ChatGPT / Claude згенерувати проєкт»* → 🎤 «Чудово, спробуємо сьогодні. Одне питання: якщо у вимогах не сказано, як користувач логіниться, — що зробить модель? Вона зупиниться і спитає, чи придумає сама?» — це *невидима вигадка*.
- *«Намалюю схему бази / діаграму»* → 🎤 «Це вже артефакт дизайну. Для кого він? Хто його прочитає, крім вас?» — це *документ без читача*.
- *«Виберемо стек командою / розподілимо задачі»* → 🎤 «Як ви через місяць згадаєте, чому обрали саме це? І як дізнаєтесь, що всі чотирнадцять історій покриті тим, що ви розподілили?» — це *рішення без запису* і *архітектура без перевірки*.
- *«Прочитаю вимоги ще раз»* → 🎤 «Найчесніша відповідь. І що ви шукатимете, читаючи? Сьогодні побачите, що саме варто шукати.»

❓ **Питання 2** (коротке, у чат, 1 хв): 🎤 «Хто з вас уже використовував ШІ для проєктування, а не для коду — для вибору стеку, для схеми, для опису архітектури? Плюс у чат, якщо так. І одним словом: що з того вийшло — корисно, шумно, небезпечно?»

🎤 Прокоментувати розподіл одним реченням: «Бачу, що код — так, а дизайн — рідко або з підозрою. Це нормально: моделі на етапі дизайну справді небезпечні, якщо не знати техніку. Про техніку і поговоримо.»

### Місток до теми (1 хв)

🎤
Подивіться на те, що ви щойно назвали. Стек. Схема бази. Хто що робить. Чи спитає модель, чи вигадає. Усе це — рішення, і саме ці рішення найдорожче міняти потім: що це за система, з чого складається, які технології її несуть, де вона зламається. Цей шар називається технічним рішенням, і сьогодні ми побудуємо його для проєкту, якого ви не бачили, — DevMatch, сервіс для збирання студентських команд. Шість промптів до Claude Code. Для кожного ви побачите три речі: сам промпт, результат — і місце, де ШІ або знайшов те, що пропустили люди, або потребував людини, щоб вирішити.

Два попередження наперед. Перше: ШІ радо спроєктує систему з неповних вимог і ніколи не скаже, що саме він вигадав. Сьогоднішня техніка здебільшого про те, як цьому *запобігти*. Друге: ШІ не знає вашу команду, дедлайн і бюджет, доки ви не скажете. Половина хорошого промпта — це обмеження.

Принцип на всю сесію: **контекст → обмеження → запит → перевірка → виправлення.** Даємо контекст (папку docs, а не вставлену стіну тексту), називаємо обмеження, просимо конкретний артефакт у конкретному місці, перевіряємо його за вимогами, виправляємо те, що не так. Кожен промпт сьогодні має цю форму.

🖥 `docs/`: три файли. `project_context.md` — продукт одним абзацом, шість персон (дві основні, чотири «неочевидні»), канви ціннісної пропозиції, два користувацькі сценарії і story map з MVP та post-MVP. `US-INIT-1.md` — вісім історій для лідера проєкту. `US-STUD-1.md` — шість історій для студента. Відкрити US-06 (підтвердження заявки) і прогорнути: історія, чекліст критеріїв, три Gherkin-сценарії, включно з гонкою за останнє місце.
🎤 «Це якість вхідних даних, яку ми маємо. Ваші можуть бути грубіші — техніка та сама, ШІ просто знайде більше дірок.»

⚠️ Дискусія не має перерости у суперечку про стеки. Якщо хтось захищає свій вибір — «запишіть, повернемося до цього в кроці 2: там є питання, яке перевіряє будь-який вибір».

---

## 13:40–13:50 · Крок 1: середовище і аналіз вимог (10 хв) · `./workshop/go.sh 1`

🎤
Перше, що я роблю в новому проєкті, — не код і не архітектура. Це місце для контексту. Claude Code на старті кожної сесії читає файл `CLAUDE.md`; що в ньому є, ШІ знає без повторення. На цьому етапі мій — близько двадцяти рядків: що за проєкт, де лежать вимоги, обмеження, які я вже знаю, і одне правило — «не вигадуй вимоги мовчки; якщо чогось бракує, скажи і запропонуй припущення». Це найцінніший рядок у файлі, і за хвилину ви побачите чому.

Далі перший промпт. Зверніть увагу, чого він *не* просить. Не просить дизайн. Не просить технології. Він просить *прочитати* і *структурувати* те, що є: сутності та їхні стани, бізнес-правила з номером історії біля кожного, нефункціональні вимоги, які маються на увазі, але не написані, і — найважливіше — прогалини: чого бракує, але без чого не обійтись. Якщо на цьому етапі попросити «спроєктуй систему» — модель спроєктує і тихо заповнить кожну дірку власними припущеннями. Попросіть спочатку дірки — і вони стануть рішеннями, які приймаєте ви, а не аваріями, які ви знаходите на третьому тижні.

💬 **Промпт 1** (звичайний режим):

```text
Read all files in docs/ — these are the input requirements of the DevMatch project
(context, personas, user journey, 14 user stories with acceptance criteria and
Gherkin scenarios).

Do a requirements analysis for the subsequent design. Don't design anything and
don't choose technologies — analysis only. Write the result to
docs/analysis/requirements-digest.md in English, in the following structure:

1. Entities and their states. For each entity — the attributes explicitly mentioned
   in the requirements, and the states with transitions (who initiates the
   transition, under which condition).
2. Business rules / invariants extracted from the acceptance criteria and Gherkin.
   Each rule — with a reference to the story (US-xx) and the scenario.
3. Non-functional requirements that follow from the text (security, concurrency,
   access without authentication, etc.), even if they are not stated explicitly.
4. Gaps and open questions: what the requirements lack, but without which the
   system cannot be designed. For each — why it blocks and which answer is the
   cheapest for the MVP.
5. Assumptions you propose to adopt for the MVP, with a risk rating
   (low / medium / high) if the assumption turns out to be wrong.

Be specific: cite story and scenario numbers, don't paraphrase the requirements
in your own words where you can quote them.
```

🎤 **Чому промпт написаний саме так.**
- «Read all files in docs/» — вказуємо на контекст замість вставляти його. ШІ читає, що треба, а промпт лишається коротким і придатним для повторного використання.
- «Don't design anything» — явний стоп. Без нього модель з'їжджає в наступний крок, і аналіз забруднюється архітектурою, яку вона вже тримає в голові.
- Нумерована структура і шлях до файлу — щоб результат був документом, який команда закомітить і перегляне, а не відповіддю в чаті, що прокрутиться.
- «Cite story and scenario numbers» — кожне твердження стає перевірюваним. Якщо дайджест каже «правило R8 з US-06 сценарій 3», будь-хто відкриє історію і підтвердить.

🖥 `CLAUDE.md` (версія на 23 рядки), потім `docs/analysis/requirements-digest.md`:
- **§1 сутності** — прогорнути до таблиці переходів Application. 🎤 «Три стейт-машини вийшли з чотирнадцяти історій: Project DRAFT → PUBLISHED → CLOSED, Role OPEN → FILLED, Application PENDING → APPROVED або REJECTED. Ніхто не писав „стейт-машина" у вимогах; ШІ зібрав їх з критеріїв, розкиданих по восьми історіях.»
- **§2 правила** — вісімнадцять правил, кожне з джерелом. Вибрати R5 (Telegram лідера ніколи не потрапляє в публічні відповіді) і R8 (підтвердження відхиляється, коли місць нуль, «навіть якщо секунду тому було одне»).
- **§4 відкриті питання, питання 1.** 🎤 «Прочитайте зі мною. US-01 каже: користувач „увійшов уперше". US-13: „заявки поточного користувача". US-12 просить Telegram *у формі заявки*, ніби профілю немає. Чотирнадцять історій — і жодна не описує, як користувач входить у систему. Кожен із вас виявив би це в день, коли сів писати сторінку заявок. ШІ знайшов за дев'яносто секунд, бо ми попросили дірки замість дизайну.»
- **§5 припущення з оцінкою ризику** — по рядку на кожне. 🎤 «Ми не приймаємо їх автоматично. Ми їх бачимо — і можемо понести до власника курсу.»

⚠️ Десять відкритих питань — один глибокий. Показати, що список є, прочитати питання 1, рухатись далі. Живий промпт — у кроці 2, там він вартий більше.

---

## 13:50–14:05 · Крок 2: рішення — мапа опцій у plan mode, ADR, ризики (15 хв) · `./workshop/go.sh 2`

🎤
Перш ніж щось обирати, я хочу побачити, *з чого* обираю. Потім хочу, щоб вибір був записаний разом з альтернативами, які я відкинув. І потім — знати, де цей вибір зламається. Це три артефакти, але один ланцюжок міркувань, тому сьогодні це один промпт з контрольною точкою посередині. І це правильний момент показати plan mode, бо дві ідеї — одна й та сама: подивись, перш ніж діяти.

Plan mode — режим Claude Code, у якому ШІ читає файли, запускає команди для дослідження, ставить питання і пише план, але нічого не редагує, доки ви план не схвалите. Вмикається через Shift+Tab, доки в статус-барі не з'явиться «plan mode on»; цикл: manual → accept edits → plan. Можна також стартувати з `claude --permission-mode plan` або поставити `/plan` перед одним промптом. Коли план готовий, є три варіанти: «Yes, and use auto mode», «Yes, manually approve edits», «No, keep planning». Ctrl+G відкриває план у редакторі, щоб поправити руками до схвалення. Документація дає одне правило, коли це потрібно: якщо diff можна описати одним реченням — план не потрібен. Архітектура — протилежність одного речення.

Тепер промпт. Подивіться на блок обмежень: четверо студентів, шість–вісім тижнів, нуль бюджету, без DevOps, фіксований стек. Це найважливіший текст усієї сесії. Без нього ШІ радить «індустріальний стандарт» для компанії на п'ятдесят інженерів. З ним кожна опція оцінюється проти *нашої* ситуації. Далі: «don't choose anything yet» — план і є порівняння, з критерієм, який схиляє кожен вибір, і — цього студенти ніколи не просять — з тим, що мало б змінитися, щоб вибір був іншим. Тільки після того, як я схвалю план, ШІ пише: порівняння як документ, потім по одному Architecture Decision Record на рішення — контекст, опції з плюсами й мінусами для нас, рішення, наслідки, пов'язані історії, — і потім реєстр ризиків. Через місяць, коли хтось спитає «чому SQLite?», відповідь буде у файлі, з відкинутими альтернативами і причиною. Без файлу відповідь — «не пам'ятаю» або «так сказав ШІ», і обидві погані.

💬 **Промпт 2** (спершу перемкнутися в plan mode):

```text
Read docs/analysis/requirements-digest.md and docs/project_context.md.

We are at the design stage. Team context and constraints (this matters more
than "best practices"):
- team: 3–4 students, basic TypeScript / React / Node.js, no DevOps experience;
- deadline: 6–8 weeks until the demo, in parallel with other courses;
- allowed stack: only TypeScript, React or React Native, Node.js. No other languages;
- infrastructure budget: 0 UAH (free tiers); local launch with one command after git clone;
- the code will be worked on with Claude Code, so a predictable structure matters.

First the plan — don't choose anything yet. Which technical decisions must be
made before the code starts, in which order (what depends on what), and which
options exist for each:
0. application architecture style (layered/MVC, clean/hexagonal, modular
   monolith, microservices — and separately for the frontend);
1. platform: web or mobile (React or React Native) — based on the user journey;
2. repository structure (mono/polyrepo, how to split the code);
3. frontend: build, routing, working with server data, styles;
4. backend: framework, validation, error format, API style;
5. data store and ORM, with local launch and free hosting in mind;
6. authentication — taking into account the gap from the digest;
7. concurrency: how to guarantee the spot counter invariants (US-06, US-12);
8. deployment and hosting.
If you lack information for the rating — ask me before writing the plan.

After I approve the plan, write, in this order:

1. docs/analysis/options.md — for each decision, a table of options rated
   against OUR constraints (+ / 0 / −), the main criterion that tips the
   choice, and what would have to change for the choice to be different.
   At the end — a summary table: decision → what it leans toward → main
   criterion → ADR number.

2. docs/adr/NNNN-short-name.md — one file per decision, fixing the choice:
   2–3 options from options.md with trade-offs specifically for this team,
   a recommendation and consequences (what becomes simpler, what becomes
   harder, what we postpone). If you disagree with what options.md leans
   toward — say why. Format:
   # ADR-NNNN: Title
   Status | Context | Options (with pros/cons) | Decision | Consequences | Related stories.
   Add docs/adr/README.md with an index and a rule for when an ADR should be
   written and when not. Write concisely: ADRs are read, not studied.

3. docs/architecture/risks.md — a risk register in three groups: technical,
   product (requirements/user behavior), team (deadlines, skills). For each:
   probability and impact (low/med/high), trigger (how we will notice that
   the risk has fired), mitigation, and where exactly it lives (component /
   ADR). No generic phrases like "bugs are possible". Separately mark the
   risks we consciously accept for the MVP.
   docs/architecture/integrations.md — all external dependencies (Telegram,
   GitHub, hosting, DB): what exactly we take from them, whether it is an
   API integration or just a link/format, what we do if the dependency is
   unavailable.
```

🖥 **Живе демо (3 хв).** Механіка, щоб нічого не імпровізувати:

*Що робить `./workshop/go.sh 1 live`.* Теги — снапшоти тільки для читання; якби Claude написав файл на тегу, ми б редагували відчеплений checkout. Команда створює звичайну гілку `live/step-01` від тегу `step-01` і перемикається на неї. На гілці проєкт рівно такий, як після кроку 1: вимоги, дайджест, перший CLAUDE.md — а `options.md` і ADR ще немає. Claude може зробити крок по-справжньому в пісочниці, яка не чіпає підготовлені теги.

*На сцені:*
1. Термінал у корені репозиторію, на `live/step-01`. `claude --permission-mode plan` — відкривається одразу в plan mode. (Якщо сесія вже відкрита — Shift+Tab, доки бар не скаже «plan mode on»; з auto mode це до трьох натискань.)
2. Вставити промпт 2. 🎤 Поки читає: «Він читає дайджест і контекст. У plan mode він не може записати файл, навіть якби хотів.» Якщо просить дозвіл на команду тільки для читання, як-от `ls`, — дозволити.
3. Якщо ставить питання — відповісти. Очікувані питання й відповіді — у `workshop/plans/02-plan.md` (один курс чи багато? → один семестр; досвід з ORM? → базовий SQL, ORM не було).
4. Коли з'явився план — порядок рішень, опції для кожного, три файли результату: 🎤 «Це контрольна точка. Ctrl+G відкриває план у редакторі; я можу змінити, відхилити або схвалити. Нічого ще не записано. Коли я схвалю, порівняння, яке я схвалив, стане ADR — ШІ не отримає другого шансу „обрати стек" з нуля.» Обрати **No, keep planning**, потім `/exit` — готовий результат уже є на тегу. Якщо є запас часу — «Yes, manually approve edits» і дати йому дві-три хвилини написати options.md і перший ADR.
5. Вийти з пісочниці: `./workshop/go.sh keep` (закомітить, що Claude написав на live-гілці) або `./workshop/go.sh discard`, потім `./workshop/go.sh 2` — продовжуємо з підготовленого результату. Перемикач відмовляється рухатись, поки є незакомічені зміни, тож пропустити цей порядок випадково не вийде.

⚠️ Якщо Claude не стартує або немає мережі: відкрити `workshop/plans/02-plan.md`, сказати «ось план, який він видав», продовжити з тегу. Нічого не втрачаємо.

🎤 **Чому промпт написаний саме так.**
- Блок обмежень: ШІ оцінює для *цієї* команди, а не взагалі. Кожен «−» у результаті вказує на обмеження.
- «In which order (what depends on what)»: рішення мають залежності — авторизація залежить від топології деплою, сховище — від бюджету. План робить порядок явним.
- «What would have to change for the choice to be different»: питання, яке відрізняє розуміння від копіювання. Воно каже, на чому тримається ваше рішення.
- «Ask me before writing»: у plan mode ШІ може спитати, і відповідь стає частиною плану, а не мовчазним припущенням.
- «After I approve the plan, write, in this order»: порівняння → рішення → ризики. ADR пишуться з порівняння, яке ми схвалили; «if you disagree with what options.md leans toward — say why» змушує ШІ сперечатись, якщо його рішення суперечить його ж порівнянню.
- Пункт 7 (конкурентність) виглядає як деталь реалізації. Він у списку навмисно: US-06 sc.3 і US-12 sc.4 роблять його вимогою, і дешевше вирішити зараз, ніж знайти гонку в продакшені.
- «ADRs are read, not studied» — довжина є параметром дизайну. Двосторінковий ADR ніхто не відкриє вдруге.
- *Тригер* і *місце* для кожного ризику: без цього ШІ пише загальні ризики — «можуть бути баги», «треба тестувати». Ризик із тригером і місцем — план; без них — тривога.

🖥 **Показати** `docs/analysis/options.md` (4 хв):
- Таблиця обмежень K1–K8 угорі. 🎤 «Кожна оцінка в цьому документі — проти цих восьми рядків.»
- **§1 стиль архітектури.** П'ять бекенд-стилів: layered (MVC-подібний), fat controllers, clean/hexagonal, модульний моноліт, мікросервіси. Три фронтенд-стилі: pages + hooks + server-state, MVVM/глобальний стор, компоненти з useEffect+fetch. 🎤 «Clean architecture отримує мінус не тому, що погана, — бо відповідає на питання, якого в нас немає. Ми не будемо міняти базу чи транспорт. Мікросервіси отримують два мінуси лише від розміру команди і строків. А на фронтенді глобальний стор дублював би серверний стан, який і є всім станом цього застосунку.» Прочитати рядок «what would change the choice»: десять сутностей або дві команди → модульний моноліт.
- **§6 автентифікація.** П'ять опцій, включно з E — «без auth, ідентичність — Telegram-нік із форми», — позначена неприйнятною зі сценаріями, які вона ламає (US-05 sc.3, US-14 sc.2). 🎤 «ШІ вивів це з дайджесту. Ось у що перетворилась дірка з кроку 1: рішення з опціями.»
- Підсумкова таблиця внизу: рішення → куди схиляється → головний критерій → номер ADR. 🎤 «Кожен рядок став ADR у тій самій сесії. Відкриємо два.»

🖥 **Показати** `docs/adr/` (4 хв). Спершу `README.md`: індекс дев'яти ADR, шаблон і правило («пишемо для фреймворку, бази, хостингу, формату API, auth, структури репозиторію — або для будь-чого, що обговорювали довше десяти хвилин; не для назви змінної»). Потім два ADR детально:
- `0009-architecture-style.md` — 🎤 «Шаруватий моноліт: routes обробляють HTTP, services тримають бізнес-правила, Prisma тримає дані. Clean architecture відкинута з причиною з порівняння. На фронтенді: сторінки, хуки, бібліотека серверного стану. Подивіться на правила внизу: *route ніколи не містить if про статуси чи лічильники; компонент ніколи не викликає fetch напряму.* Саме ці два речення агент-рев'юер архітектури перевірятиме механічно на другому воркшопі.»
- `0007-concurrency.md` — 🎤 «Три опції: перевірка в коді, умовний UPDATE у транзакції, блокування рядка. Опцію A кожен студент пише першою: прочитати лічильник, якщо більше нуля — записати мінус один. Два запити читають 1, обидва пишуть 0, обидва підтверджують. Саме це забороняє US-06 сценарій 3. Опції C на SQLite не існує. Отже B: умовний апдейт, який спрацьовує, лише якщо місця ще є, і перевірка, що змінився рівно один рядок. Псевдокод у ADR; він стане однією функцією в сервісі заявок, а тест на неї — два паралельні підтвердження.»
- Решта — платформа, монорепо, фронтенд, бекенд, сховище, auth, деплой — назвати з індексу. 🎤 «Дев'ять файлів, кожен на сторінку. Один до одного з підсумковою таблицею options.md.»

🖥 **Показати** `docs/architecture/risks.md` та `integrations.md` (3 хв):
- 🎤 «Де це зламається? ШІ тут корисний з дивної причини: у нього немає его щодо рішень, які він щойно записав. Він скаже, що SQLite на безкоштовному тарифі може втратити дані, не захищаючи вибір.» Один технічний, один командний. T2 — «Telegram лідера витікає в публічну відповідь»: тригер — будь-який публічний JSON з цим полем; мітигація — шар серіалізаторів як єдине місце, де збираються відповіді, плюс тест, що поля немає. C4 — «ШІ генерує код, який команда не розуміє»: тригер — рев'ю, де автор не може пояснити рядок; мітигація — правило рев'ю: автор пояснює кожен нетривіальний блок, агент-рев'юер перевіряє відповідність ADR, людина перевіряє розуміння. 🎤 «Другий — про вас. Це головний ризик усього цього способу роботи, і мітигація — звичка, а не інструмент.» Потім розділ «свідомо прийняті для MVP». 🎤 «Без відновлення пароля, один інстанс із SQLite, без rate limiting до першого сигналу про спам. Прийняти ризик свідомо — нормально. Прийняти, не помітивши, — ні.»
- `integrations.md` одним реченням: «У MVP немає жодної API-інтеграції» — Telegram і GitHub є посиланнями і форматами — і таблиця, що буде, якщо кожна залежність недоступна. 🎤 «Це теж рішення, і воно захищає від найпоширенішого розповзання скоупу: „давайте додамо бота".»

🎤 **Техніка, яку назвати.** Коли рекомендація не переконує — не просіть «переконай мене». Спитайте: «за яких обмежень ти порадив би NestJS / clean architecture / опцію B?» Відповідь показує, на чому тримається оцінка, — і саме це питання ви маєте вміти поставити про власний проєкт. (Тим, хто в дискусії захищав свій стек: ось ваше питання.)

---

## 14:05–14:17 · Крок 3: ескіз архітектури, його картинка і перевірка за історіями (12 хв) · `./workshop/go.sh 3`

🎤
Тепер сам ескіз — те, що обіцяє назва воркшопу. Чотири документи, і ключ до промпта в тому, що кожен називає свого *читача*. Overview — для нового члена команди, який має десять хвилин. Доменна модель — для всіх, хто пише код або тести; там ми домовляємось про слова і стани. Контракт API — для фронтенд- і бекенд-розробника, щоб працювати паралельно, не чекаючи одне одного. Модель даних — для того, хто пише схему і міграції. Читач визначає рівень деталізації. Документ без названого читача стає документом, який ніхто не читає.

Діаграми — Mermaid усередині Markdown. Рендеряться в GitHub і в IDE, живуть поруч із текстом, видно в diff пул-реквесту. Діаграма в малювалці застаріває через тиждень; діаграма в репозиторії оновлюється в тому ж коміті, що й код.

Останній абзац промпта — те саме правило, що в кроці 1, застосоване до дизайну: якщо історія не покрита або суперечить іншій — не вирішуй мовчки, запиши у відкриті питання.

Ще одна річ, якої не було в назві: картинка. Чотири markdown-файли — правильно для тих, хто будує систему. Неправильно для власника курсу, для новачка в перший день і для проєктора. Тому п'ятий пункт просить одну самодостатню HTML-сторінку, яка малює те, що кажуть чотири документи. Порядок має значення: картинку просимо останньою і виводимо з тексту, тож у ній не може бути стрілки, якої немає в тексті.

І потім другий промпт у тій самій сесії: перевірка. Пройти кожну історію і сказати, що її реалізує. Результат — матриця трасування: кожна історія → її ендпоїнти, сторінки, сутності, тести. Якщо в історії немає ендпоїнта — архітектура неповна. Якщо в ендпоїнта немає історії — ми будуємо те, чого ніхто не просив. Це окремий промпт навмисно: ШІ, який щойно написав ескіз, тепер має його проаудитувати, історія за історією.

💬 **Промпт 3a** (звичайний режим):

```text
Read docs/analysis/requirements-digest.md and all docs/adr/*.md. Create a sketch of
the DevMatch technical solution in docs/architecture/ — four documents and one
visual page, no application code:

1. overview.md — for a new team member who needs to understand the system in
   10 minutes: C4 level 1 (system context) and level 2 (containers) in mermaid;
   the list of components of each container with a one-phrase responsibility;
   the list of frontend pages mapped to stories; which external systems are
   real integrations and which are just links.
2. domain-model.md — for everyone who writes code or tests: entities, attributes
   with constraints (lengths, formats — from the AC), invariants, and state machines
   for Project, Role, Application in a mermaid stateDiagram with transition conditions.
   Each rule — with a reference to US-xx.
3. api.md — for the frontend and backend developer as a contract: a table
   endpoint → story → who has access → response code; a single error format
   and a dictionary of error codes derived from the Gherkin scenarios (400/401/403/404/409).
   Example request/response bodies — only for 3–4 non-trivial endpoints.
4. data-model.md — for whoever writes the DB schema: tables, fields, types, unique
   constraints, indexes, and separately — which invariants cannot be expressed by the
   schema and must live in the transaction code.
5. system.html — for a team meeting or the course owner: one self-contained HTML
   file (no external dependencies, opens from the file system) that shows the same
   system visually — context, containers with the API layers, the end-to-end
   scenario step by step, the three state machines, pages → stories, the nine
   decisions. Dark and light theme. It is a picture of the markdown documents,
   not a second source of truth: every label on it must be traceable to one of them.

If during the design you see that a story is not covered or contradicts
another — don't resolve it silently, put it in the "Open questions" section
in overview.md.
```

💬 **Промпт 3b** (та сама сесія, після ескізу):

```text
Go through every Gherkin scenario in docs/US-*.md and say which endpoint, which
page and which response code implements it. Write the result to
docs/architecture/traceability.md as a matrix: each story US-01…US-14 →
endpoint(s) → frontend page(s) → entities → key scenarios for tests (from
Gherkin). Add a recommended implementation order (the end-to-end journey first).
At the bottom — a list of stories that are weakly covered, depend on assumptions
from the digest, or where the answer is not obvious — and what to do about it.
Don't resolve contradictions silently: name them.
```

🎤 **Чому промпт написаний саме так.**
- «Read the digest and all ADRs» — ескіз виводиться з уже прийнятих рішень, а не імпровізується. Якщо ескіз суперечить ADR — щось із двох неправильне, і ми дізнаємось зараз.
- Один читач на документ, названий у промпті.
- «Example bodies only for 3–4 non-trivial endpoints» — обмеження деталізації. Без нього отримаєте сорок JSON-прикладів, які ніхто не підтримує.
- «Which invariants cannot be expressed by the schema» — це питання змушує ШІ визнати межі інструментів (і він визнає: немає часткового унікального індексу на SQLite через Prisma).
- «One self-contained file, no external dependencies» — відкривається з файлової системи в будь-якому браузері, у день демо, без мережі. «Not a second source of truth» — коли картинка і текст розходяться, виграє текст, і сторінка каже це у футері.
- Перевірка — другий промпт, а не шостий пункт: «пройди кожен сценарій і скажи, що його реалізує» — це питання аудиту, а аудит, написаний на одному диханні з тим, що аудитується, нічого не знаходить.

🖥 **Показати** (9 хв: спершу картинка, потім по одному-два місця в кожному файлі, потім матриця):
- `open docs/architecture/system.html` (браузер, темна тема; клавіші `1`–`6` перемикають вкладки). Вкладка 1, Context: 🎤 «Два типи людей, одна система. Дві коробки праворуч пунктирні навмисно: посилання, не інтеграції.» Вкладка 2, Containers: 🎤 «Один Node-процес. Усередині API п'ять шарів, і лише одній коробці дозволено торкатися лічильника місць — жирній.» Вкладка 3, Play (або пробіл): 🎤 «Це перетин двох сценаріїв. Крок 6 — транзакція: умовний апдейт — причина, чому два лідери, що змагаються за останнє місце, не можуть виграти обидва.» Вкладка 4, States: 🎤 «Три машини; пунктир між FILLED і APPROVED каже, що вони рухаються в одній транзакції.» Вкладки 5 і 6 пропустити, якщо не питають, — це сторінки й ADR картками. Перейти в IDE: 🎤 «Усе, що ви бачили, — підпис з одного з цих чотирьох файлів. Прочитаємо місця, яких картинка показати не може.»
- `overview.md`: C4-діаграма контексту. 🎤 «Дві стрілки йдуть до Telegram і GitHub, а примітка під діаграмою каже: це не інтеграції. Ми ніколи не викликаємо їхні API. Ми валідуємо формат і рендеримо посилання. Студенти — і ШІ — обожнюють малювати зайві стрілки; цей сам себе впіймав.» Потім sequence-діаграма наскрізного сценарію: студент подає заявку, лідер підтверджує, студент бачить Telegram. 🎤 «Це точка, де зустрічаються два користувацькі сценарії з контексту. Вимоги назвали її перетином; ось вона як послідовність.»
- `domain-model.md`: стейт-машини Application і Role поруч. 🎤 «Один перехід — approve — змінює дві сутності: статус заявки і лічильник ролі, можливо, й статус ролі. Один перехід, дві сутності, отже одна транзакція. Це ADR-0007 проявляється в моделі.» Потім таблиця «хто що бачить». 🎤 «Чотири колонки, і кожен ✘ у ній — тест безпеки.»
- `api.md`: таблиця ендпоїнтів (метод, шлях, історія, доступ, коди), єдиний формат помилки, словник кодів. 🎤 «П'ятнадцять кодів помилок, кожне повідомлення простежене до сценарію, з якого прийшло. Фронтенд показує `error.message` як є. І подивіться на `GET /me/applications`: поле `leadTelegram` *відсутнє* — не null, відсутнє, — якщо заявка не APPROVED. Це US-14 сценарій 2, і це один рядок у контракті, а не фіча.»
- `data-model.md`: таблиця «інваріанти, які схема не може виразити». 🎤 «Найчесніша частина всього ескізу. Prisma на SQLite не має enum і часткових унікальних індексів, тож „одна активна заявка на користувача і роль" живе в транзакції, а не в базі. Документ каже де.»
- `traceability.md`: матриця, потім «рекомендований порядок реалізації». 🎤 «Спершу наскрізний шлях: створити, опублікувати, побачити, подати, підтвердити. Після п'яти історій увесь сценарій можна демонструвати. Потім решта. Це план для другого воркшопу.»
- **Останній рядок таблиці «слабко покриті».** 🎤 «US-08 каже: коли набір закрито, проєкт у каталозі отримує бейдж „Набір закрито". US-09 каже: каталог показує лише PUBLISHED. Закритий проєкт — не PUBLISHED, отже його немає в каталозі, отже бейдж там показати неможливо. Дві історії, написані однією людиною, суперечать одна одній. Ми не побачили цього в кроці 1. Побачили, коли перевірили архітектуру за кожною історією. Ось навіщо існує перевірка — і відповідь не належить ШІ. Це питання до власника курсу.»

🎤 **Техніка, яку назвати.** Подвійна перевірка. Ніколи не дозволяйте тому, що написало дизайн, сертифікувати його в тій самій відповіді. Спитайте окремо: «пройди кожен сценарій і скажи, що його реалізує; де відповідь неочевидна — познач». Дірки з'являються.

---

## 14:17–14:26 · Кроки 4 і 5: Claude для команди + скелет (9 хв) · `./workshop/go.sh 4`, потім `5`

🎤
Досі ШІ працював на одну людину. У команді з чотирьох у кожного свій термінал і своя сесія, і питання стає таким: як змусити всі чотири сесії працювати за одними правилами і бачити одну архітектуру? Відповідь: документи, які ми щойно написали, *і є* пам'яттю ШІ. `CLAUDE.md` їх не повторює; він на них вказує і каже, що читати перед яким типом задачі. Скіли — повторювані процеси команди, записані один раз: «ось як ми беремо історію в роботу». Агент — друга пара очей з вузькою задачею: порівняти diff з ADR.

Це налаштування, на якому більшість команд зупиняється. Решта цього кроку — те, що вони відкривають через місяць, тож вмикаємо сьогодні. Три групи:

1. **Інструкції з областю дії.** `CLAUDE.md` — для всіх, завжди. `.claude/rules/*.md` зі списком `paths:` — для того, що важливо лише коли торкаєшся цієї папки: конвенції API завантажуються, коли відкриваєш файл в `apps/api/`, а не коли пишеш React-компонент. Так CLAUDE.md лишається на сімдесят рядків. `CLAUDE.local.md` — особисті нотатки, в gitignore.
2. **Запобіжники, що не залежать від читання.** Permissions у `settings.json` кажуть, що запускається без запиту, а що ніколи. Хук сильніший за правило: правило — порада, хук — примус. Наш блокує будь-яке редагування вхідних документів власника курсу і каже ШІ, куди натомість записати проблему.
3. **Паралельність.** Одна історія на worktree: `claude -w us-06` дає окремий checkout і гілку, тож історія для API і історія для web не б'ються за одні файли. Fork копіює розмову, щоб спробувати два дизайни з одного контексту і лишити кращий. Checkpoints дозволяють відкотити код і розмову, коли експеримент пішов не туди.

Потім скелет. Усе в ньому випливає з документів: структура папок з ADR-0009, схема з моделі даних, схеми валідації з доменної моделі, обробник помилок з контракту API. Промпт забороняє бізнес-логіку. Сенс скелета в тому, що другий воркшоп починається з `pnpm install && pnpm dev`, а не з дня налаштувань.

💬 **Промпт 4** (звичайний режим):

```text
Set up this repository for a team of 3–4 developers working with Claude Code.
The code structure will be as described in docs/adr/0002-repo-structure.md
(pnpm monorepo: apps/web, apps/api, packages/shared).

1. Update CLAUDE.md: the project's purpose in one paragraph; the stack and commands
   (dev/typecheck/test); a documentation map — what to read before which type of
   task (new story → traceability + api + domain-model; schema change →
   data-model + ADR); code rules that follow from the ADRs (error format,
   validation via shared schemas, transactions for counters); definition of
   done for a story. Don't copy the contents of docs/ into CLAUDE.md — reference them.

2. Create skills in .claude/skills/<name>/SKILL.md:
   - implement-story: takes a story number (US-xx), reads it from docs/,
     finds the row in traceability.md, proposes a plan (endpoint, page,
     schema, tests from Gherkin), waits for approval, then implements and updates
     traceability.
   - adr: creates a new ADR from the template in docs/adr/README.md with the next
     number, requires at least 2 alternatives.
   - check-story: checks whether the story's implementation covers every AC and every
     Gherkin scenario; the result is a covered/not covered table with references
     to code and tests.

3. Create the agent .claude/agents/architecture-reviewer.md: read-only, checks the
   diff against docs/adr/ and docs/architecture/, reports deviations with a
   reference to the specific ADR/section, doesn't comment on style.

4. Create .claude/settings.json with permissions for pnpm commands (install, dev,
   typecheck, test, lint, prisma generate/migrate) and read-only git commands.

5. Create .claude/rules/ with path-scoped conventions that load only when a file in
   that folder is touched: api.md (paths apps/api/**: feature = route + service +
   serializer, ApiError usage, the ADR-0007 transaction pattern verbatim, test rules),
   web.md (paths apps/web/**: pages / queries / api client, forms with shared schemas,
   accessible markup so Playwright can locate by role), input-docs.md
   (docs/project_context.md and docs/US-*.md are read-only input; problems go to
   "Open questions").

6. Add a PreToolUse hook for Edit|Write in .claude/settings.json that blocks changes
   to the input documents: a small Node script in .claude/hooks/ with no
   dependencies, exit code 2 and a one-sentence explanation on stderr.

7. Add .claude/worktrees/ and CLAUDE.local.md to .gitignore, so each developer can
   run one story per worktree (claude -w us-06) and keep personal notes out of git.
   Mention both, in one line each, in the "Working with Claude" section of CLAUDE.md.

Write the skills and CLAUDE.md in English (the tool's convention), concisely.
```

🎤 **Чому промпт написаний саме так.**
- Пункти 1–4 — файли, потрібні кожній команді; 5–7 — ті, що продовжують працювати, коли ніхто не перечитує CLAUDE.md. Просимо все одним промптом: ШІ вже має ADR і архітектуру в контексті, і правила, які він пише, походять із них.
- «Verbatim» для патерну ADR-0007: єдиний шматок коду, який ми хочемо скопійованим, а не перевинайденим, живе в правилі поруч із файлами, які його використають.
- «No dependencies» для хука: він має працювати на свіжому клоні до `pnpm install`.
- «One line each in CLAUDE.md»: можливості видно з єдиного файлу, який читають усі; деталі — у документації інструмента.

🖥 **Показати** (4 хв, `go.sh 4`):
- `CLAUDE.md` v2 — таблиця мапи документації («реалізувати історію → прочитати історію, її рядок у traceability, api.md, domain-model.md»), правила з ADR, definition of done, останні два рядки «Working with Claude». 🎤 «Сімдесят рядків. Якщо росте далі — щось належить у docs, у правило або в скіл.»
- `.claude/skills/implement-story/SKILL.md` — прочитати чотири заголовки вголос: read, don't assume → plan and *wait* → implement → close. 🎤 «Скіл — не магія. Це markdown-файл із процесом. Рядок „wait for confirmation" — та сама контрольна точка, що й plan mode: людина схвалює до того, як пишеться код.» Показати frontmatter: `argument-hint` — що бачить користувач після `/implement-story`, `$ARGUMENTS` — куди потрапляє `US-06`.
- `.claude/rules/api.md` — frontmatter `paths:` і блок транзакції. 🎤 «Цей файл невидимий, доки ви не відкриєте щось в apps/api. Тоді він у контексті, з точним кодом, який ми хочемо для лічильника.»
- `.claude/settings.json` — списки `allow` і `deny`, потім блок `hooks`; `.claude/hooks/protect-input-docs.mjs` — двадцять рядків. 🎤 «Exit code 2 означає: заблоковано, а текст зі stderr повертається ШІ як причина. Правило — порада; це — примус.» Якщо ранкова перевірка пройшла — зробити наживо (30 с): у `claude` набрати `add the sentence "test" to docs/US-INIT-1.md` і показати відмову.
- `.claude/agents/architecture-reviewer.md` — чекліст: валідація через shared, помилки з задокументованими кодами, без бізнес-логіки в routes, лічильники лише в транзакціях, без витоку Telegram. 🎤 «Він перевіряє проти ADR, а не проти смаку.»

🎤 **Огляд можливостей** (2 хв, на екрані як таблиця — читати ліву колонку, по одному реченню на рядок; права колонка — студентам після). Звірено з документацією Claude Code 2.1.x.

| Можливість | Що це | Увімкнути з першого дня, бо… | У цьому репозиторії |
|---|---|---|---|
| `CLAUDE.md` | Читається на старті кожної сесії. `@шлях` імпортує інші файли (до 4 рівнів). `CLAUDE.local.md` — особисті нотатки, додайте в `.gitignore` самі. | Єдине, що читає кожна сесія в команді. | v2 на `step-04`, v3 після кроку 6 |
| `.claude/rules/*.md` | Інструкції зі списком glob `paths:`; підвантажуються, коли читається або редагується відповідний файл. Без `paths:` — завжди. | CLAUDE.md лишається коротким; правила для папки діють лише там. | `api.md`, `web.md`, `input-docs.md` |
| Скіли | `.claude/skills/<name>/SKILL.md`; `/name args` або викликає Claude за описом. Frontmatter: `argument-hint`, `allowed-tools`, `disable-model-invocation`, `user-invocable`, `context: fork` (у субагенті без історії розмови). Допоміжні файли в папці — за потреби. | Процеси команди, записані раз, працюють однаково в чотирьох терміналах. | `implement-story`, `adr`, `check-story`; `unit-tests`, `e2e-tests` з кроку 6 |
| Субагенти | `.claude/agents/<name>.md` з `tools`, `model`, `isolation: worktree`; власне контекстне вікно. `/agents` — список; `claude --agent <name>` — сесія як агент. | Рев'юер з вузьким завданням і read-only інструментами не може «полагодити» те, що рев'юїть. | `architecture-reviewer` |
| Хуки | `settings.json` → `hooks`; події `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`; matcher `Edit\|Write`; exit 2 блокує і повертає stderr Claude. `/hooks` показує їх. | Примус замість поради: форматери, заборонені шляхи, «запусти typecheck перед тим, як зупинитись». | `protect-input-docs.mjs` |
| Permissions | `permissions.allow` / `deny`; режими `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`; Shift+Tab перемикає; `--permission-mode`. `settings.local.json` для особистих перевизначень. | Без запиту на `pnpm test`, ніколи — на `git push --force`: він заборонений. | allow pnpm + read-only git; deny force push, `rm -rf`, `.env` |
| Plan mode | Тільки читання, доки не схвалите план; `claude --permission-mode plan`, `/plan`, Shift+Tab. | Рішення отримують справжній момент схвалення (крок 2). | `workshop/plans/02-plan.md` |
| Worktrees | `claude -w <name>` → checkout у `.claude/worktrees/<name>`, гілка `worktree-<name>`; `claude -w <name> --resume` повертає; на виході Claude питає, лишити чи видалити. Не в gitignore автоматично. | Одна історія на worktree: паралельна робота, без напівготових файлів у спільному checkout. | рядок у `.gitignore` |
| Форки й гілки | `/fork` копіює розмову в нову фонову сесію; `/branch` галузить на місці; `claude --continue --fork-session` у CLI; `/subtask <task>` запускає субагента, що успадковує всю розмову. | Спробувати два дизайни з одного контексту, лишити один. | — |
| Checkpoints | `/rewind` або Esc Esc: повернути код, розмову або обидва до ранішої точки. Зміни shell-командами не відстежуються. | Експерименти стають дешевими. | — |
| Пам'ять | Автопам'ять на проєкт у `~/.claude/projects/<project>/memory/` з індексом `MEMORY.md`; `/memory` редагує файли; «add this to CLAUDE.md» для командних фактів. | Факти переживають сесію; командні — у репозиторій, особисті — локально. | — |
| Контроль контексту | `/context` показує, що заповнює вікно; `/compact <focus>`; `/clear`; `@шлях` згадати файл; `!cmd` виконати shell-команду і лишити вивід. | Довгі сесії деградують; знайте, коли стискати. | — |
| MCP | `.mcp.json` у репозиторії, `claude mcp add --transport http <name> <url> --scope project`; схвалення при першому використанні; `/mcp`. | Інструменти, які модель може викликати: браузер, трекер, база. Playwright MCP — природний для цього стеку. | ще ні — додати, коли історія цього потребує |
| Headless / CI | `claude -p "…" --output-format json`; GitHub Action `anthropics/claude-code-action` (`/install-github-app`), тригер `@claude` у PR. | `/check-story US-06` коментарем до кожного PR. | кандидат для другого воркшопу |
| Плагіни | `/plugin`, маркетплейси: скіли + агенти + хуки, запаковані для команди чи курсу. | Коли три репозиторії мають однакове налаштування. | — |
| Фон | Ctrl+B відправляє довгу команду чи агента у фон; `/loop` для повторюваних промптів; `/statusline`. | Тести біжать, поки ви працюєте. | — |

⚠️ Не демонструвати worktrees чи форки наживо під час кроку; огляд — таблиця і речення на рядок. Якщо наприкінці лишиться час, `claude -w demo` — безпечне хвилинне демо: створює worktree, ви `/exit`, відповідаєте «remove».

💬 **Промпт 5** (звичайний режим):

```text
Create the project skeleton from docs/adr/ and docs/architecture/. No business logic.

- Root: pnpm workspaces, package.json with dev / build / typecheck / test scripts
  that work for all packages; tsconfig.base.json; .env.example; README
  with launch instructions in 3 commands.
- packages/shared: zod validation schemas and status enums from domain-model.md
  (telegram username with "@" normalization, GitHub URL, length limits for project
  and role, Project/Role/Application statuses); vitest tests, where each test case
  is named after the Gherkin scenario it comes from (US-01 sc.3, etc.).
- apps/api: Express 5 + TypeScript (tsx for dev); prisma/schema.prisma from
  data-model.md; src/app.ts with /api/health, validation middleware via shared
  and an error handler in the format from api.md; empty routes/ services/ folders with
  a README explaining what goes where.
- apps/web: Vite + React + TypeScript; React Router with stubs for all pages
  from overview.md (each — a heading and a link to the story); an api client with
  the base URL from env; no styles except a minimal layout.

After creating it, run pnpm install, pnpm typecheck, pnpm test and fix everything
that fails. Show which files were created and what exactly was verified.
```

🖥 **Показати** (3 хв, `go.sh 5`):
- `./workshop/go.sh diff 4 5` — близько п'ятдесяти файлів. 🎤 «І жодного рядка бізнес-логіки. Скелет походить з наших ADR, а не з уявлення ШІ про типовий проєкт.»
- `packages/shared/src/__tests__/validation.test.ts` — назви тестів: `US-01 sc.3 "orest lead!" (forbidden chars) and "abc" (< 5 chars) are rejected`. 🎤 «Перший місток від Gherkin до коду. Правило з критеріїв приймання стало `expect`.»
- `apps/api/prisma/schema.prisma` поруч із `docs/architecture/data-model.md`. 🎤 «Збігаються один до одного. Якщо колись розійдуться — виграє документ, бо документ переглядали люди.»
- Термінал: `pnpm typecheck && pnpm test`, зелено. 🎤 «Останній рядок промпта каже: запусти і виправ, що впало. „Виглядає правильно" — не перевірка.»

⚠️ Не запускати `pnpm dev` наживо, якщо вранці не працювало; тестів достатньо.

---

## 14:26–14:31 · Крок 6: техніка тестування і перші тести (5 хв) · `./workshop/go.sh 6`

🎤
Скелет є. Перед першою історією вирішуємо, як ми *доводимо*, бо перша історія будуватиметься на тому ґрунті, який є зараз, — перевіреному чи ні. Хороша новина: Gherkin-сценарії вже є тестами в масці. Given — підготовка, When — дія, Then — перевірки. Техніка — зробити це буквальним: один сценарій — один тест, і тест *названий за сценарієм*: `US-06 sc.3 approve when no spots left → 409`. Таке іменування — найдешевше трасування з можливих, і саме воно дозволяє скілу check-story грепати покриття.

Промпт має той самий порядок, що й архітектурні кроки: спершу документ стратегії, потім інфраструктура, потім тести для того, що вже існує. І закінчується «run them and fix what fails». Тести, які лише написані, не рахуються.

💬 **Промпт 6** (звичайний режим):

```text
Read docs/architecture/ (especially api.md, domain-model.md, traceability.md),
docs/adr/0007-concurrency.md, CLAUDE.md and the current code in apps/ and packages/.

1. Write docs/architecture/testing.md — the testing strategy for THIS project:
   the test pyramid with the share of tests per level and why; the technique
   for turning a Gherkin scenario into a test (naming convention "US-xx sc.N …",
   one scenario = one test, assert the contract not the implementation);
   how API tests get a real database (SQLite test DB, reset per test, serial
   files); how the race condition from ADR-0007 is tested; rules for e2e
   (one spec per journey, seed via API, locate by role, no sleeps); what we
   deliberately do not test; commands; the tests part of definition of done.

2. Set up the infrastructure: vitest + supertest for apps/api with a test
   database and a resetDb() helper; vitest + jsdom + Testing Library for
   apps/web; Playwright at the repo root with a config that starts both dev
   servers. Add pnpm scripts (test, test:e2e) and gitignore entries.

3. Write tests for the code that already exists, following the strategy:
   - apps/api: health endpoint; 404 in the documented error format; malformed
     JSON → 400 VALIDATION_ERROR; validateBody middleware (details per field,
     body replaced by the parsed value); the Prisma schema's unique constraints
     (User.email, Role projectId+name) against the real test DB.
   - apps/web: the NotFound page and the page stub render what the router
     promises (title, story references, catalog link).
   - e2e: one smoke journey — open /, see the navigation, see "API: ok".
   Name tests after the scenario or acceptance criterion they come from; for
   infrastructure tests, name them after the document section they protect.

4. Create two skills: /unit-tests US-xx (unit + API tests from the story's
   scenarios, using the helpers, one test per scenario, reports a coverage
   table) and /e2e-tests <journey> (Playwright spec for a journey across
   several stories, seeds via API). Update CLAUDE.md (commands, documentation
   map, skills) and settings permissions.

Run pnpm typecheck, pnpm test and pnpm test:e2e and fix whatever fails before
reporting. Report what was created and what each command verified.
```

🖥 **Показати** (3 хв):
- `docs/architecture/testing.md` → «From Gherkin to a test» і таблиця-приклад відображення. 🎤 «Більшість тестів історій у цьому проєкті — API-тести, бо кожен критерій тут сформульований як поведінка сервера: код статусу, лічильник, поле, якого немає в JSON. API-тест перевіряє саме це проти справжнього SQLite-файлу, без моків, за десять мілісекунд. End-to-end — для сценаріїв-подорожей: два-три всього, не по одному на історію.» Прогорнути до фрагмента race-тесту: два підтвердження в `Promise.all`, очікуємо один 200 і один 409. 🎤 «Єдиний тест, який може довести ADR-0007. Послідовний не може.»
- `apps/api/tests/app.test.ts` і `tests/db.test.ts` — тести для скелета: формат помилки з api.md, middleware валідації з повідомленням з US-01, унікальні обмеження з data-model.md. `./workshop/go.sh diff 5 6` — 🎤 «Двадцять чотири тести тепер, тринадцять було, і додані захищають документи, а не лише код.»
- `e2e/smoke.spec.ts` — сімнадцять рядків; конфіг Playwright стартує обидва сервери. 🎤 «Лише подорожі. Жодних повідомлень валідації через браузер.»
- `.claude/skills/unit-tests/SKILL.md` — таблиця плану (сценарій → рівень → arrange, act, assert) іде *до* будь-якого коду, а звіт — таблиця покриття. 🎤 «На другому воркшопі цикл на історію: `/implement-story` → `/unit-tests` → `/check-story`.»

🎤 **Техніка додому.** «Перелічи кожен Gherkin-сценарій в US-06 і напиши *назву* тесту для кожного. Сам тест поки не пиши.» Спершу назви, потім код. Назви — це план, а назва, яку ви не можете написати, — сценарій, якого ви не розумієте.

⚠️ Не запускати `pnpm test:e2e` наживо, якщо вранці не пройшло; `pnpm test` (близько трьох секунд) показувати безпечно.

---

## 14:31–14:43 · Брейкаут-кімнати (12 хв)

🎤 «Тепер ви. Кімнати по троє-четверо. Вісім хвилин, щоб зробити ескіз архітектури на тій самій висоті, що ми щойно використали, — для одного з двох: вашого фінального проєкту, якщо команда сформована, або для розширення DevMatch однією з персон, які ми пропустили: ментор, викладач курсу, модератор, Telegram-сповіщення, нетехнічний студент. Користуйтесь Claude або чим маєте; промпт у файлі. Шаблон — п'ять пунктів: сутність зі станами, компоненти, яких вона торкається, одне рішення з відкинутою альтернативою і чому, один ризик із тригером, одне питання до власника курсу. Одна жорстка вимога: кожен пункт вказує на вимогу або обмеження. „Ми обрали X, бо він популярний" не приймається. І ті, хто в дискусії казав „почну з коду" — ваше завдання сьогодні закінчується до коду.»

🖥 Показати `workshop/breakout.md`, читаючи завдання. Таймер видимий. Повідомлення у всі кімнати на шостій хвилині.

**Share-out (4 хв, по хвилині на кімнату).** Кожна кімната: одна сутність або стан, одне рішення з відкинутою альтернативою, один ризик з тригером. Ви коментуєте одним реченням на кімнату: який пункт пішов би в ADR, а який — питання до власника курсу. Тримати темп; дві кімнати, якщо часу мало.

---

## 14:43–14:50 · Підсумок і передача естафети (7 хв)

🎤
Повернімось до початку. 🖥 Відкрити збережені відповіді з дискусії. 🎤 «Ви казали: почати з коду, попросити ШІ згенерувати, намалювати схему, обрати стек. Подивіться, де кожна з цих відповідей опинилась сьогодні. „Обрати стек" — крок 2, і це була не одна відповідь, а таблиця опцій проти восьми обмежень. „Намалювати схему" — крок 3, і в схеми з'явився читач. „Попросити ШІ згенерувати" — так, шість разів, але кожного разу з контекстом, обмеженнями, конкретним артефактом і перевіркою. А „почати з коду" — крок 5, і код виявився останнім, і в ньому не було бізнес-логіки.»

Що ми зробили шістьма промптами: аналіз, який підняв десять відкритих питань, і найбільше з них — ніхто не написав, як користувач входить. Одна сесія в plan mode, яка дала мапу опцій проти наших обмежень — схвалену до того, як з'явився файл, — дев'ять рішень, записаних з відкинутими альтернативами, і реєстр ризиків з тригерами. Ескіз архітектури з діаграмами, доменна модель з трьома стейт-машинами, контракт API, де кожен код помилки простежений до сценарію, модель даних, чесна щодо того, чого база не може забезпечити, і матриця трасування, яка впіймала дві історії, що суперечать одна одній. Налаштування Claude Code, щоб четверо працювали за одними правилами, із запобіжниками, які тримають, навіть коли ніхто їх не перечитує, і картинка системи для тих, хто не читатиме документів. Скелет, який проходить перевірки. І техніка тестування, яка перетворює Gherkin на назви тестів.

Для вашого проєкту: ті самі шість промптів у `workshop/prompts/`. Міняєте дві речі — папку `docs/` і блок обмежень. Решта переноситься.

Три речі, яких ШІ за вас не зробить, і кожну ми сьогодні бачили:
1. Він не знає ваших обмежень, доки ви їх не назвете. Промпт 2 наполовину складається з обмежень.
2. Він не піде до власника курсу з відкритим питанням. Дірка з авторизацією в кроці 1 і суперечність US-08/US-09 у кроці 3 — ваші.
3. Він не володіє рішенням. План схвалюєте ви; ADR підписуєте ви. Plan mode існує саме для того, щоб схвалення було справжнім моментом, а не формальністю.

Другий воркшоп стартує з `main` цього репозиторію: `/implement-story US-01`, далі порядок із матриці трасування — спершу наскрізний шлях. Тести з Gherkin через `/unit-tests`, покриття через `/check-story`, рев'ю агентом-рев'юером архітектури. Принесіть питання до власника курсу; частина вже записана в overview.

Питання. Посилання на репозиторій — у чат.

---

## Запасні варіанти

- **Claude не стартує / немає мережі:** увесь воркшоп іде з тегів без живого промпта. Plan mode показуємо через `workshop/plans/02-plan.md` (план) і `step-02` (результат).
- **Дискусія затягнулась (понад 8 хв):** зрізати друге питання; відповіді на перше — у чат, не вголос; «місток» скоротити до принципу «контекст → обмеження → запит → перевірка → виправлення».
- **Відставання 5+ хв після кроку 3:** крок 2 — без живого демо, показати файл плану, options §1 і лише ADR-0007 (8 хв); крок 3 — вкладки 1 і 3 `system.html`, потім матриця трасування і суперечність US-08/US-09 (6 хв); кроки 4–5 — огляд можливостей лише таблицею (без файлів), CLAUDE.md v2 і `diff 4 5` (4 хв); крок 6 — лише розділ «From Gherkin to a test» у testing.md і лічба тестів 24 проти 13 (2 хв).
- **Відставання 10+ хв:** брейкаут скорочується до 6 + 3 хв; share-out з двох кімнат на ваш вибір.
- **Лишився час:** дати plan mode дописати options.md і перший ADR на `live/step-01`; або демо хука і `claude -w demo` з кроку 4; або повернутись до відповідей дискусії детальніше.
