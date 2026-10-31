-- Major government scholarships + Gulf universities (Oct 2026). Same sourcing
-- discipline as scripts/seed-study-opportunities-mena.sql: each row checked on
-- the official site on 2026-10-31; coverage/tuition text only as published
-- there; funding_coverage_pct only where the source states full coverage of
-- tuition. Idempotent (institution + country + kind).
insert into public.study_opportunities
  (kind, title, institution, country, city, degree_level, field_of_study, language, duration_note, tuition_note, funding_coverage_pct, eligibility_note, deadline, requirements, source_url)
select * from (values
  ('scholarship', 'Swedish Institute Scholarships for Global Professionals (SISGP)', 'Swedish Institute (SI)', 'Sweden', null,
   'graduate', 'All fields with an SI-eligible master''s programme', 'English', 'Length of the master''s programme',
   'Fully funded: full tuition paid by SI to the university each semester, plus a monthly living allowance, insurance and a travel grant (as published by SI).', 100,
   'For citizens of SI''s eligible countries who pay tuition fees in Sweden and have work and leadership experience; see source for the country list.', null::date,
   'Apply to an eligible master''s programme through University Admissions, then to SI in its application window. Contact: si@si.se.', 'https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/'),
  ('scholarship', 'Erasmus Mundus Joint Masters scholarships', 'European Commission (Erasmus+)', 'European Union', null,
   'graduate', 'All fields (each Joint Master has its own field)', 'English', '1 to 2 academic years, in at least two European countries',
   'Full scholarships for the best-ranked students worldwide: cover participation costs and contribute to travel, visa and a living allowance (as published by the European Commission).', 100,
   'Open to students from any country; each Joint Master selects its own scholarship holders.', null::date,
   'Apply directly to the chosen Erasmus Mundus Joint Master (catalogue on the source page).', 'https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters'),
  ('scholarship', 'Eiffel Excellence Scholarship Programme', 'Campus France (French Ministry for Europe and Foreign Affairs)', 'France', null,
   'graduate, phd', 'Engineering, sciences, economics and management, law, political science', 'French or English', 'Master''s up to 24 months; PhD up to 12 months',
   null, null,
   'Foreign students are nominated by a French higher-education institution (no individual applications). Contact: candidatures.eiffel@campusfrance.org.', null::date,
   'Ask the French university you apply to whether it will nominate you for the Eiffel programme.', 'https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence'),
  ('scholarship', 'Stipendium Hungaricum', 'Tempus Public Foundation (Government of Hungary)', 'Hungary', null,
   'undergraduate, graduate, phd', 'All higher-education fields', 'English (and Hungarian)', 'Length of the degree programme',
   null, null,
   'For citizens of Hungary''s partner countries; nomination by the home country''s sending partner. See source for the partner list.', null::date,
   'Apply online in the yearly call and to the home country''s sending partner.', 'https://stipendiumhungaricum.hu/'),
  ('scholarship', 'DAAD scholarships (database)', 'DAAD – German Academic Exchange Service', 'Germany', null,
   'graduate, phd, research', 'All fields', 'German or English', 'Varies by scholarship',
   null, null,
   'Search the DAAD database by country of origin, degree level and field to see the scholarships open to you.', null::date,
   'Use the official DAAD scholarship database (source) to find and apply.', 'https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/'),
  ('scholarship', 'Fulbright Foreign Student Program', 'U.S. Department of State (Fulbright)', 'United States', null,
   'graduate, phd', 'All fields', 'English', 'Varies',
   null, null,
   'Applications go through the Fulbright commission or U.S. embassy in the applicant''s home country; deadlines differ by country.', null::date,
   'Find your country''s Fulbright office on the source page.', 'https://foreign.fulbrightonline.org/'),
  ('scholarship', 'Scholarships for international students (Government of Canada)', 'EduCanada (Global Affairs Canada)', 'Canada', null,
   'undergraduate, graduate, phd, research', 'All fields', 'English or French', 'Varies by scholarship',
   null, null,
   'Official list of Canadian government scholarships open to non-Canadians; eligibility depends on country and programme.', null::date,
   'Check each scholarship''s own page from the source list.', 'https://www.educanada.ca/scholarships-bourses/non_can/index.aspx?lang=eng'),
  ('program', 'Undergraduate & Graduate Programs', 'Sultan Qaboos University (SQU)', 'Oman', 'Muscat',
   'undergraduate, graduate', 'Engineering, medicine, sciences, agriculture, economics, arts, education, law', 'English and Arabic', null,
   null, null, null, null::date,
   'Apply through SQU''s admissions office; see source.', 'https://www.squ.edu.om/'),
  ('program', 'Undergraduate & Graduate Programs', 'University of Bahrain (UoB)', 'Bahrain', 'Sakhir',
   'undergraduate, graduate', 'Engineering, IT, business, science, arts, health sciences, law', 'English and Arabic', null,
   'UoB announced applications for tuition fee exemption for 2026–2027 (see source announcements).', null, null, null::date,
   'Apply through UoB admissions; see source.', 'https://www.uob.edu.bh/')
) as v(kind, title, institution, country, city, degree_level, field_of_study, language, duration_note, tuition_note, funding_coverage_pct, eligibility_note, deadline, requirements, source_url)
where not exists (
  select 1 from public.study_opportunities existing
  where existing.institution = v.institution and existing.country = v.country and existing.kind = v.kind
);
