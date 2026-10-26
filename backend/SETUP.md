# Turning on the real database (Supabase)

Right now the site runs in **demo mode**: posts, votes and sign-ups are saved only in the
browser they were made in. These steps turn on a shared database, so every parent sees
the same live updates. It's free at our size. Claude will do the technical parts once
you've done the steps that need you.

## What you do (about 15 minutes)

1. **Create the business Gmail.** Something like `awaysquad.team@gmail.com`. Submission
   alerts and the "confirm your email" messages to parents come from here.
2. **Create a Supabase account** at supabase.com with that Gmail. Choose the **Free** plan.
3. **Create a project.**
   - Name: `away-squad`
   - Region: **East US (Ohio)**, the closest one to Chicago
   - Database password: let Supabase generate one, and save it in your password manager.
     Don't paste it into the chat.
4. **Tell Claude when the project says "Ready".** You'll be asked to copy two values from
   *Project Settings → API*:
   - the **Project URL**
   - the **anon public** key. This one is safe to share: it's designed to sit in the
     website's code, and the rules in `schema.sql` decide what it can do.

   Never share the **service_role** key. It bypasses every rule.

## What Claude does next

1. Runs `schema.sql` in Supabase's SQL Editor (or walks you through pasting it). This
   creates the tables, the privacy rules and the spam guards:
   - Only signed-in adults (18+) can post.
   - Each parent is limited to 5 live updates per 10 minutes.
   - Three reports from different parents hide an update until you review it.
   - Parents' emails are never shown. Other parents see only first name, last initial, town and title.
2. Turns on **email + password sign-in** with "confirm your email" and "forgot password"
   emails, branded with the site name.
3. Loads the 27 real venues into the database (`seed-venues.sql`). The made-up sample venues and tournament stay out of the real database.
4. Switches the site from demo mode to the real database (one setting in `js/data.js`).
5. Sets up the **"new submission" email to you.** When a parent sends a write-up, you get an
   email with an Approve link. This uses a small Supabase function plus a free email sender
   (Resend, free up to 3,000 emails/month).
6. Makes you the admin, so you see the review queue and can hide posts.

## Costs to expect

| Item | Cost |
|---|---|
| Supabase (database + sign-in) | Free tier. A free project pauses after a week with no visitors; one click wakes it. Upgrade ($25/mo) once real parents use it daily. |
| GitHub Pages (hosting) | Free |
| Resend (emails) | Free up to 3,000/month |
| Domain (awaysquad.com + .app) | ~$25/year |
