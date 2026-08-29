import 'dotenv/config';
import {initializeClickCounters} from './mongo.js';

try {
  const counters = await initializeClickCounters();
  console.log(JSON.stringify({initialized:true,templates:counters},null,2));
  process.exit(0);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
