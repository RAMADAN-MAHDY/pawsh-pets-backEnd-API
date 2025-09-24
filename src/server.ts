import app from './app.js';
import config from './config/config.js';

app.listen(config.port, () => {
  console.log(`Server running on port http://localhost:${config.port}`);
});