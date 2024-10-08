---
title: الأجهزة الافتراضية

contributors: [nakata5321]
---

**سيقدم هذا المقال لك كيفية إنشاء أجهزة افتراضية في منزل ذكي، حتى تتمكن من رؤية شكل المنصة الفعلي.**

{% roboWikiPicture {src:"docs/home-assistant/virtual-sensors.png", alt:"virtual sensor"} %}{% endroboWikiPicture %}

## تثبيت التكامل

لاستخدام الأجهزة الافتراضية، تحتاج إلى تثبيت ["التكامل التجريبي"](https://www.home-assistant.io/integrations/demo/).
للقيام بذلك، يجب عليك تحرير ملف التكوين الخاص بك.

انتقل إلى مجلد التكوين الذي قدمته أثناء عملية التكوين. في هذا المجلد، ستجد مجلدًا
يحمل اسم "homeassistant". ادخل إليه. افتح ملف `configuration.yaml` بمحرر نصوص تحت مستخدم **root** وأدخل السطر التالي فيه:

{% codeHelper { copy: true}%}

```
...
# مثال على إدخال configuration.yaml
demo:
...
```

{% endcodeHelper %}


بعد ذلك، أعد تشغيل Home Assistant عبر واجهة الويب. عند إعادة تشغيل المنزل الذكي، يمكنك العثور على جميع الأجهزة الافتراضية في كيانات "التجريبي".
ابحث عنها في `الإعدادات -> الأجهزة والخدمات -> التجريبي`. يمكن إضافة جميع هذه الكيانات إلى لوحة التحكم الخاصة بك.

{% roboWikiPicture {src:"docs/home-assistant/demo-entities.png", alt:"demo-entities"} %}{% endroboWikiPicture %}
