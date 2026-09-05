import 'dotenv/config';
import {initializeStore} from './mongo.js';

try {
  const store = await initializeStore();
  console.log(JSON.stringify({initialized:true,...store},null,2));
  process.exit(0);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
