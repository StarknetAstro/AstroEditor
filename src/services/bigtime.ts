import request from "@/utils/request.ts";

export const getItems = ():Promise<any> => {
    return request({
        url: '/items',
    })
}

// GET item/orders/{archetypeId}
export const getOrders = (archetypeId: string):Promise<any> => {
    return request({
        url: `/item/orders/${archetypeId}?on_sale=true`,
    })
}

export interface ItemType {
    id: number;
    archetypeId: string;
    issuedId: number;
    sellDate: number;
    orderType: string;
    fromUser: string;
    toUser: string;
    price: string;
    crawlerCreatedAt: number;
    crawlerUpdatedAt: number;
}

// GET /item/activity/BT0_IronBoy_2H_Sword
export const getActivity = (archetypeId: string, time: string):Promise<{data: {list: ItemType[]}}> => {
    return request({
        url: `/item/activity/${archetypeId}?date=${time}`,
    })
}