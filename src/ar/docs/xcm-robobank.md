---
title: اختبار Substrate Cumulus Parachain للرسائل عبر السلاسل الجانبية

contributors: [ddulesov, boogerwooger, tubleronchik] 
---

الهدف الرئيسي لهذا المشروع هو تبسيط تطوير وقت التشغيل للسلسلة الجانبية عند استخدام رسائل عبر السلاسل. يسمح بتطوير رمز وقت التشغيل مع اختبارات اندماج ذات درجة عالية من التكرارية واستخدام بسيط. يقوم بتلقين بناءً، بناء تكوين الشبكة المعدة مسبقًا (أي سلسلة وسيطة + 2 سلاسل جانبية)، إعداد قنوات تمرير الرسائل بين السلاسل الجانبية وتشغيل اختبارات الرسائل، إرسال الرسائل، باستخدام استدعاء إلى وقت التشغيل، كلها مبنية ومؤلفة بلغة Python.

يتم استخدام مجموعة اختبارات XCM لاختبار دورة الإنتاج لـ Robobank - مجموعة من اللوحات الفرعية لـ Substrate، التي تسمح للروبوتات بالتسجيل على سلاسل جانبية خارجية، استقبال الطلبات المدفوعة مسبقًا، تنفيذها واستلام المدفوعات باستخدام الرموز الخارجية. يتيح هذا للروبوتات العمل داخل شبكة Robonomics مع كل البنية التحتية المطلوبة، ولكن في الوقت نفسه، يمكنها تقديم خدماتها على أي سلسلة جانبية أخرى.

