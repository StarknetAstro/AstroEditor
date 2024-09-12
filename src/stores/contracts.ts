import {create} from "zustand";
import {persist} from "zustand/middleware";


interface StoreState {
    contracts: Record<string, any>;
    setData: (v: Partial<StoreState>) => void
}

export const useContractStore = create<StoreState>()(
    persist(
        (set, get) => ({
            contracts: {},
            setData: (v: any) => {
                set({ contracts: {...get().contracts, ...v} })
            },
        }),
        {
            name: 'astro-contracts-storage', // name of the item in the storage (must be unique)
        },
    ),
)