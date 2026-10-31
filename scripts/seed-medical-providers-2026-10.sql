-- More medical-travel providers (Oct 2026): hair transplant (Turkey), Gulf,
-- Levant, Egypt, Germany. Same sourcing discipline as
-- scripts/seed-medical-providers.sql: every row checked on the provider's
-- own website on 2026-10-31; price_range_note only where that site
-- publishes a figure; contact_email only when published on that site.
-- Idempotent (hospital_name + country).
insert into public.medical_treatment_providers
  (country, city, hospital_name, specialties, price_range_note, contact_email, contact_phone, source_url)
select * from (values
  ('Turkey', 'Istanbul', 'Cosmedica Clinic', 'Hair transplantation (DHI / Sapphire FUE), beard and eyebrow transplant',
   'Published flagship DHI Sapphire hair transplant package: EUR 3,290', 'info@cosmedica.com', null, 'https://www.cosmedica.com/'),
  ('Turkey', 'Istanbul', 'Dr. Serkan Aygin Clinic', 'Hair transplantation (FUE / DHI), all-inclusive packages for international patients',
   'Published typical all-inclusive hair transplant package: EUR 2,700–4,500 (site also quotes GBP 2,000–4,500 / USD 3,500–6,500 for Turkey)', 'info@drserkanaygin.com', null, 'https://www.drserkanaygin.com/'),
  ('Turkey', 'Istanbul', 'Clinicana', 'Hair transplantation, dental and aesthetic treatments for international patients',
   null, 'info@clinicana.com', null, 'https://www.clinicana.com/'),
  ('United Arab Emirates', 'Abu Dhabi', 'Cleveland Clinic Abu Dhabi', 'Multi-specialty tertiary hospital (heart and vascular, neurology, digestive disease, eye, respiratory, critical care) with an International Patients office',
   null, 'InternationalPatients@ClevelandClinicAbuDhabi.ae', null, 'https://www.clevelandclinicabudhabi.ae/en/patients-and-visitors/international-patients'),
  ('Lebanon', 'Beirut', 'American University of Beirut Medical Center (AUBMC)', 'Academic multi-specialty medical center: cancer care, cardiology and cardiac surgery, neurosciences, children''s health, transplant',
   null, null, null, 'https://www.aubmc.org.lb/'),
  ('Egypt', 'Cairo', 'Dar Al Fouad Hospital', 'Private tertiary hospital: cardiac surgery and cardiology, organ transplant, oncology, orthopedics, neurosurgery',
   null, null, null, 'https://www.daralfouad.org/'),
  ('Germany', 'Berlin', 'Charité – Universitätsmedizin Berlin', 'University hospital, one of Europe''s largest: all specialties incl. oncology, cardiology, neurology, transplant; treats international patients',
   null, null, null, 'https://www.charite.de/en/'),
  ('Qatar', 'Doha', 'Sidra Medicine', 'Women''s and children''s hospital: pediatrics and pediatric surgery, obstetrics, gynecology, neonatal care',
   null, null, null, 'https://www.sidra.org/')
) as v(country, city, hospital_name, specialties, price_range_note, contact_email, contact_phone, source_url)
where not exists (
  select 1 from public.medical_treatment_providers existing
  where existing.hospital_name = v.hospital_name and existing.country = v.country
);
