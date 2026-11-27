-- The company now works around the clock. Replaces the 9:00–21:00 schedule in
-- the site's contacts (top bar and "Contacts" page) and in the "Contacts" page
-- intro, in any of its spellings ("9:00–21:00", "09:00-21:00", "с 9:00 до 21:00",
-- "9:00-ден 21:00-ге дейін"). A schedule already changed in the admin panel is
-- left as it is. Pickup and warehouse hours live in other texts and stay.

UPDATE site_content
SET data = jsonb_set(data, '{ru,contacts,workHours}', to_jsonb('Круглосуточно'::text)),
    updated_at = now()
WHERE id = 1
  AND data #>> '{ru,contacts,workHours}' ~ '0?9[:.]00.{0,15}21[:.]00';

UPDATE site_content
SET data = jsonb_set(data, '{kk,contacts,workHours}', to_jsonb('Тәулік бойы'::text)),
    updated_at = now()
WHERE id = 1
  AND data #>> '{kk,contacts,workHours}' ~ '0?9[:.]00.{0,15}21[:.]00';

-- "Отвечаем ежедневно с 9:00 до 21:00." → "Отвечаем круглосуточно."
UPDATE site_content
SET data = jsonb_set(data, '{ru,contactsPage,intro}', to_jsonb(regexp_replace(
        data #>> '{ru,contactsPage,intro}',
        '\s*(ежедневно\s+)?(с\s+)?0?9[:.]00\s*(до|–|—|-)\s*21[:.]00',
        ' круглосуточно', 'g'))),
    updated_at = now()
WHERE id = 1
  AND data #>> '{ru,contactsPage,intro}' ~ '0?9[:.]00\s*(до|–|—|-)\s*21[:.]00';

-- "Күн сайын 9:00-ден 21:00-ге дейін жауап береміз." → "Тәулік бойы жауап береміз."
UPDATE site_content
SET data = jsonb_set(data, '{kk,contactsPage,intro}', to_jsonb(regexp_replace(
        data #>> '{kk,contactsPage,intro}',
        '(Күн сайын\s+)?0?9[:.]00(-ден)?\s*(–|—|-)?\s*21[:.]00(-ге)?(\s+дейін)?',
        'Тәулік бойы', 'g'))),
    updated_at = now()
WHERE id = 1
  AND data #>> '{kk,contactsPage,intro}' ~ '0?9[:.]00(-ден)?\s*(–|—|-)?\s*21[:.]00';
