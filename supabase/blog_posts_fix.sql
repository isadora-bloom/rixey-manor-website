-- 1. Fix missing post_date column (run this first)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS post_date post_date;

-- 2. Uppost_date the stereotypes post with full content and publish it
UPDATE blog_posts
SET
  published = true,
  content = $$In every wedding we see at least one of these stereotypes rear their head — for better or for worse. Here is a guide to spotting them if you are a guest, managing them if you are the couple getting married, and not becoming one if you recognise yourself in the description.

We will start with the guests, then the family, and finally the couple.

---

## The No Show

**How to spot them:** You don't. That's kind of the point. You invite them, they say yes, you pay for their meal, and they fail to show up to eat it. Varieties include: The No Show Family (Little Timmy has a cold so the whole family stays home, leaving one table conspicuously empty), They Show Then Go (they show up for the ceremony but disappear before trying a single cocktail), and The I Never Thought They Would Come Anyway (distant father, party-phobic relative, the friend who just had a week-old baby but still insisted they would make it).

**How to deal with them:** Adopt a "things happen" attitude. Even if you want to send them a bill for their steak, don't. Things happen outside people's control. They really do get sick. Grandparents do fall and end up in hospital. Babies have a way of changing even the most well-intended plans. As for the food? Ask your caterer to bring you extra at dinner, or get it boxed for a midnight snack.

**How to not become one:** Be realistic about your ability to attend. Couples understand that not everyone can make it. If your plans change, let them know as soon as possible — with a phone call, not a text.

---

## The Drunken Plus One

**How to spot them:** Usually dating one of the couple's best friends for somewhere between three and twelve months (under three months they fall into a more uncomfortable category). They are at the bar for most of the night, chatting with the bartender, or in a corner with a fun flask. They are easiest to spot when the couple's favourite song comes on and the floor fills up — and they are left alone, unsure if they are welcome to join. Or because they end up crying in a corner when their significant other hugs an old flame just a little too long. By the end of the night they are passed out on an available chair until the SO comes to collect them.

**How to deal with them:** Start early. Do not invite anyone to your wedding, plus ones included, that you have never met. Many couples use a no ring, no bring policy: if the guest is not living with, engaged to, or married to the plus one, they are not invited. If you do end up with a plus one you have just met, make an effort to include them. If they are dating a bridesmaid or groomsman, they should sit with their post_date and be invited to the rehearsal dinner.

**How to not become one:** Straightforward: if you do go, do not get drunk and embarrassing.

---

## The Judgy Auntie

**How to spot them:** They may not actually be an aunt — they could be your mother's best friend, a godparent, or an older sister. You know who they are before the wedding. They correct grammar on social media posts. When you look at magazines together they always have a view on Who Wore It Best. When you get engaged they give you a detailed walkthrough of the last wedding they attended, and it will not usually be a positive one. At the wedding they are often scarily quiet, and when they encounter a new element of the décor, they pause in front of it for a few seconds too long. Not to be confused with the Checked-Out Bridesmaid — they are not always judging negatively, and would never say anything to you on the day. But their silent circuit of the room is unnerving. As a side note, they usually do not drink, so as not to do anything they could be judged for themselves.

**How to deal with them:** You are feeding your demons by thinking about it too much. They are usually not doing it deliberately, and would be upset if they knew what was going on. Kill them with kindness. Lots of hugs and warmth stop the negative thoughts on both sides. If the opportunity arises, ask their advice — but only on decisions you do not care much about, because if you do not take it, you will hear about it.

**How to not become one:** Remember that the key to a great wedding is that it reflects the couple involved — not the idea of what a wedding should be, or what your own wedding was missing.

---

## The Barely Dressed Guest

**How to spot them:** A bartender's favourite. This guest walks up the stairs and their dress rides up so high you can see the colour of their undergarments. Embarrassed, they pull down the hem, only to spill out from the top. They grab a drink, walk back down the stairs, and it all begins again. The equivalent in the men's section usually begins the evening fully clothed. As the night progresses: first goes the tie, then the jacket, then a button, then another — until they are unbuttoned to the belly and fist-bumping on the dancefloor. Bonus points if the tie ends up retied around their head.

