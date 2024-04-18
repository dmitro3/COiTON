import { useEffect, useState } from "react";

export const useFetchNews = () => {
  const [data, setData] = useState({
    allNews: [],
    isLoading: false,
    isError: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setData((prevData) => ({ ...prevData, isLoading: true }));
      try {
        const url = `https://newsapi.org/v2/everything?q=RealEstate&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`;

        const response = await fetch(url);
        const responseData = await response.json();

        if (response.ok) {
          // Filter out articles with the specified URL
          const filteredNews = responseData.articles.filter(
            (article: any) => article.url !== "https://removed.com"
          );

          setData({
            allNews: filteredNews,
            isLoading: false,
            isError: "",
          });
        } else {
          setData({
            allNews: [],
            isLoading: false,
            isError: responseData.message,
          });
        }
      } catch (error: any) {
        console.error(error);
        setData({
          ...data,
          isLoading: false,
          isError: error.message,
        });
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect will only run once after initial render

  return data;
};
