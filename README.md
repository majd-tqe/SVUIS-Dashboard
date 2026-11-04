# SVUIS Dashboard

[العربية](#العربية) | [English](#english)

## العربية

واجهة غير رسمية لطلاب الجامعة الافتراضية السورية، مبنية باستخدام React وTypeScript وVite. تتطلب تشغيل مشروع SVUIS API بشكل منفصل.

> **ملاحظة:**  
> هذا مشروع مستقل وغير رسمي وليس للجامعة أي علاقة به

- النسخة التجريبية: [svuis.duckdns.org](https://svuis.duckdns.org/)
- مشروع الـ API: [majd-tqe/SVUIS-API](https://github.com/majd-tqe/SVUIS-API)

### طريقة عمل المشروع

يتفاعل الطالب مع الواجهة في المتصفح ويسجّل الدخول بحساب الجامعة. ترسل الواجهة الطلبات إلى مشروع SVUIS API، الذي يتواصل مع نظام الجامعة ويعيد البيانات لعرضها، مثل الملف الشخصي والعلامات والامتحانات والدفعات والمحاضرات. تستخدم الواجهة جلسة يديرها الـ API، ولا تحفظ كلمة المرور في المتصفح.

### التشغيل المحلي

يتطلب المشروع Node.js 20 أو أحدث وnpm (يستخدم الفحص الآلي Node.js 24). من داخل مجلد الواجهة:

```bash
npm ci
npm run dev
```

شغّل الـ API على `http://localhost:4000`؛ تقوم Vite بتمرير طلبات `/api` إليه أثناء التطوير. الواجهة متاحة على `http://localhost:5173`.

### البناء والنشر

```bash
npm run build
npm run preview
```

تستخدم الواجهة مسارات عادية عند البناء الافتراضي، ويجب ضبط الخادم لإعادة مسارات الواجهة إلى `index.html`. يستخدم بناء GitHub Pages مسارات `#` حتى تعمل إعادة تحميل الصفحات على الاستضافة الثابتة. استخدم HTTPS في الإنتاج. `npm run preview` يعرض البناء محلياً فقط ولا يوفّر وكيل API للإنتاج.

### GitHub Pages

النشر الحالي على الـVPS وليس على GitHub Pages. يوجد workflow اختياري في `.github/workflows/pages.yml` يُشغّل يدويًا فقط؛ لن يُنشر الموقع تلقائيًا عند رفع الكود. إذا قررت استخدامه لاحقًا، اختر **GitHub Actions** في Settings → Pages → Build and deployment → Source وشغّله من Actions. يستخدم البناء مسارات أصول نسبية، لذا يعمل داخل مسار مستودع مثل `https://USER.github.io/REPOSITORY/`.

**مهم: نشر الواجهة وحده لا يجعل تسجيل الدخول يعمل.** GitHub Pages لا يوفر وكيلاً لخدمة API، والـ API الحالي يستخدم جلسة cookie ولا يسمح حاليًا بالطلبات من أصل GitHub Pages المختلف. قبل الاستخدام الفعلي يلزم حل آمن للاتصال والجلسات، مع مراعاة CORS وCSRF وقيود المتصفح على ملفات الارتباط للجهات الخارجية. لا يكفي تغيير رابط الـ API وحده، وقد تمنع بعض المتصفحات ملفات الارتباط عبر المواقع حتى بعد إعداد الخادم.

بعد تجهيز حل آمن، يمكن إعداد متغير المستودع `VITE_API_BASE_URL` في Settings → Secrets and variables → Actions → Variables، مثل `https://example.com/api/v1`، ثم إعادة تشغيل workflow. يُضمّن Vite هذا العنوان في البناء؛ لا تضع كلمات مرور أو أسرارًا في أي متغير يبدأ بـ `VITE_`. عند تركه فارغًا تستخدم الواجهة `/api/v1` على نفس الأصل، كما في التطوير المحلي أو خلف وكيل عكسي.

عند نشر الواجهة مع الـ API تحت أصل واحد، اضبط وكيلاً عكسياً لتمرير `/api/` إلى الخدمة. يُشغَّل فحص البناء الموجود في `.github/workflows/ci.yml` عند إرسال تغييرات إلى المستودع.

---

## English

An unofficial dashboard for Syrian Virtual University students, built with React, TypeScript, and Vite. It requires the separate SVUIS API project.

> **Note:**  
> This is an independent, unofficial project and is not affiliated with the university.

- Live demo: [svuis.duckdns.org](https://svuis.duckdns.org/)
- API project: [majd-tqe/SVUIS-API](https://github.com/majd-tqe/SVUIS-API)

### How it works

The student uses the dashboard in a browser and signs in with their university account. The dashboard sends requests to SVUIS API, which communicates with the university system and returns data to display, such as the student's profile, grades, exams, payments, and classes. The dashboard uses a session managed by the API and does not store the password in the browser.

### Local setup

The project requires Node.js 20 or later and npm (the automated build uses Node.js 24). From the frontend directory:

```bash
npm ci
npm run dev
```

Run the API at `http://localhost:4000`; Vite proxies `/api` requests to it during development. The frontend is available at `http://localhost:5173`.

### Build and deployment

```bash
npm run build
npm run preview
```

The default build uses regular routes; configure the web server to serve `index.html` for frontend routes. The GitHub Pages build uses `#` routes so that reloading pages works on static hosting. Use HTTPS in production. `npm run preview` only serves the build locally and does not provide a production API proxy.

### GitHub Pages

The current deployment runs on a VPS, not GitHub Pages. The optional `.github/workflows/pages.yml` workflow is manually triggered only; uploading the code will not automatically publish the site. To use it later, choose **GitHub Actions** under Settings → Pages → Build and deployment → Source, then run it from Actions. The build uses relative asset paths and can run under a repository path such as `https://USER.github.io/REPOSITORY/`.

**Important: publishing the frontend alone will not make login work.** GitHub Pages does not provide an API proxy, and the current API uses a session cookie and does not allow requests from the different GitHub Pages origin. A secure connection and session solution is required, considering CORS, CSRF, and browser restrictions on third-party cookies. Changing the API URL alone is insufficient, and some browsers may block cross-site cookies even after the server is configured.

Once a secure solution is in place, set the repository variable `VITE_API_BASE_URL` under Settings → Secrets and variables → Actions → Variables, for example `https://example.com/api/v1`, and rerun the workflow. Vite embeds this URL in the build; never put passwords or secrets in variables prefixed with `VITE_`. When empty, the frontend uses `/api/v1` on the same origin, as in local development or behind a reverse proxy.

When hosting the frontend and API on the same origin, configure a reverse proxy to forward `/api/` to the API. The `.github/workflows/ci.yml` workflow checks the build when changes are pushed to the repository.
