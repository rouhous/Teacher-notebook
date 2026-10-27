# دفتر المعلم المدرسي — School Teacher Notebook

هذه مساحة تطوير مستقلة على الفرع `school-edition-staging`، منسوخة من النسخة الحالية دون تعديل `main`. **ليست نسخة منشورة ولا نظام حسابات مفعّلًا بعد**.

## الثوابت
- تبقى النسخة العامة ذاتية الخدمة دون تغيير.
- حساب المشرف الأول: `rouhous@gmail.com`، ويجب التحقق من هوية Google الموثقة على الخادم، لا من نص البريد القادم من المتصفح.
- مدرستان: ذكور / إناث، مع قائمة معلمين مستقلة لكل مدرسة.
- كل حساب معلم في حالة `pending` حتى موافقة المشرف.
- لا يتم تحميل أي سجلات طلاب قبل تحقق الخادم من حساب المستخدم وصلاحياته.
- حفظ ملفات الطلاب في مخزن خاص غير منشور على GitHub Pages.
- النسخ الاحتياطية المدرسية منفصلة عن نسخة Google Drive للتطبيق العام.
- لا يُلغى الرمز السري القديم قبل نجاح البديل واختبار عزل الحسابات.

## نموذج البيانات
`teachers`: id, school_id, display_name, subjects, classes, timetable, source_version

`users`: google_sub, teacher_id, role(admin|teacher), status(pending|approved|suspended), approved_by, approved_at

`classes`: id, school_id, grade, section, subject, teacher_id

`students`: id, school_id, class_id, name, source_version

`grades/attendance/notes`: school_id, teacher_id, class_id, student_id, values

`audit_log`: actor_sub, action, target_id, timestamp

## تدفق التسجيل
1. يختار المستخدم مدرسة ذكور أو إناث، ثم اسمه من القائمة.
2. يسجل دخول Google باستخدام OpenID Connect.
3. يتحقق الخادم من Google ID token وaudience وissuer وexpiry وsub.
4. ينشئ الخادم طلبًا pending، ولا يمنح وصولًا لسجلات الطلاب.
5. المشرف يراجع الطلب ويوافق أو يرفض من لوحة محمية.
6. يربط الخادم Google sub بمعلم واحد ويطبّق عزل البيانات في كل طلب.

## البيانات المصدرية
- ذكور انتداب مفرد (1).pdf — 23 صفحة.
- معلمات انتداب مفرد.pdf — 31 صفحة.
- قوائم الطلاب والطالبات: لم تصل بعد.

تحتاج الجداول المصورة إلى تدقيق ربط اليوم/الحصة/المادة/الصف قبل الاستيراد النهائي، خصوصًا اختلاف موضع الفسحة بين الملفين.

## قبل النشر
- إنشاء مستودع GitHub مستقل `School-Teacher-Notebook` وتفعيل GitHub Pages.
- تهيئة عميل OAuth للرابط الجديد.
- إعداد خدمة خلفية للتحقق والتفويض وقاعدة بيانات خاصة.
- اختبار حسابين مختلفين على جهازين، رفض الوصول المتبادل، استعادة النسخ، والعمل دون اتصال.
