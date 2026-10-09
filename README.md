# My Personal Website

**By Haggai Mukwala** | ICT251 Web Technologies, Activity 3 | Mulungushi University

**Live website:** https://my-personal-website-lbv4.onrender.com

**Source code:** https://github.com/hmukwala26-tech/my-personal-website

## About this website

This is my personal website. I built the first version in Activity 2, and for Activity 3 I improved it and added JavaScript so visitors can interact with it. It is made with plain HTML, CSS and JavaScript, and it is hosted on Render.

The page has these sections: introduction, About Me, My Hobbies, My Learning Plan, Projects and Skills, My Photos, My Media (a video and an audio recording) and Contact. It works on phones and computers and has a light and a dark theme.

## Files in this project

```
index.html        the page
css/styles.css    the styling
js/script.js      the JavaScript
images/           my photos
videos/           my video and audio
README.md         this file
```

## The four JavaScript features

All the JavaScript is in `js/script.js`.

1. **Contact form check and preview (required).** When you press Preview, the form checks the name, email and message. It rejects empty or spaces-only names and messages, and emails that are not written properly. Errors show under each box. If everything is fine, a preview of what you typed appears on the page without reloading. Nothing is sent anywhere. This is a browser demonstration only.
2. **Photo gallery.** Previous and Next buttons show one photo at a time with its caption. Previous is switched off on the first photo and Next on the last.
3. **Theme switch.** A button in the header changes the page between light and dark. The browser remembers your choice.
4. **Study hours calculator.** You enter hours per day and days per week, and it shows your total hours for the week. It rejects blank entries, text, negative numbers, more than 24 hours a day, and days outside 1 to 7.

## How to test it

1. **Form:** press Preview with empty boxes (errors appear). Try spaces only, then an email like `abc` (both rejected). Then enter real details and check that the preview appears. Press Clear to reset.
2. **Gallery:** click Next until the last photo, then Previous back to the first. The buttons should switch off at each end.
3. **Theme:** click the theme button and check the text is easy to read in both themes. Refresh the page to see that your choice is kept.
4. **Calculator:** enter 2 hours and 5 days (the answer is 10). Then try a blank box, letters, -1, 25 hours, and 0, 8 and 2.5 days. These should all show an error.
5. **Keyboard:** press Tab to move through the page. Every link and button should show an outline.
6. **Screen size:** check the page at about 375 px and 1280 px wide. It should not scroll sideways.

## How it is published

The site is a static site on Render, connected to this GitHub repository. Render settings: Root Directory blank, Build Command `echo "No build required"`, Publish Directory `.`, and Auto Deploy on the `main` branch.

## Sources and help

- MDN Web Docs, Learn web development: https://developer.mozilla.org/en-US/docs/Learn_web_development
- The photos, video and audio are my own.
- **AI assistance:** I used Claude (an AI assistant made by Anthropic) to help debug the javascript.
