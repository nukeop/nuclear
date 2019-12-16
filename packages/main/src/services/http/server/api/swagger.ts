import express, { Router } from 'express';
// import swagger from 'swagger-spec-express';

import Store from '../../../store';
import swaggerJson from '../swagger.json';

export function swaggerRouter(store: Store): Router {
  const router = express.Router();

  router.get('/swagger.json', (req, res) => {
    res.json(swaggerJson);
  });

  router.get('/', (req, res) => {
    const PORT = store.getOption('api.port');

    res.setHeader('Content-Type', 'text/html');
    res.send(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Nuclear API docs</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.21.0/swagger-ui.css" >
    <style>
      html
      {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
      }
      *,
      *:before,
      *:after
      {
        box-sizing: inherit;
      }
      body
      {
        margin:0;
        background: #fafafa;
      }
    </style>
  </head>

  <body>
    <div id="swagger-ui"></div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.21.0/swagger-ui-bundle.js"> </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.21.0/swagger-ui-standalone-preset.js"> </script>
    <script>
    window.onload = function() {

      const ui = SwaggerUIBundle({
        url: "http://localhost:${PORT}/nuclear/docs/swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      })

      window.ui = ui
    }
  </script>
  </body>
</html>
      `);
  });

  return router;
}

