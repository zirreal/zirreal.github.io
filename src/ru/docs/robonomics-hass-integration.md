---
title: Настройка интеграции Robonomics

contributors: [LoSk-p, nakata5321, Fingerling42]
tools:
  - Robonomics Home Assistant Integration 1.8.6
    https://github.com/airalab/homeassistant-robonomics-integration
---

**В этой статье вы добавите Robonomics в Home Assistant. Это позволит Home Assistant записывать журналы данных с зашифрованными данными на Robonomics Parachain и принимать команды запуска с парачейна для управления умными устройствами. Интеграция использует IPFS для хранения данных и отправки хешей IPFS в функции журнала данных или запуска.**

{% roboWikiPicture {src: 'docs/home-assistant/integration-setup.png', alt: 'настройка интеграции'}%} {% endroboWikiPicture %}

Прежде всего вам нужно создать конфигурацию для вашей панели управления. Для этого откройте свою панель управления Home Assistant и в правом верхнем углу нажмите кнопку "Редактировать панель" (карандаш).
В открывшемся всплывающем окне нажмите на значок трех точек и выберите кнопку "Взять контроль":

{% roboWikiPicture {src: 'docs/home-assistant/take-control.png', alt: 'настройка интеграции'}%} {% endroboWikiPicture %}

Нажмите "Взять контроль" еще раз:

{% roboWikiPicture {src: 'docs/home-assistant/take-control2.png', alt: 'настройка интеграции'}%} {% endroboWikiPicture %}

Теперь вы можете установить интеграцию Robonomics. Для этого выполните следующие шаги:
 
{% roboWikiVideo {videos:[{src: 'QmQp66J943zbF6iFdkKQpBikSbm9jV9La25bivKd7cz6fD', type: 'mp4'}], attrs:['loop', 'controls', 'autoplay']} %}{% endroboWikiVideo %}

1. В веб-интерфейсе Home Assistant перейдите в `Настройки` -> `Устройства и сервисы` и нажмите `ДОБАВИТЬ ИНТЕГРАЦИЮ`. Найдите `Robonomics`.

2. Нажмите на Robonomics и заполните конфигурацию:

- Добавьте seed из аккаунта `SUB_CONTROLLER` в seed учетной записи контроллера.
- Добавьте публичный адрес аккаунта `SUB_OWNER` в адрес владельца подписки.
- Установите интервал отправки данных (по умолчанию 10 минут).
- (По желанию) Вы можете добавить учетные данные для сервиса Pinata или другого пользовательского шлюза для распространения ваших данных по широкой сети IPFS.

{% roboWikiNote {title:"Примечание", type: "Note"}%} В разделе [Настройка Pinata](/docs/pinata-setup) вы можете найти более подробную информацию об использовании Pinata.{% endroboWikiNote %}

3. Нажмите `ПОДТВЕРДИТЬ` после завершения конфигурации. Если вы все заполнили правильно, вы увидите окно успешного завершения.

Вот и все! Вы полностью настроили интеграцию Robonomics в Home Assistant. Теперь вы можете использовать все
веб-сервисы Robonomics. Чтобы узнать больше о них, перейдите в раздел ["Использование"](docs/add-user).