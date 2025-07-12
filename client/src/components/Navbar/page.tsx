'use client'

import { Box, Button, Image ,Input,InputGroup,Link,Text} from "@chakra-ui/react"
import { ShoppingCart,Heart,ChevronDown, Search} from "lucide-react";
import { useAuth } from "../../../hooks/userAuth";
import { useEffect, useState } from "react";
import { redirect ,useRouter} from "next/navigation";
import  Products from "../../../store/Productstore"

export const NavbarComponent = ()=>{
    const{user,setUser} = useAuth()
    const[dropDown,setdropDown] = useState<boolean | null>(false)
    const [searchquery,setsearchquery] = useState<string>("")
    const router = useRouter()
    const [showresultbox,setresultbox] =useState<boolean>(false)
    const [resultList,setresultList] = useState<object[]>([])
    const {ProductList,UserCartList,addtoCart} = Products()
   

    function SortResultList(){
      const newList = ProductList?.filter((items:any)=> items?.name.toLowerCase().includes(searchquery.toLowerCase()))
      setresultList(newList)
    }
    async function GetCartProducts() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/getcartdetails`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.userId,
          }),
        }
      );
      const finalRes = await res.json();
      console.log(finalRes?.list);
      addtoCart(finalRes?.list);
    }
    useEffect(()=>{
      SortResultList()
    },[searchquery])

    useEffect(()=>{
      GetCartProducts()
    },[])


    return (
      <Box
        height={["50px", "60px"]}
        width={["100%"]}
        bgColor={["#fff"]}
        borderBottom={["1px solid rgb(226, 226, 226)"]}
        display={["flex"]}
        justifyContent={["start"]}
        alignContent={["center"]}
        color={["#000"]}
        fontFamily={["poppins"]}
        position={["absolute"]}
        top={0}
        left={0}
        zIndex={1}
      >
        {/*Logo*/}
        <Box className="flexed" height={["100%"]} width={["15%", "5%"]}>
          <Link
            href="/user/home"
            className="flexed"
            height={["100%"]}
            width={["100%"]}
          >
            <Image
              src="/logo.jpeg"
              height={["80%"]}
              borderRadius={["40px"]}
            ></Image>
          </Link>
        </Box>
        {/*search bar*/}
        <Box
          height={["100%"]}
          width={["60%"]}
          className="flexed"
          flexDirection={["column"]}
        >
          <InputGroup startElement={<Search />}>
            <Input
              height={["30px", "40px"]}
              fontFamily={["poppins"]}
              letterSpacing={0.5}
              border={["none"]}
              bgColor={["#E3DDDC"]}
              placeholder="What are you looking for?"
              fontSize={["10px", "16px"]}
              onChange={(e)=>{
                setsearchquery(e.target.value)
                setresultbox(true)
              }}
              onKeyDown={(e)=>{
                if(e.key === 'Enter'){
                  router.push(`/user/products/?searchquery=${searchquery}`)
                  setresultbox(false)
                }
              }}
            />
          </InputGroup>
          {searchquery.length>0 && showresultbox ? <Box
            height={["300%"]}
            width={["60%"]}
            position={"absolute"}
            bgColor={"#fff"}
            top={"110%"}
            className="flexed"
            flexDirection={["column"]}
            justifyContent={["flex-start"]}
            gap={[2]}
            overflowY={["scroll"]}
            scrollbar={["hidden"]}
            padding={["10px 10px"]}
            borderRadius={10}
            boxShadow={["2px 2px 30px rgba(0,0,0,0.2)"]}
          >
            {resultList.length>0? resultList?.map((items:any)=>(
              <Link height={["40%"]} width={["100%"]} className="flexed" flex={"0 0 auto"} justifyContent={["flex-start"]} borderBottom={["1px solid rgba(151, 151, 151, 0.36)"]} gap={[4]} href={`/user/products/${items?.id}`}>
                <Image src={items?.images?.image[0]} height={["70%","80%"]} borderRadius={8}/>
                <Text fontSize={["12px","16px"]} color={"gray.600"}>{items?.name}</Text>
              </Link>
            )):<Box width={["100%"]} height={["100%"]} className="flexed" fontSize={["18px"]} color={"gray.400"} fontStyle={"italic"}>Not Found!</Box>}
          </Box>:<Box></Box>}
        </Box>
        {/*Cart icon */}
        <Box
          height={["100%"]}
          width={["20%"]}
          className="flexed"
          justifyContent={["space-around"]}
          display={["none", "flex"]}
        >
          <Link color={["#000"]} href="/user/cart" position={"relative"}>
            <Text position={"absolute"} top={0} right={0} width={["40%"]} className="flexed" backgroundColor={"red"} color={"#fff"} borderRadius={100} fontSize={["10px"]}> {UserCartList?.length}</Text>
            <ShoppingCart size={30} />
          </Link>
          <Link color={["#000"]} href="/user/whishlist">
            <Heart />
          </Link>

          <Link color={["#000"]} href="/user/home">
            Home
          </Link>
          <Link color={["#000"]} href="/user/products">
            Products
          </Link>
          {user?.userType === "admin" ? (
            <Link color={["#000"]} href="/admin/adminpanel">
              Dashboard
            </Link>
          ) : (
            <Link></Link>
          )}
        </Box>
        {/*User info */}
        <Button
          height={["100%"]}
          width={["30%", "15%"]}
          className="flexed"
          flexDirection={["column"]}
          color={["#000"]}
          position={["relative"]}
          border={"none"}
          outline={"none"}
          onClick={() => {
            dropDown ? setdropDown(false) : setdropDown(true);
            console.log(dropDown);
          }}
        >
          <Box
            borderLeft={["1px solid rgb(219, 217, 217)"]}
            className="flexed"
            flexDirection={["column"]}
            width={["100%"]}
            height={["60%"]}
          >
            <Text
              fontSize={["9px", "14px"]}
              color={["gray.400"]}
              className="flexed"
              width={["100%"]}
              height={["100%"]}
            >
              Welcome Back!
            </Text>
            <Text
              fontSize={["12px", "18px"]}
              className="flexed"
              gap={[0, 2]}
              letterSpacing={0.5}
              width={["100%"]}
              height={["100%"]}
            >
              {user?.userName}
              <ChevronDown size={20} />
            </Text>
          </Box>
          {dropDown && (
            <Box
              height={["150px", "200px"]}
              width={["100%"]}
              position={["absolute"]}
              zIndex={10}
              right={0}
              top={"100%"}
              className="flexed"
            >
              <Box
                height={["95%"]}
                width={["95%"]}
                className="flexed"
                flexDirection={["column"]}
                gap={[2, 3]}
                bgColor={"#E7E4E4"}
                borderRadius={["8px"]}
              >
                <Link
                  height={["18%"]}
                  width={["95%"]}
                  color={["#fff"]}
                  className="flexed"
                  bgColor={["#ACA0A0"]}
                  _hover={{ bgColor: "#8B4513" }}
                  href="/user/cart"
                  fontSize={["10px", "14px"]}
                >
                  Cart
                </Link>
                <Link
                  height={["18%"]}
                  width={["95%"]}
                  color={["#fff"]}
                  className="flexed"
                  bgColor={["#ACA0A0"]}
                  _hover={{ bgColor: "#8B4513" }}
                  href="/user/orders"
                  fontSize={["10px", "14px"]}
                >
                  My orders
                </Link>
                <Link
                  height={["18%"]}
                  width={["95%"]}
                  color={["#fff"]}
                  className="flexed"
                  bgColor={["#ACA0A0"]}
                  _hover={{ bgColor: "#8B4513" }}
                  href="/user/whislist"
                  fontSize={["10px", "14px"]}
                >
                  Whistlist
                </Link>
                <Button
                  height={["18%"]}
                  width={["95%"]}
                  color={["#fff"]}
                  className="flexed"
                  bgColor={["red.400"]}
                  _hover={{ bgColor: "red.600" }}
                  fontSize={["10px", "14px"]}
                  onClick={() => {
                    localStorage.removeItem("token");
                    return redirect("/");
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          )}
        </Button>
      </Box>
    );
}

