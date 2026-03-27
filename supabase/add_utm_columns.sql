alter table contact_submissions
  add column if not exists source   text,
  add column if not exists medium   text,
  add column if not exists campaign text,
  add column if not exists referrer text;

alter table quiz_submissions
  add column if not exists source   text,
  add column if not exists medium   text,
  add column if not exists campaign text,
  add column if not exists referrer text;

alter table calculator_submissions
  add column if not exists source   text,
  add column if not exists medium   text,
  add column if not exists campaign text,
  add column if not exists referrer text;
