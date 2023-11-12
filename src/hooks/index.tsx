import useSWR from "swr";
import {useEffect, useState} from "react";
import {default as useInfinite} from "swr/infinite";
import { API } from "@/services/friend";

const fetcher = (url: string) => fetch(API + url).then(r => r.json())

const getPageKey = (pageIndex: number, previousPageData: any, prefix: string) => {
    console.log(previousPageData, pageIndex)
    // 已经到最后一页
    if (previousPageData && !previousPageData.nextPageStart) return null

    // 在首页时，没有 `previousPageData`
    if (pageIndex === 0) return `${prefix}`

    // 将游标添加到 API
    return `${prefix}&pageStart=${previousPageData.nextPageStart}`
}

export const useLoadMore = (prefix: string) => {
    const { data, size, setSize} = useInfinite((...args) => getPageKey(...args, prefix), fetcher);

    return {
        data: data ? data?.map(it => it.users).flat() : [],
        loadMore: () => setSize(size+1),
        isEnd: data?.length ? (!data![data?.length! -1].nextPageStart || data![data?.length! -1].users?.length < 49) : true
    }
}

export const useSWRInfinite = (key: string[], service: (...arg: any) => any, params: any) => {
    const [allData, setAllData] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [nextPage, setNextPage] = useState(0);
    const { data } = useSWR([page, ...key], () => service({...params, page}));

    useEffect(() => {
        if (data) {
            setAllData([...allData, data]);
            setNextPage(data.nextPageStart);
        }
    }, [data]);

    return {
        data: allData,
        nextPage,
        setPage,
    }

}