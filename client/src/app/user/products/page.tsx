"use client";
import {
  Box,
  Image,
  Breadcrumb,
  Text,
  Checkbox,
  Slider,
  Input,
  InputGroup,
  Field,
  Button,
} from "@chakra-ui/react";
import { NavbarComponent } from "@/components/Navbar/page";
import { useAuth } from "../../../../hooks/userAuth";
import { redirect ,useSearchParams} from "next/navigation";
import { useEffect, useState } from "react";
import Products from "../../../../store/Productstore";
import { usePathname } from "next/navigation";
import { LayoutGrid ,BetweenHorizonalEnd,AlignCenter} from "lucide-react";
import { ProductCards } from "@/components/cards/page";
import toast, { Toaster } from "react-hot-toast";

function ProductPage() {
  const { user, setUser } = useAuth();
  const { ProductList, loading, ProductCategory ,addtoCart} = Products();
  const pathname = usePathname();
  const [tempProducts, settempProducts] = useState<object[]>([{}]);
  const [tempCategory, setCategory] = useState<string[]>([]);
  const [minPrice, setminPrice] = useState<number>(0);
  const [maxPrice, setmaxPrice] = useState<number>(10000);
  const [gridView,setgridView] = useState<boolean>(true)
  const [horizontalView,sethorizontalView] = useState<boolean>(false)
  const [sortLoading,setsortLoading] = useState<boolean>(false)
  const  [showFilter,setshowfilter] = useState<boolean>(true)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('searchquery')
 
  if (!user) {
    localStorage.setItem("path", pathname);
    return redirect("/");
  }

  function sortProducts() {
    setsortLoading(true)
    let temp = ProductList;

    if(searchQuery){
      temp = temp.filter((items:any)=> items?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    console.log(searchQuery)
    if(tempCategory.length>0){
      temp = temp.filter((items:any)=> tempCategory.includes(items.category));
    }

    temp = temp.filter((items:any)=> items.price > minPrice && items.price < maxPrice)

    settempProducts(temp)
    setsortLoading(false)
 
  }

  function removecategory(value: string) {
    const newarray = tempCategory?.filter((items) => !items.includes(value));
    setCategory(newarray)
  }

  async function AddToCartHandler(data: any) {
   const loader =toast.loading("adding", {
      position: "bottom-right",
      style: {
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "poppins",
        letterSpacing: 0.5,
      },
    });
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/addtocart`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.userId,
          productId: data?.id,
          productDetails: data,
          qty: 1,
        }),
      }
    );
    toast.dismiss(loader)
    const finalres = await res.json();
    if(finalres.message === "already added to cart"){
      toast.error("already added to the cart", {
        position: "bottom-right",
        style: {
          backgroundColor:"red",
          color:"#fff",
          fontFamily: "poppins",
          letterSpacing: 0.5,
          fontSize: "14px",
          fontWeight:500
        },
      });
    }else{
      toast.success("Product successfully added to the cart", {
        position: "bottom-right",
        style: {
          fontFamily: "poppins",
          letterSpacing: 0.5,
          fontSize: "14px",
        },
      });
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
  }


  useEffect(() => {
    if (!loading) {
      sortProducts();
    }
  }, [loading, tempCategory, minPrice, maxPrice,searchQuery]);
  return (
    <Box
      height={["100vh"]}
      width={["100%"]}
      bgColor={["#F1F3F6"]}
      className="flexed"
      flexDirection={["column"]}
      justifyContent={["start"]}
      color={"#000"}
    >
      <Toaster />
      <NavbarComponent />
      {/*backfround image */}
      <Box
        height={["20%", "30%"]}
        width={["100%"]}
        className="flexed"
        //  opacity={0.8}
        bgColor={"#000"}
        zIndex={0}
      >
        <Image
          src="/bgbackgroundproductpage.jpg"
          alt="loading..."
          height={["100%"]}
          width={["100%"]}
        />
      </Box>
      {/*Bread crum */}
      <Box
        height={["3%", "5%"]}
        width={["94%"]}
        className="flexed"
        justifyContent={["left"]}
      >
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link
                href="/user/home"
                color={["#000"]}
                _hover={{ color: "#323232" }}
                fontFamily={["poppins"]}
                letterSpacing={0.5}
                fontSize={["10px", "14px"]}
              >
                Home
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Link
                href="/user/products"
                color={["brown"]}
                _hover={{ color: "#323232" }}
                fontFamily={["poppins"]}
                letterSpacing={0.5}
                fontSize={["10px", "14px"]}
              >
                Products
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Box>
      {/*Results Box */}
      <Box
        height={["3%"]}
        width={["94%"]}
        className="flexed"
        justifyContent={["left"]}
        padding={["30px 0px"]}
      >
        <Text
          fontFamily={["poppins"]}
          letterSpacing={0.5}
          color={"#000"}
          fontSize={["16px", "25px"]}
          fontWeight={600}
        >
          Total Results {tempProducts.length}
        </Text>
      </Box>
      {/*product container */}
      <Box
        height={["70%", "60%"]}
        width={["100%"]}
        display={["flex"]}
        flexDirection={["row"]}
        justifyContent={["center"]}
        alignItems={["start"]}
        fontFamily={"poppins"}
        
        // padding={["20px 0px"]}
      >
        <Box
          height={["100%"]}
          width={["30%", "20%"]}
          className="flexed filterBox"
          display={showFilter ? "flex" : "none"}
          alignItems={["start"]}
          transition={"all 2s ease-in-out"}
          
          // animation={}
        >
          <Box
            height={["98%"]}
            width={["90%", "70%"]}
            borderRadius={"10px"}
            className="flexed"
            flexDirection={["column"]}
            justifyContent={["start"]}
            gap={1}
            bgColor={"#fff"}
          >
            <Box
              width={["100%"]}
              height={"35px"}
              padding={"0px 10px"}
              letterSpacing={0.5}
              alignContent={"center"}
              // borderRadius={"10px"}
              borderBottom={["1px solid rgb(226, 226, 226)"]}
            >
              Filter
            </Box>
            <Box
              height={["40%", "50%"]}
              width={["100%"]}
              bgColor={"#fff"}
              borderRadius={"10px"}
              // boxShadow={"0px 0px 1px 1px rgba(0,0,0,0.1)"}
              className="flexed"
              flexDirection={["column"]}
              justifyContent={"start"}
            >
              <Text
                fontSize={["11px", "13px"]}
                width={["90%"]}
                height={["15%"]}
                alignContent={"center"}
                fontWeight={500}
                // color={"gray.500"}
              >
                Category
              </Text>
              {ProductCategory.map((data: any, index: number) => (
                <Checkbox.Root
                  key={index}
                  height={"15%"}
                  width={"90%"}
                  value={data?.category}
                  onChange={(e: any) => {
                    if (e?.target?.checked) {
                      if (tempCategory.length !== 0) {
                        setCategory((prev) => [...prev, e?.target?.value]);
                      } else {
                        setCategory([e?.target?.value]);
                      }
                    } else {
                      removecategory(e?.target?.value);
                    }
                  }}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Label
                    width={"90%"}
                    fontWeight={300}
                    fontSize={["8px", "13px"]}
                  >
                    {data?.category}
                  </Checkbox.Label>
                  <Checkbox.Control
                    height={["15px", "18px"]}
                    width={["15px", "18px"]}
                  />
                </Checkbox.Root>
              ))}
            </Box>
            <Box
              height={"30%"}
              width={["100%"]}
              bgColor={"#fff"}
              borderRadius={"10px"}
              // boxShadow={"0px 0px 1px 1px rgba(0,0,0,0.1)"}
              className="flexed"
              flexDirection={["column"]}
              justifyContent={"start"}
              gap={2}
            >
              <Text
                width={["90%"]}
                height={"40px"}
                alignContent={"center"}
                fontSize={["12px", "14px"]}
                fontWeight={500}
              >
                Price
              </Text>

              <Slider.Root
                width={["95%"]}
                defaultValue={[0, 10000]}
                min={0}
                max={10000}
                step={100}
                onValueChange={(val) => {
                  setminPrice(val.value[0]);
                  setmaxPrice(val.value[1]);
                }}
              >
                <Slider.Control>
                  <Slider.Track bgColor={"#8B4513"} height={"3px"}>
                    <Slider.Range bgColor={"#C19A6B"} />
                  </Slider.Track>
                  <Slider.Thumbs
                    height={["12px", "15px"]}
                    width={["12px", "15px"]}
                  />
                </Slider.Control>
              </Slider.Root>

              <Box
                // height={["80%"]}
                width={["90%"]}
                className="flexed"
                gap={2}
                justifyContent={["space-around"]}
              >
                <InputGroup>
                  <Field.Root>
                    <Field.Label fontSize={["8px", "12px"]}>
                      Min Price
                    </Field.Label>
                    <Input
                      height={["20px", "40px"]}
                      value={minPrice}
                      onChange={(e: any) => {
                        setminPrice(e.target.value);
                      }}
                      fontSize={["10px", "14px"]}
                    />
                  </Field.Root>
                </InputGroup>

                <InputGroup>
                  <Field.Root>
                    <Field.Label fontSize={["8px", "12px"]}>
                      Max Price
                    </Field.Label>
                    <Input
                      height={["20px", "40px"]}
                      value={maxPrice}
                      onChange={(e: any) => {
                        setmaxPrice(e.target.value);
                      }}
                      fontSize={["10px", "14px"]}
                    />
                  </Field.Root>
                </InputGroup>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          height={["100%"]}
          width={showFilter ? ["70%", "80%"] : ["100%"]}
          className="flexed productBox"
          flexDirection={["column"]}
          bgColor={"#fff"}
          borderRadius={"10px"}
          padding={"10px 0px"}
        >
          <Box
            height={["5%", "10%"]}
            width={["95%"]}
            // alignContent={"center"}
            className="flexed"
            justifyContent={"start"}
            borderBottom={"1px solid rgb(228, 225, 225)"}
            padding={"3px 0px"}
            gap={3}
          >
            <Box
              alignContent={["center"]}
              height={["100%", "80%"]}
              width={["20%", "5%"]}
              className="flexed"
              bgColor={"#E7EBEC"}
              borderRadius={["5px", "10px"]}
              // padding={"20px 0px"}
            >
              <Button
                height={["80%", "70%"]}
                width={["50%", "40%"]}
                p="2.5"
                minW={"unset"}
                // lineHeight={"1"}
                bgColor={gridView ? "#fff" : "transparent"}
                transition="all 0.2s ease"
                transform={
                  gridView
                    ? ["scale(0.8)", "scale(1)"]
                    : ["scale(0.6)", "scale(0.8)"]
                }
                boxShadow={
                  gridView ? "0px 0px 1px 1px rgba(0,0,0,0.1)" : "none"
                }
                onClick={() => {
                  sethorizontalView(false);
                  setgridView(true);
                }}
                className="flexed"
              >
                <LayoutGrid />
              </Button>
              <Button
                height={["80%", "70%"]}
                width={["50%", "40%"]}
                p="2.5"
                minW={"unset"}
                bgColor={horizontalView ? "#fff" : "transparent"}
                transition="all 0.2s ease"
                transform={
                  horizontalView
                    ? ["scale(0.8)", "scale(1)"]
                    : ["scale(0.6)", "scale(0.8)"]
                }
                boxShadow={
                  horizontalView ? "0px 0px 1px 1px rgba(0,0,0,0.1)" : "none"
                }
                onClick={() => {
                  sethorizontalView(true);
                  setgridView(false);
                }}
              >
                <BetweenHorizonalEnd />
              </Button>
            </Box>
            <Button
              display={["flex"]}
              className="flexed"
              height={["100%", "80%"]}
              width={["20%", "7%"]}
              color={"#000"}
              border={"1px solid rgb(177, 176, 176)"}
              fontSize={["12px", "14px"]}
              onClick={() => {
                showFilter ? setshowfilter(false) : setshowfilter(true);
              }}
              _hover={{backgroundColor:"rgb(230,230,230)"}}
              transition={"background 0.5s ease-in-out"}
            >
              Filter{" "}
              <AlignCenter
                style={{ height: "60%", width: "60%" }}
                color="#000"
              />
            </Button>
          </Box>
          <Box
            height={["100%"]}
            width={["95%"]}
            overflowY={["scroll"]}
            overflowX={["scroll"]}
            scrollBehavior={"smooth"}
            display={gridView ? "grid" : "grid"}
            gridTemplateColumns={
              gridView
                ? ["repeat(2, 1fr)", "repeat(4, 1fr)"]
                : ["repeat(1, 1fr)", "repeat(3, 1fr)"]
            }
            gap={showFilter?[0,10]:[0,10]}
            padding={"20px 5px"}
            scrollbar={"hidden"}
          >
            {sortLoading ? (
              <div>loading</div>
            ) : tempProducts.length > 0 ? (
              tempProducts.map((data, index) => (
                <Box
                  hueRotate={"100%"}
                  // height={["100%"]}
                  width={["100%"]}
                  className="flexed"
                  key={index}
                  flex={"0 0 auto"} 
                >
                  <ProductCards
                    Product={data}
                    view={gridView}
                    addtocartHandler={AddToCartHandler}
                  
                  />
                </Box>
              ))
            ) : (
              <Box color={"#000"}>No Items found</Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
export default ProductPage;
