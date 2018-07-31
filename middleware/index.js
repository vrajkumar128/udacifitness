import { applyMiddleware } from 'redux';
import logger from './logger';

// Create middleware stack
export default applyMiddleware(logger);
