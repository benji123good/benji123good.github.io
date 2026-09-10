# Games host folder

Host this directory separately from the storefront, or keep it in the same GitHub Pages repository. Each game lives in its own folder and is described in `catalog.json`.

```text
games/
  catalog.json
  neon-runner/
    index.html
    cover.jpg
    assets/
```

For every game, add an object to the `games` array:

```json
{
  "id": "unique-game-id",
  "title": "Game name",
  "genre": "Arcade",
  "description": "Short store description.",
  "cover": "./my-game/cover.jpg",
  "url": "./my-game/index.html",
  "tags": ["Tag one", "Tag two"]
}
```

Use relative paths so the catalog can be moved to any static host. Set `featured` to a game's `id` to put it in the banner.
