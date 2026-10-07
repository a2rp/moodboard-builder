# Moodboard Builder

Moodboard Builder is a small visual workspace for collecting references and shaping a creative direction. Set a brief and color story, browse a curated photo library, arrange images and notes on a canvas, then save a snapshot or export a JSON summary.

**Live site:** [https://a2rp.github.io/moodboard-builder/](https://a2rp.github.io/moodboard-builder/)

## What is included

- A fixed header with links to the board, inspiration library, saved boards, and guide. The Repository link opens this project's public GitHub repository and remains labeled on mobile.
- A board brief with an editable name, short creative description, four moods, and three color stories. The title, mood, and palette update across the workspace as you edit.
- A visual canvas with locally stored photo references and editable note cards. Move a piece earlier or later with its arrow buttons. Removing a piece or starting a new board asks for confirmation.
- A searchable inspiration library with category filters for spaces, landscapes, nature, and objects. Add a reference once; its button shows when it is already on the board.
- Saved snapshots that restore the full brief, mood, palette, images, and notes. You can keep up to 12 snapshots in this browser and remove one after confirmation.
- A JSON export with the board brief and a list of photo references and notes. It does not create a flattened image file.
- A three-step guide, a two-sided footer with profile and support links, responsive layouts, and a Back to top button after scrolling more than 50px.

## Use the board

1. Edit the board name and creative brief in the left panel. Choose a feeling and color story to set the tone.
2. Search the inspiration library by keyword or category. Select **Add** to place a photo on the canvas.
3. Add and edit notes, move references with the arrow controls, or remove a piece when it no longer fits. Removal asks you to confirm.
4. Select **Save snapshot** to keep a version for later comparison. Use **Restore board** in Saved boards to bring that version back into the editor.
5. Select **Export board** to download a JSON summary of the current direction.

## Data and limits

The working draft is stored in local storage under `moodboard-builder-working-board`. Saved snapshots are stored separately under `moodboard-builder-saved-boards`, with a limit of 12 snapshots per browser. The data stays on the current device and is not synced between browsers or shared with other visitors. Clearing browser site data removes the draft and saved snapshots.

The 21 photo references are selected from Lorem Picsum, checked for visual relevance, and stored in `public/images`. The app loads those local files, so using the board does not make runtime requests to Picsum. The JSON export describes the board and points to local photo paths; it does not embed image data. There is no image upload, cloud sync, or PNG/PDF export.

## Run locally

```sh
npm install
npm run dev
```

Run the project checks and publish from the project folder:

```sh
npm run lint
npm run build
npm run deploy
```

The deploy script builds the app and publishes `dist` to the `gh-pages` branch. It does not use a GitHub Actions deployment workflow.

**Deployed URL:** [https://a2rp.github.io/moodboard-builder/](https://a2rp.github.io/moodboard-builder/)

## Future improvements

The following are ideas only and are not implemented:

- Upload personal images and crop them inside the board.
- Drag references directly to rearrange the canvas.
- Export a composed board as PNG or PDF.
- Sync boards between devices or collaborate with a team.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
