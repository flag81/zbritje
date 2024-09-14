import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";


const useFetchData = () => {
  const getData = async () => {
    const {data} = await axios.get(
        `https://api.thedogapi.com/v1/breeds?limit=10&page=${pageParam}`,
      
    {
      params : {
        page: 1,
      }
    })


    return data;
  };
  return useInfiniteQuery({
    queryKey: ["getData"],
    queryFn: getData,
    getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length === 0) return undefined;
      return allPages.length + 1;
    }
  });
}