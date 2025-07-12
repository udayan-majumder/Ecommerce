import {create} from 'zustand'

interface information{
    PromocodesList:object[],
    UserAddress:object[],
    setPromocode:(data:object[])=> void,
    setAddress:(data:object[])=>void
}

const Essential = create<information>((set)=>({
    PromocodesList:[],
    UserAddress:[],
    setPromocode:(data)=>set({PromocodesList:data}),
    setAddress:(data)=>set({UserAddress:data})
}))

export default Essential