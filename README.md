# Frontend Mentor - Browser extensions manager UI solution

This is a solution to the [Browser extensions manager UI challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/browser-extension-manager-ui-yNZnOfsMAp). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

**Note: Delete this note and update the table of contents based on what sections you keep.**

## Overview

### The challenge

Users should be able to:

- Toggle extensions between active and inactive states
- Filter active and inactive extensions
- Remove extensions from the list
- Select their color theme
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Screenshot

![Design preview for the Browser extensions manager UI coding challenge](./design/preview.jpg)

### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup
- Flexbox
- CSS Grid
- Mobile-first workflow
- [TailwindCSS v4](https://tailwindcss.com/) - TailwindCSS
- [Angular](https://angular.dev/) - Frontend framework

### What I learned

#### 1. Accessible filter buttons

To make a group of filter buttons accessible, ensure they are semantically grouped using `role="group"` or `role="toolbar"`, and labeled using `aria-label` or `aria-labelledby`, and that the selected button's state is indicated using `aria-pressed`.

Here's a more detailed breakdown:

**Semantic Grouping:**

- Use `role="group"` for a simple button group or `role="toolbar"` for a more complex toolbar with multiple groups.

**Labeling:**

- Use `aria-label="Filter Options"` or `aria-labelledby="filter-label"` to provide a descriptive label for the entire group.
- If you have a separate label element, use `aria-labelledby="filter-label"` to link the label to the button group.

**Selected State:**

- Use `aria-pressed="true"` on the currently selected button to indicate its state to screen reader users.
- When a button is toggled, ensure the `aria-pressed` attribute updates accordingly.

**Keyboard Navigation:**

- Ensure the filter group is a single tab stop, allowing users to navigate to it with the tab key.
- Use arrow keys to navigate within the filter group.

**Visual Cues:**

- Provide distinct visual cues for different button states (hover, focus, active).
- Ensure sufficient color contrast between the button text and background.

**Example:**

```html
<div role="group" aria-label="Filter Options">
  <button aria-pressed="false">All</button>
  <button aria-pressed="true">Active</button>
  <button aria-pressed="false">Inactive</button>
</div>
```

### Continued development

Use this section to outline areas that you want to continue focusing on in future projects. These could be concepts you're still not completely comfortable with or techniques you found useful that you want to refine and perfect.

**Note: Delete this note and the content within this section and replace with your own plans for continued development.**

### Useful resources

- [Example resource 1](https://www.example.com) - This helped me for XYZ reason. I really liked this pattern and will use it going forward.
- [Example resource 2](https://www.example.com) - This is an amazing article which helped me finally understand XYZ. I'd recommend it to anyone still learning this concept.

**Note: Delete this note and replace the list above with resources that helped you during the challenge. These could come in handy for anyone viewing your solution or for yourself when you look back on this project in the future.**

## Author

- Website - [Add your name here](https://www.your-site.com)
- Frontend Mentor - [@iediong](https://www.frontendmentor.io/profile/iediong)
- Twitter - [@iediong](https://www.twitter.com/yourusername)

**Note: Delete this note and add/remove/edit lines above based on what links you'd like to share.**

## Acknowledgments

This is where you can give a hat tip to anyone who helped you out on this project. Perhaps you worked in a team or got some inspiration from someone else's solution. This is the perfect place to give them some credit.

**Note: Delete this note and edit this section's content as necessary. If you completed this challenge by yourself, feel free to delete this section entirely.**
