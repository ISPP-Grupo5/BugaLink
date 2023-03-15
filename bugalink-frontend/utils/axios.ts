// create custom axios instance

import axios from 'axios';

export default axios.create({
  baseURL:
    process.env.NODE_ENV === 'production' // TODO: untested. THIS IS NOT THE CORRECT API URL YET!!
      ? 'https://bugalink.es/api'
      : 'http://localhost:3001/api',
});
