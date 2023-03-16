import axios from 'axios';

export default axios.create({
  baseURL:
    process.env.NODE_ENV === 'production' // TODO: untested. THIS IS NOT THE CORRECT API URL YET!!
      ? process.env.PRODUCTION_API_URL || 'https://app.bugalink.es/api'
      : `http://localhost:${process.env.PORT || 3030}/api`,
});
