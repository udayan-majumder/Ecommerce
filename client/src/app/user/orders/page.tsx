'use client'

import { useAuth } from "../../../../hooks/userAuth"
import { useRouter,usePathname ,redirect} from "next/navigation"
import { Box ,Image,Text,Breadcrumb,Link,Button,Spinner} from "@chakra-ui/react"
import { NavbarComponent } from "@/components/Navbar/page"
import { useEffect,useRef } from "react"
import { ChevronLeft,ChevronRight, PackageSearch} from "lucide-react"
import Products from "../../../../store/Productstore"
function MyOrderPage(){

const {user} = useAuth()
const pathname = usePathname()
const {UserOrders,setUserOrders} = Products()
const scrollRef = useRef<HTMLDivElement>(null)
const router = useRouter();




  useEffect(()=>{
    if(!user){
      return redirect("/auth/login")
    }
  },[user])

const getOrders = async()=>{
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/getpaymentdetails`,{
    method:'POST',
    headers:{
      'Content-type':'application/json'
    },
    body:JSON.stringify({
      "userId":user.userId
    })
  })
  
  const finalRes = await res.json()
  setUserOrders(finalRes?.paymentlist)

}

useEffect(()=>{
  getOrders()
},[])
if(UserOrders){
  return (
    <Box
      height={"100vh"}
      width={["100%"]}
      color={"#000"}
      bgColor={"#fff"}
      className="flexed"
      flex={"0 0 auto"}
      flexDirection={["column"]}
      justifyContent={["flex-start"]}
      gap={4}
      fontFamily={"poppins"}
    >
      <NavbarComponent />
      <Image
        src="/bgbackgroundproductpage.jpg"
        height={["30%"]}
        width={["100%"]}
      />
      <Text width={["95%"]} fontSize={["20px", "35px"]}>
        My Orders
      </Text>
      <Breadcrumb.Root width={["95%"]}>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" color={"#000"}>
              Home
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" color={"brown"}>
              Orders
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <Box
        height={["55%"]}
        width={["95%"]}
        position={"relative"}
        className="flexed"
      >
        <Button
          display={["none", "block"]}
          position={"absolute"}
          left={0}
          onClick={() => {
            scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
          }}
        >
          <ChevronLeft />
        </Button>
        <Box
          height={["100%"]}
          width={["95%"]}
          display={["flex"]}
          flexWrap={["nowrap"]}
          flex={"0 0 auto"}
          flexDirection={["column", "row"]}
          justifyContent={["flex-start"]}
          gap={10}
          overflow={["scroll"]}
          overflowX={["hidden", "scroll"]}
          overflowY={["scroll", "hidden"]}
          padding={["10px 10px"]}
          letterSpacing={0.5}
          ref={scrollRef}
          scrollbar={"hidden"}
        >
          {UserOrders.length>0?UserOrders.map((items: any) => (
            <Button
              minHeight={["80%", "100%"]}
              minWidth={["100%", "25%"]}
              // bgColor={"red"}
              flex={"0 0 auto"}
              className="flexed"
              boxShadow={"5px 5px 20px rgba(0,0,0,0.3)"}
              borderRadius={10}
              color={"#000"}
              textDecoration={"none"}
              onClick={()=>{router.push(`/user/products/${items?.productid}`)}}
            >
              <Box
                height={["95%"]}
                width={["95%"]}
                display={"flex"}
                flexDirection={["column"]}
                justifyContent={"flex-start"}
                alignItems={["center"]}
                gap={5}
              >
                <Box
                  height={["10%"]}
                  width={["98%"]}
                  className="flexed"
                  justifyContent={["space-between"]}
                >
                  <Text color={"teal"} fontSize={["8px", "10px"]}>
                    #{items?.orderid} | {items?.time}
                  </Text>
                  <Text
                    bgColor={
                      items?.orderstatus === "OrderPlaced"
                        ? "green.600"
                        : items?.orderstatus === "Shipped"
                        ? "orange.600"
                        : items?.orderstatus === "Out For Delivery"
                        ? "red.500"
                        : "teal"
                    }
                    padding={["6px 10px"]}
                    borderRadius={"20px"}
                    color={"#fff"}
                    fontSize={["10px", "12px"]}
                  >
                    {items?.orderstatus}
                  </Text>
                </Box>
                <Box height={["60%"]} width={["100%"]} className="flexed">
                  <Image
                    height={["100%"]}
                    width={["80%"]}
                    src={items?.userproducts?.images?.image[0]}
                    className="flexed"
                    borderRadius={10}
                  />
                </Box>

                <Box
                  height={["10%"]}
                  width={["100%"]}
                  className="flexed"
                  color={"gray.500"}
                  fontSize={["14px", "18px"]}
                >
                  {items?.userproducts?.name}
                </Box>
                <Box
                  height={["10%"]}
                  width={["90%"]}
                  className="flexed"
                  justifyContent={["space-between"]}
                >
                  <Text>Total amount : {items?.productprice} $</Text>
                  <Text>qty : {items?.qty}</Text>
                </Box>
              </Box>
            </Button>
          )):<Box height={["100%"]} width={["100%"]} className="flexed" flexDirection={["column"]} gap={[10]}>
             <Text fontSize={["24px"]} color={"gray.400"} fontStyle={"italic"}>No Items Yet!</Text>
             <Link height={["10%"]} width={["60%","12%"]} bgColor={"brown"} className="flexed" borderRadius={10} fontSize={"16px"} gap={[2]} href="/user/products">Browse Products <PackageSearch/></Link>
            </Box>}
        </Box>
        <Button
          display={["none", "block"]}
          position={"absolute"}
          right={0}
          onClick={() => {
            scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
          }}
        >
          <ChevronRight />
        </Button>
      </Box>
    </Box>
  );    
}
else{
     <Box
        height={["100vh"]}
        width={["100%"]}
        className="flexed"
        flexDirection={["column"]}
        gap={2}
        bgColor={["#fff"]}
      >
        <Spinner size="xl" color={["#8B4513"]} />
        <Text fontFamily={["poppins"]} fontSize={["30px"]} color={["#8B4513"]}>
          Loading
        </Text>
      </Box>
}

}

export default MyOrderPage