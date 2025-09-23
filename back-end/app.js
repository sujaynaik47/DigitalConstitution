const express = require('express');

function createApp() {
  const app = express();
  app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
  return app;
}

if (require.main === module) {
  const app = createApp();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}

module.exports = createApp;
