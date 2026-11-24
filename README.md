# Communication Assistant

A personal dashboard that reads my Gmail and chosen Google Chat Spaces,
summarizes them in simple English with Gemini, and shows them in an
installable web app (PWA) with push notifications.

## What it does
- Summarizes emails (Primary, Updates, Forums) and Google Chat Spaces
- Shows priority, deadlines and "Action required" items
- Search and filters (Overview, Emails, Google Chat, Action Required)
- Works on Mac and Android as an installed app
- Sends push notifications for new messages

## How it works
Google Apps Script (runs every 10 minutes) -> Gemini summaries ->
Google Sheet + Firestore -> this dashboard (Firebase Hosting)

## Built with
Google Apps Script, Gemini API (free tier), Firebase (Hosting, Firestore,
Google sign-in, Cloud Messaging), plain HTML and JavaScript.

## Cost
$0 (all free tiers).

## Setup (short version)
1. Create a Firebase project and enable Hosting, Firestore and Google sign-in.
2. Put your own web app settings in public/firebase-config.js.
3. Change the email in firestore.rules to your own.
4. Deploy: npx firebase-tools deploy --only hosting,firestore:rules
5. Set up the Apps Script part (see apps-script/ folder, if included).

## Privacy
Your email text is sent to Google's Gemini API to be summarized.
Nothing is stored anywhere except your own Google account.
