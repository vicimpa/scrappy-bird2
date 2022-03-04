import "index.sass";

import { createDOM } from "lib/Utils";
import { render } from "react-dom";
import { GameComponent } from "view/Game";

import { isPWA } from "../config.json";

const app = document.getElementById('app');
render(<GameComponent />, app);

if (isPWA && location.protocol == 'https:') {
  const appendTo = document.head;

  createDOM('link', { rel: 'manifest', href: './manifest.json', appendTo });
  createDOM('link', { rel: 'shortcut icon', href: 'favicon.png', type: 'image/png', appendTo });

  addEventListener("load", () => {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistration('./service.js')
        .then(e => e ? e : navigator.serviceWorker
          .register("./servise.js", {
            scope: location.pathname
          }))
        .catch(() => { });
    }

    window.matchMedia(
      '(display-mode: standalone)'
    ).matches;
  });
}

