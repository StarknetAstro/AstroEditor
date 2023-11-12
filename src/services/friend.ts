import axios from "axios";

export const API = 'https://ijcne6t9dy.us.aircode.run/';
export const getNewest = () => {
    return fetch(API + 'api-newest').then(res => res.json());
}

// https://ijcne6t9dy.us.aircode.run/api-user

export const getUser = (address: string) => {
    return fetch(API + `api-user?address=${address}`).then(res => res.json());
}

export const getUserByName = (name: string) => {
    // 'https://prod-api.kosetto.com/search/users?username=KalliopeSa49091'
    // 'https://api.twitterscan.com/appapi/scia-tw/kol-detail?username='+name

    return fetch(API + `api-twitter-user?username=${name}`).then(res => res.json());
}

// https://ijcne6t9dy.us.aircode.run/api-top
export const getTopUser = () => {
    return fetch(API + 'api-top').then(res => res.json());
}

// https://ijcne6t9dy.us.aircode.run/api-holding
export const getHolding = ({address, page}:{address: string, page?: string}) => {
    return axios(API + `api-holding?address=${address}`, {
        params: {
            pageStart: page
        }
    }).then(res => res.data);
}

export const getHolder = ({address, page}:{address: string, page?: string}) => {
    return axios(API + `api-holder?address=${address}`, {
        params: {
            pageStart: page
        }
    }).then(res => res.data);
}

// https://ijcne6t9dy.us.aircode.run/api-activity
export const getActivity = ({address, page}:{address: string, page?: string}) => {
    return axios(API + `api-activity?address=${address}`, {
        params: {
            pageStart: page
        }
    }).then(res => res.data);
}

export const fetcher = (url: string) => axios.get(url).then(res => res.data)

export const getHoldingKey = (address: string, previousPageData?: any) => {
    console.log(previousPageData, 'previousPageData')
    return `${API}api-holding?address=${address}${previousPageData?.pageStart ? `&pageStart=${previousPageData.pageStart}` : ''}`
}



// https://ijcne6t9dy.us.aircode.run/api-chart

export const getChart = (address: string) => {
    return fetch(API + `api-chart?address=${address}`).then(res => res.json());
}

// https://ijcne6t9dy.us.aircode.run/api-search

export const getSearch = (keyword: string) => {
    return fetch(API + `api-search?name=${keyword}`).then(res => res.json());
}

//getHolder