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

تستخدم الواجهة مسارات عادية، ويجب ضبط الخادم لإعادة مسارات الواجهة إلى `index.html`. استخدم HTTPS في الإنتاج. `npm run preview` يعرض البناء محلياً فقط ولا يوفّر وكيل API للإنتاج.

يمكن ضبط عنوان الـ API عبر `VITE_API_BASE_URL` وقت البناء. عند تركه فارغًا تستخدم الواجهة `/api/v1` على نفس الأصل. يُضمّن Vite المتغير في البناء؛ لا تضع كلمات مرور أو أسرارًا في أي متغير يبدأ بـ `VITE_`.

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

The frontend uses regular routes; configure the web server to serve `index.html` for frontend routes. Use HTTPS in production. `npm run preview` only serves the build locally and does not provide a production API proxy.

Set `VITE_API_BASE_URL` at build time to configure the API URL. When empty, the frontend uses `/api/v1` on the same origin. Vite embeds this variable in the build; never put passwords or secrets in variables prefixed with `VITE_`.

When hosting the frontend and API on the same origin, configure a reverse proxy to forward `/api/` to the API. The `.github/workflows/ci.yml` workflow checks the build when changes are pushed to the repository.