يتوفر مقطع فيديو توضيحي على [YouTube](https://www.youtube.com/watch?v=S_bZgsxngiM)

الخطوات الرئيسية في سيناريو العرض التوضيحي هي:
- تشغيل سلسلة وسيطة وسلسلتين جانبيتين في حزمة من 6 عمليات
- إعداد قنوات الرسائل XCM بين السلاسل الجانبية
- تسجيل روبوت في كلتا السلاسل الجانبية
- إنشاء طلب لهذا الروبوت في سلسلة العميل (احتياطي الدفع لإكمال الطلب)
- إرسال رسالة XCM إلى سلسلة Robonomics
- إنشاء سجل الطلب "المعكوس" على سلسلة Robonomics
- يقبل الروبوت الطلب على سلسلة Robonomics
- إرسال رسالة XCM حول قبول الطلب إلى سلسلة العميل
- قبول الطلب على سلسلة العميل (احتياطي رسوم العقوبة لعدم إكمال الطلب حتى الموعد النهائي)
- يكمل الروبوت الطلب على سلسلة Robonomics
- إرسال رسالة XCM حول إكمال الطلب إلى سلسلة العميل
- تسوية جميع المدفوعات (يتم نقل دفعة العميل إلى الروبوت، فضلاً عن رسوم العقوبة غير المستخدمة)
- إغلاق الطلب

## الشيفرة الأصلية
هذا المشروع هو فرع من
[قالب العقدة في مركز المطورين لـ Substrate](https://github.com/substrate-developer-hub/substrate-node-template).
يحتوي على شيفرة لوحات وقت التشغيل التي يتم اختبارها.
كما في الأصلكود الـ node للـ parachains موجود في الدليل "./pallets"، "./runtime"، و"./node".

الاختلافات مع "substrate-node-template" الأصلي:
- يحتوي هذا الـ runtime للـ collator على وحدة معالجة HRMP ويمكنه التعامل مع الرسائل من parachains الشقيقة
- يحتوي على runtime اختباري جاهز لاختبارات XCM الداخلية

## بناء وتشغيل
الإعداد الموصى به (بشدة):
```
Ubuntu 20، 16 جيجابايت رام، 8 معالج، 120 جيجابايت SSD
```
[ملاحظة] يمكن أن يستغرق البناء الأول الكثير من الوقت، حتى عدة ساعات على الأجهزة غير المثلى.

[ملاحظة] يعمل السكربت مع الإصدارات الثابتة (commit hashes) من Polkadot(Rococo) في سلسلة الريلي والـ parachains.

[ملاحظة] بشكل افتراضي، يقوم السكربت بإعادة إنشاء نفس البيئة في كل تشغيل، من خلال إزالة جميع الحالات السابقة. يمكن تغيير هذا السلوك في "config.sh" باستخدام المعلمة "PERSISTENT".

قم بتشغيل سكربت البناء والإعداد.
```bash
git clone https://github.com/airalab/xcm-robobank-prototype.git
cd xcm-robobank-prototype
./scripts/init.sh
```

الإجراءات الأساسية لسكربت "init.sh":
 - قراءة التكوين (ملف "config.sh" مع رقم التنقيح، ومفاتيح الـ node الأولية والمعرفات، ومعلمة استمرارية chaindata، إلخ)
 - إعداد حزم النظام الأساسية، Rust وPython
 - بناء برامج ثنائية منفصلة لسلسلة الريلي وأيضًا لكل من الـ parachains
    - ستتم إنشاء البرامج الثنائية في الدليل الفرعي ./bin.
 - (اختياري) إزالة جميع بيانات السلسلة السابقة لجميع السلاسل
    - معطل إذا تم تعيين "PERSISTENT=1" في "config.sh"
 - تشغيل كعمليات منفصلة (بمعرفات العملية الفردية وأنابيب الإدخال/الإخراج):
    - محققون لسلسلة الريلي (أي 4 محققين يعملون على تنفيذ ثابت للنسخة Rococo)
    - collators لـ parachain-100 (أي محقق واحد للـ parachain الأول، الذي تقوم بتطويره)
    - collators لـ parachain-200 (أي محقق واحد للـ parachain الثاني، الذي تقوم بتطويره)
 - يقوم بطباعة جميع نقاط النهاية، والمنافذ على وحدة التحكم، مما يتيح لك دراسة أي سلسلة باستخدام تطبيقات الواجهة الأمامية (explorer، DApp)
 - يواصل طباعة جميع بيانات الإخراج لجميع السلاسل على وحدة التحكم

[تحذير] بعد التشغيل، انتظر حتى يتم تشغيل الشبكة، وتأكد من ببدء تثبيت الكتلة، وتسجيل الـ parachains. يجب أن تكون هذه العمليات قد بدأت.يتطلب تقريبًا 5 دقائق (50 كتلة × 6 ثوانٍ).

## التحقق من أن الإعداد الأولي يعمل

استخدم واجهة بولكادوت القياسية ونقاط النهاية "--ws-port" المولدة للاتصال بكل عقدة.
افتح [تطبيق بولكادوت](https://polkadot.js.org/apps/?rpc=ws://localhost:9500/) لمراقبة السلاسل.

### مثال:
مضيف محلي، 4 محققي سلسلة ريلي، محقق واحد لـ parachain-100، محقق واحد لـ parachain-200:
- [محقق ريلي 1](https://polkadot.js.org/apps/?rpc=ws://localhost:9500/)
- [محقق ريلي 2](https://polkadot.js.org/apps/?rpc=ws://localhost:9501/)
- [محقق ريلي 3](https://polkadot.js.org/apps/?rpc=ws://localhost:9502/)
- [محقق ريلي 4](https://polkadot.js.org/apps/?rpc=ws://localhost:9503/)
- [محقق parachain-100](https://polkadot.js.org/apps/?rpc=ws://localhost:10054/)
- [محقق parachain-200](https://polkadot.js.org/apps/?rpc=ws://localhost:10055/)

إذا كل شيء عمل بشكل صحيح، وبدأ التوافق، يمكننا المتابعة لتشغيل حالات الاختبار الخاصة بنا (في نافذة الأوامر الجديدة).

### اختبار تمرير الرسائل UMP
```bash
./scripts/init.sh ump
```
ينشئ رسالة `Balance.transfer` في `parachain-100` ويمررها إلى سلسلة الريلي.
عندما تستلم سلسلة الريلي الرسالة، ستقوم بتحويل 15 رمزًا من حساب `para 100` إلى حساب Charlie.

### اختبار تمرير الرسائل HRMP
```bash
./scripts/init.sh ump
```

ينشئ رسالة `Balance.transfer` في `parachain-100` ويمررها إلى `sibling 200`.
قبل ذلك، يمنح حساب `subl 100` 1000 رمز وينشئ قناة اتصال بين الباراشينز.
```bash
./scripts/init.sh hrmp
```
يمكن إرسال الرسائل التالية عن طريق تشغيل الأمر الفرعي `hrmpm`. لا ينشئ قناة وبالتالي يعمل بشكل أسرع.
```bash
./scripts/init.sh hrmpm
```

### المزيد من الخيارات
```bash
./scripts/init.sh help
```

## شبكة اختبار محلية### إنشاء مواصفات سلسلة مخصصة
```
./bin/polkadot build-spec --chain rococo-local --disable-default-bootnode > rococo_local.json
```

قم بتحرير rococo_local.json، واستبدل معلمات الأرصدة والسلطات بالخاصة بك.
```json
  "keys": [
    [
      "",
      "",
      {
        "grandpa": "",
        "babe": "",
        "im_online": "",
        "para_validator": "",
        "para_assignment": "",
        "authority_discovery": ""
      }
    ]
```

عنوان Polkadot لـ //Alice//stash (تشفير sr25519).
```bash
$ polkadot key inspect-key --scheme sr25519 --network substrate //Alice//stash
```

```text
مفتاح السر الخاص `//Alice//stash` هو:
البذرة السرية:      

المفتاح العام (hex): 

معرف الحساب:       

عنوان SS58:     
```

مفتاح جلسة grandpa لـ Polkadot لـ //Alice (تشفير ed25519).
```bash
$ polkadot key inspect-key --scheme ed25519 --network substrate //Alice
```
```text
مفتاح السر الخاص `//Alice` هو:
البذرة السرية:      

المفتاح العام (hex): 

معرف الحساب:       

عنوان SS58:     
```

عنوان Polkadot لـ //Alice (تشفير sr25519).
```
$ polkadot key inspect-key --scheme sr25519 --network substrate //Alice
```
```text
مفتاح السر الخاص `//Alice` هو:
البذرة السرية:      

المفتاح العام (hex): 

معرف الحساب:       

عنوان SS58:     
```

قم بتحويل rococo_local.json إلى التنسيق الخام.
```
./bin/polkadot build-spec --chain rococo_local.json --raw --disable-default-bootnode > rococo_local.json
```
لاستخدام مواصفات سلسلة جديدة، استبدل ملف rococo.json في الدليل ./config/ بهذا الجديد وأعد تشغيل السلسلة.
```bash
./scripts/init.sh run
```
يمكنك تحرير الكود بحرية. سيقوم الأمر أعلاه بإعادة بناء المشروع وتحديث عقدة الجامع قبل البدء.
Cumulus هو برنامج ما قبل الإصدار لا يزال تحت التطوير الكثيف.
نحن نستخدم تعهدًا محددًا من Polkadot [46c826f595021475fa5dbcd0987ed53f104e6e15  18 مارس 2021](https://github.com/paritytech/polkadot/tree/46c826f595021475fa5dbcd0987ed53f104e6e15)

يمكنك استخدام إصدارات أحدث من البرنامج. للقيام بذلك، قم بتغيير  POLKADOT_COMMIT  في ./scipt/config.sh
إلى أحدث commit من فرع `rococo-v1`، احذف ./bin/polkadot، وقم بتشغيل 
```bash
./scripts/init.sh run
```

قم بتحديث تبعيات مشروع الجامع
```bash
cargo update
./scripts/init.sh build
```
ربما تتطلب بعض التبعيات ميزات سلسلة أدوات Rust الجديدة. يستند هذا المشروع على Rust `nightly-2021-01-26`
قم بتحديث إصدار سلسلة أدوات Rust في ./scripts/config.sh قبل البناء.

## اختراق الباراشين
[إضافة لوحة خارجية](https://substrate.dev/docs/en/tutorials/add-a-pallet/) - ربما يجب أن تكون في "تعلم المزيد"؟
## تعلم المزيد

يرجى الرجوع إلى المصدر
[Substrate Developer Hub Node Template](https://github.com/substrate-developer-hub/substrate-node-template)
لمعرفة المزيد حول هيكل هذا المشروع، والقدرات التي يحتوي عليها، والطريقة التي يتم بها تنفيذ تلك القدرات. يمكنك معرفة المزيد حول
[مسار كتلة الباراشين](https://polkadot.network/the-path-of-a-parachain-block/) على
مدونة Polkadot الرسمية.
[ورشة عمل Parity Cumulus](https://substrate.dev/cumulus-workshop/#/)