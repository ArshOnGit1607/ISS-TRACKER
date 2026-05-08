import axios from 'axios';

const SPACEFLIGHT_NEWS_API = 'https://api.spaceflightnewsapi.net/v4/articles/';

export const fetchNewsArticles = async (limit = 30) => {
  const response = await axios.get(SPACEFLIGHT_NEWS_API, {
    params: {
      limit
    }
  });
  return response.data;
};
