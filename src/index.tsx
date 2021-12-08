import "index.sass";

import { render } from "react-dom";
import { GameComponent } from "view/Game";

const app = document.getElementById('app');
render(<GameComponent />, app);

if (location.protocol == 'https:') {
  document.head.innerHTML += (`
    <link rel="manifest" href="./manifest.json">
    <link rel="shortcut icon" href="favicon.png" type="image/png">
  `);

  addEventListener("load", () => {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistration('./service.js')
        .then(e => e ? e : navigator.serviceWorker
          .register("./servise.js", {
            scope: location.pathname
          }))
        .catch(() => { });
    }
  });
}

