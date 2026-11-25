-- Restores only steps that still have the texts set by the up migration.
DO $$
DECLARE
    t RECORD;
BEGIN
    FOR t IN SELECT * FROM (VALUES
        ('ru', 'Укажите номер телефона', 'Менеджер свяжется с вами по указанному номеру.',
         'Подтвердите телефон', 'Подтвердите номер через Telegram, WhatsApp или SMS — это займёт меньше минуты.',
         'Менеджер согласует с вами детали аренды и доставки, уточнит итоговую сумму и зарезервирует товары за вами.',
         'Мы уточним детали доставки и итоговую сумму, а затем зарезервируем товары за вами.'),
        ('kk', 'Телефон нөміріңізді көрсетіңіз', 'Менеджер көрсетілген нөмір бойынша сізбен хабарласады.',
         'Телефоныңызды растаңыз', 'Нөмірді Telegram, WhatsApp немесе SMS арқылы растаңыз — бұл бір минуттан аз уақыт алады.',
         'Менеджер сізбен жалдау мен жеткізу егжей-тегжейлерін келісіп, соңғы соманы нақтылайды және тауарларды сізге брондайды.',
         'Жеткізу егжей-тегжейлері мен соңғы соманы нақтылап, тауарларды сізге брондаймыз.')
    ) AS v(locale, old_title, old_desc, new_title, new_desc, old_next, new_next)
    LOOP
        UPDATE site_content c
        SET data = jsonb_set(c.data, ARRAY[t.locale, 'howItWorks', 'steps'], n.steps),
            updated_at = now()
        FROM (
            SELECT jsonb_agg(
                CASE
                    WHEN s.step->>'title' = t.old_title
                        AND s.step->>'description' = t.old_desc
                        THEN s.step || jsonb_build_object('title', t.new_title, 'description', t.new_desc)
                    WHEN s.step->>'description' = t.old_next
                        THEN s.step || jsonb_build_object('description', t.new_next)
                    ELSE s.step
                END ORDER BY s.pos) AS steps
            FROM site_content sc,
                 jsonb_array_elements(CASE
                     WHEN jsonb_typeof(sc.data #> ARRAY[t.locale, 'howItWorks', 'steps']) = 'array'
                     THEN sc.data #> ARRAY[t.locale, 'howItWorks', 'steps']
                     ELSE '[]'::jsonb
                 END) WITH ORDINALITY AS s(step, pos)
            WHERE sc.id = 1
        ) n
        WHERE c.id = 1
          AND n.steps IS DISTINCT FROM c.data #> ARRAY[t.locale, 'howItWorks', 'steps']
          AND n.steps IS NOT NULL;
    END LOOP;
END $$;
