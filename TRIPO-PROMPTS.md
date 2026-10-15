# Промпты для Tripo

## Настройки

- Режим: Text to 3D (или Image to 3D, см. ниже)
- Текстура: HD, PBR включён
- Полигоны: около 30 000 (Smart Low Poly, если есть)
- Экспорт: **GLB**
- Готовые файлы: `public/models/peony.glb` и `public/models/dahlia.glb`

Промпты пишите на английском, Tripo понимает его точнее.

## 1. Пион (главный объект hero)

```text
A single large peony flower head, fully open, many layered ruffled petals, dusty blush pink fading to warm cream in the center, soft velvety matte petals, no stem, no leaves, no vase, isolated object on empty background, realistic, high detail
```

## 2. Георгин (как на рубиновой свадьбе)

```text
A single dahlia flower head, deep burgundy red, dense symmetrical spiral of pointed petals, soft satin sheen, no stem, no leaves, no vase, isolated object on empty background, realistic, high detail
```

## 3. Запасной вариант: роза

```text
A single open garden rose head, champagne cream color with slightly darker petal edges, layered petals, no stem, no leaves, isolated object on empty background, realistic, high detail
```

## Negative prompt (если есть такое поле)

```text
stem, leaves, vase, pot, ground, base, text, multiple flowers
```

## Вариант лучше: Image to 3D по своему фото

Вырежьте один георгин крупным планом из `public/projects/ruby-wedding/01.jpg` и загрузите в Tripo как Image to 3D. Модель повторит ваш реальный стиль, а не стоковый цветок.

Зеркальные шары делать в Tripo не нужно, они будут сделаны кодом.