**How to deal with them:** Make the dress code clear on the invitation or website. Beyond that, there is not much you can do.

**How to not become one:** When you try on a dress, dance a little. Put your arms above your head, wiggle down to the floor, and bend over. For the guys — losing the tie is one thing, but more than two buttons undone is not.

---

## The Cool Uncle

**How to spot them:** On the dancefloor pulling every dad move in existence. Calling for shots at the bar. Making jokes about the ball and chain. Probably showed up to the bachelor party with very little of an invite. Usually wearing a leather jacket instead of a suit.

**How to deal with them:** Don't. Encourage them. This guest does nothing but keep people laughing. They retell great stories, and if they came on the bachelor party, they were probably the last one standing. Let their cool flag fly.

**How to not become one:** You have two options. Go with it, or if you want to fit in with the grown-ups, you know how. Just act like you do at work. Assuming you have a job.

---

## The Teenage Cousin

**How to spot them:** They stand out. The suit is too big, the braces make their smile uncomfortable, and they are creeping around the tables trying to sneak leftover drinks. Especially dangerous when combined with the Cool Uncle, who thinks giving them a drink is a great way to help them have fun.

**How to deal with them:** These guests do need handling. If you do not, they will end up curled in a drunken ball on the dancefloor and all the attention switches to them. As always, making someone feel included reduces excess drinking. Find a similarly-aged guest, ask a friend to be their buddy, or if all else fails, assign them a de facto babysitter. Or if they are the only under-21 guest on the list, consider not inviting them.

**How to not become one:** Age? Short of that you do not have a lot of options. Try not to drink. And there is no way you are reading this blog anyway.

---

## The Checked-Out Bridesmaid

**How to spot them:** Before they became the checked-out bridesmaid, they may have been the least difficult person you knew — or they are difficult in every situation, in which case, good luck. But once you got engaged they slowly started making demands, side comments, and showing up just a little late to everything. Contrary to popular belief, they are not always single — they can be married, engaged, in a long relationship.

**How to deal with them:** The difficult thing about this one is that it is coming from a place of jealousy, pure and simple. It has very little to do with you, and as a friend you understand that and want to help — but it does not stop it making your life harder. You will go back and forth many times about whether having them in your wedding party is worth it. Long term, as a rule, it is. But if the relationship reaches a point where you feel like they would not be there for you if things got hard, it is time to rethink.

**How to not become one:** Try to unpack your emotions in a more rational moment, then reframe them. Your job as a bridesmaid is to be there for the couple. For a relatively short period of time, try to be as supportive as you can. They are dealing with a lot too.

---

## The That Guy Groomsman

**How to spot them:** He shows up with an expensive bottle of bourbon and a 12-pack of cheap beer for later. While all the other groomsmen shave, he is committed to the handlebar moustache. He will disappear to the bar during group pictures. In real life he has a beer for the road but has never had a DUI. At the wedding, no bridesmaid is entirely safe. You know. He's That Guy.

**How to deal with them:** Most couples pick their attendants from their nearest and dearest, including the inconvenient parts. He will bring the fun, the party, and the stories the next morning — and he will not care how embarrassing the story is if it gets a laugh. One caution: if your partner lays out a host of rules for him to follow and he makes a fool of himself anyway, you will be apologising for years.

**How to not become one:** If they ask you to be restrained, be restrained. Be polite, do not grope people unless they ask, and try to keep your clothes on. And behave for the photos — you may grow up, but in those pictures you will look like that forever.

---

## The Single Sister

**How to spot them:** You do not need to spot them. You know them. And chances are they have already appeared in another category — Checked-Out Bridesmaid, Judgy Auntie, or Barely Dressed Guest. Either way they usually end up emotional by the end of the night, and they will be annoyed that no one noticed because everyone was looking at you.

**How to deal with them:** Find their broader category and take that advice. Then remember your parents have been settling your disagreements for decades. Let them do it again. This is the one time they may actually come down on your side.

**How to not become one:** You cannot help being single, and that is not really the point. What you can do is try to be your sibling's number one cheerleader, wine opener, and taco bringer. If you do have to pick one, skip straight to happy crying and tearing up the dancefloor. Everyone loves that person.

---

## Monster-in-Law

