# HackerU - Mardi Gras project by Tchelet Levi

The goal of this project for me was to use as little external code as possible and to challenge my SCSS / CSS and Javascript skills.

Pretty much every component you see in this project is made by me (Carousel, Lightbox, FAQ cards, etc).

Due to not having access to frameworks such as React or Svelte, making reusable components proved itself difficult, so in order to not spend too much time on these components, I left them somewhat incomplete in terms of their stability and reusability.

I know I could use Web Components for this but I felt like it would be a bit of a waste of my time to learn Web Components when modern frameworks exist.

Also..

**Please take into consideration that I am not a UI/UX person.
The goal of this project is to overcome CSS and JavaScript challenges, not design challenges.**
So please forgive my poor design choices ;)

## External resources I've used

1. Ionicons (icon library)

2. Google Fonts

3. Modern-Normalize (CSS Normalizer) - https://github.com/sindresorhus/modern-normalize

4. Pictures (Pexels / Unsplash)

5. Copywriting (From Wikipedia and mardigrasneworleans.com)

Sorry if I missed something!

### Note regarding the use of images

Due to not being able to use copyrighted images (in other words, google images), I ended up reusing a bunch of images, especially in the Media page. I feel like this is out of my control. I wanted to abide by the restrictions given to me, however, I do very much recognize that the website would look much better if I was allowed to use more and better images.

### Note regarding compatibility across browsers

The goal here, as always, is to make sure the website looks as consistently good as possible across every browser,
though in actuality we all know that a perfect solution like that is not entirely possible.

However, I did build the website with cross browser compatibility in mind, and tested it in:

1. Brave Browser (Chromium)
2. Firefox
3. Microsoft Edge (Also Chromium)

Due to the differences between how Chromium based browser and Firefox render the document, subtle effects such as transform and filter() look differently. For example, Firefox is very good at correcting subpixel transformations whereas Chromium isn't. Meanwhile Chromium is great at handling filter while Firefox does it slightly differently.
