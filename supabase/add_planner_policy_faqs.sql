-- ============================================================
-- Rixey Manor — External Planner Policy FAQs
-- 2026-05-26
--
-- Adds two FAQs in the 'vendors' category covering the new policy:
--   1. External planners must be approved BEFORE the contract is signed,
--      have planned 5+ weddings, and carry liability insurance.
--   2. Planners booked AFTER the contract is signed must come from the
--      recommended planner list (available on request) and carry insurance.
--
-- Idempotent: deletes any prior rows with the same questions before inserting.
-- Run from the Supabase SQL editor.
-- ============================================================

delete from faqs
 where question in (
   'Can we bring our own outside wedding planner?',
   'What happens if we hire a wedding planner after we sign the contract?'
 );

insert into faqs (question, answer, category, sort_order, active) values

('Can we bring our own outside wedding planner?',
 'Yes, with two ground rules. If you are already working with a planner when you book Rixey, they need to be approved before the contract is signed. They must have planned at least five weddings and carry their own liability insurance. Planners are the one role that actually stands next to your coordinator on the day, which is why we vet them before they are on the property. (If you decide to hire a planner after your contract is signed, see the next question.)',
 'vendors', 50, true),

('What happens if we hire a wedding planner after we sign the contract?',
 'Once your contract is signed, any planner you add to your team needs to come from our recommended planner list. We will send it on request. The planner you choose still needs to carry their own liability insurance. The reason is the same as the pre-contract rule: planners are the one outside role that stands next to your coordinator on the day, and after the contract is signed we have neither the time nor the standing to vet someone new from scratch.',
 'vendors', 51, true);
