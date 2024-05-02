import { useEffect, useState } from "react";

export const useFetchNews = () => {
  const [articles, setArticles] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch initial news on component mount

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=pub_426623565acca0aa0428db885304f33b19218&q=real%20estate&country=ng,kr,ae,gb,us&language=en${
          nextPage ? nextPage : ""
        }`
      );
      const data = await response.json();
      if (data?.results) {
        setArticles((prevArticles: any) => [...prevArticles, ...data.results]);
      }
      setNextPage(data?.nextPage);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreNews = () => {
    if (nextPage) {
      setNextPage(nextPage);
    }
  };

  return { articles, loadMoreNews, isLoading };
};