**How to spot them:** Could be on either side, or a step-parent. This is the most troubling stereotype because it is both the most commonly seen and the most destructive to a couple's harmony. They range from the mildly annoying Judgy Auntie type to the outright difficult. The biggest problem is that they feel — unlike your other family and guests — that they have the right not only to voice their opinions but to do so loudly and publicly. There is nothing funny about this one.

**How to deal with them:** This is too big a subject to cover in a paragraph. Surround yourself with people who support you. Try not to put too much at your partner's feet, as they will already feel badly about it without being reminded — but do talk it through so it does not build up. You are creating a new family. That does not mean it has to always include every member of the old one.

**How to not become one:** Remember that you love your child, and they are marrying someone who loves them too. That should be a bonding thing, not a threatening one. They are building a new life together. If you want to be included in it, you have to be an asset, or at least quiet.

---

## The Double-Check Father

**How to spot them:** Usually a dad or uncle who has decided all wedding vendors are running a scam and he is going to figure out how. He probably will not be involved regularly, but every so often he announces he is coming to a meeting or needs to read a contract. Without really knowing the ins and outs of what you have planned, he produces a long list of concerns, thoughts, and issues. It does not matter if you are a CEO, an event planner, or a Nobel Prize winner. In this, according to him, you are incapable of doing anything right.

**How to deal with them:** Take it, and try to be patient. You might find they have thought of something genuinely useful. If not, assure them that everything is handled and let them relax.

**How to not become one:** Try to listen before jumping to conclusions.

---

*A note to all parents:* This is the one day in your child's adult life when you will feel entitled to have a strong opinion on what they wear, how they do their hair, what time they eat, and what music they dance to. It is okay to let them know your thoughts. But remember this is their best day ever, and they are welcoming you to experience what that would be like. Encourage them to be true to themselves. How boring would it be if everyone wanted the same thing?

---

## The Disinterested Groom

**How to spot them:** As a vendor, these are the easiest to flag from day one. If they come to a meeting, they wander a couple of paces behind. When the conversation turns to wedding details, they check their phone. These are the people who think proposing was the hard part and they are done. Unlike most of the previous stereotypes, who worsen as the wedding approaches, the Disinterested Groom usually improves.

**How to deal with them:** A lot of partners start with a mild, amiable disinterest, and it often comes from not knowing the language. The best thing is to explain wedding terms without condescension. When they start to form opinions, listen to them. And if you want help making a decision, narrow it down to two or three options — no wrong answers, this is not a trick — and get them to eliminate rather than choose. It is usually easier to say what you do not like than to name what you want.

**How to not become one:** If you do not voice an opinion, you cannot be upset when you do not like the outcome. Your partner is as much of a wedding rookie as you are. They are just trying harder to learn the process. Do the same. The day is about both of you. Make an effort.

---

## The Bridezilla

**How to spot them:** They care more about their perfect vision than their guests. These are the people who fail to understand that even though this is the most important day of their lives, it probably does not crack the top ten for most of the people attending — maybe top five for the parents.

**How to deal with them:** There is a real difference between a Bridezilla and someone having a moment. A bridal moment might be about wanting bridesmaids to wear their hair up, or not wanting a relative to sing during speeches — these, honestly, are a couple's prerogative. A Bridezilla takes it ten steps further and seems to have lost touch with the fact that friends and family are taking time out of their lives to celebrate with them. The best route is through their partner. Yelling will not work — it just inflames the situation. Take them somewhere fun for a weekend.

**How to not become one:** Remind yourself daily that the important thing is marrying the person you love. As long as something does not actively harm your day, and it takes only a minute or two to do — what is the harm in doing it and making someone you love happy?

---

**Honourable Mention: The Sorority Bridal Party.** This group knows how to party together, dance together, and most importantly, pose together. They save photographers a significant amount of time. When a camera appears, they automatically find their light. When asked for a laugh, they throw their heads back in perfect unison. A joy to work with.$$
WHERE slug = 'wedding-stereotypes';

-- 3. Re-run the seed inserts (only if the table is empty — skip if posts already exist)
-- Check first: SELECT count(*) FROM blog_posts;
-- If count = 0, re-run blog_posts_seed.sql after running this file.
