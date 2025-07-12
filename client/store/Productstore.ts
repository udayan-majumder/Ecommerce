import { create } from "zustand";

interface ProductType{
    ProductList:object[],
    loading:boolean,
    ProductCategory:object[],
    UserCartList:object[],
    cartLoading:boolean,
    TotalPrice:number,
    UserOrders:object[],
    TopSellingList:object[],
    setProductList:(list:object[]) =>  void,
    setLoading:(args:boolean) => void,
    setCategory:(list:object[]) =>void,
    setcartLoading:(args:boolean)=>void,
    addtoCart:(data:object[]) =>void,
    setTotalPrice:(data:number) =>void,
    setUserOrders:(data:object[]) => void
    setTopSellingList:(data:object[]) => void

}


const Products = create<ProductType>((set)=>({
    ProductList:[],
    loading:true,
    ProductCategory:[],
    UserCartList:[],
    cartLoading:true,
    TotalPrice:0,
    UserOrders:[],
    TopSellingList:[],
    setProductList:(list)=> set({ProductList:list}),
    setLoading:(args)=>set({loading:args}),
    setCategory:(list)=>set({ProductCategory:list}),
    setcartLoading:(args)=>set({cartLoading:args}),
    addtoCart:(data)=>set(({
      UserCartList:data
    })),
    setTotalPrice:(data)=>set({
      TotalPrice:data
    }),
    setUserOrders:(data)=>set({UserOrders:data}),
    setTopSellingList:(data) =>set({TopSellingList:data})
}))


export default Products