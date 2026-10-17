# wordstokeep.app

The website for Cairn: Words to Keep, an iPhone quote app. Plain HTML and CSS, served by GitHub Pages. No tracking, no cookies.

One small script, `q.js`, runs only on `q.html`, the page a shared-quote link (`/q#v=1&t=…`) opens when Cairn isn't installed. It reads the quote from the link's fragment on the device and writes it into the page as text; a content security policy stops it from making any network request. The format matches `QuoteLink` in the app.

`.well-known/apple-app-site-association` lets those links open Cairn (Universal Links). `.nojekyll` makes GitHub Pages serve the `.well-known` folder.

When the app is live, swap the "Coming soon" note in `index.html` for the App Store badge (see the comment there).
