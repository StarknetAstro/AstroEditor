import {create} from "zustand";
import {persist} from "zustand/middleware";

interface StoreState {
    isReplaceIds: boolean;
    cairoVersion: string;
    printFullMemory: boolean;
    useCairoDebugPrint: boolean;
    availableGas: string;
    setData: (v: Partial<StoreState>) => void
}

export const useSettingStore = create<StoreState>()(
    persist(
        (set, get) => ({
            isReplaceIds: false,
            cairoVersion: '2.0',
            printFullMemory: false,
            useCairoDebugPrint: false,
            availableGas: '',
            setData: (v: Partial<StoreState>) => set({ ...get(), ...v }),
        }),
        {
            name: 'astro-setting-storage', // name of the item in the storage (must be unique)
        },
    ),
)
