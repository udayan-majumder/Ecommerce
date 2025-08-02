"use client";

import { useAuth } from "../../../../../hooks/userAuth";
import { useRouter, usePathname, redirect, useParams } from "next/navigation";
import Products from "../../../../../store/Productstore";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Breadcrumb,
  Image,
  Link,
  Text,
  Button,
  Input,
  Spinner
} from "@chakra-ui/react";
import { NavbarComponent } from "@/components/Navbar/page";
import toast, { Toaster } from "react-hot-toast";
import { ProductCards } from "@/components/cards/page";
import { ChevronLeft, ChevronRight, Star, TicketX } from "lucide-react";

function ProductDetailsPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const param = useParams();
  const { ProductList } = Products();
  const queryproductid = param.productdetails;
  const [selectedProduct, setselectedProduct] = useState<object[]>([{}]);
  const [selectedImage, setselectedImage] = useState<string>("");
  const [similarProduct, setsimilarProduct] = useState<object[]>([]);
  const [review, setreview] = useState<string>("");
  const [reviewList, setreviewList] = useState<object[]>([]);
  const [pagereload, setreload] = useState<boolean>(false);
  const scrollRef = useRef(null);

  function SelectedProduct() {
    ProductList?.map((items: any) =>
      items?.id === Number(queryproductid)
        ? setselectedProduct(items)
        : console.log()
    );
  }

  async function AddToCartHandler(data: any) {
    const loader = toast.loading("adding", {
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
    toast.dismiss(loader);
    const finalres = await res.json();
    if (finalres.message === "already added to cart") {
      toast.error("already added to the cart", {
        position: "bottom-right",
        style: {
          backgroundColor: "red",
          color: "#fff",
          fontFamily: "poppins",
          letterSpacing: 0.5,
          fontSize: "14px",
          fontWeight: 500,
        },
      });
    } else {
      toast.success("Product successfully added to the cart", {
        position: "bottom-right",
        style: {
          fontFamily: "poppins",
          letterSpacing: 0.5,
          fontSize: "14px",
        },
      });
    }
  }

  function SortSimilarProducts() {
    const querycategory = selectedProduct?.category;
    const result = ProductList?.filter(
      (items: any) => items?.category === querycategory
    );
    setsimilarProduct(result);
  }

  async function addrating(productid: number, userrating: number) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/addrating`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          productid: productid,
          userrating: userrating,
        }),
      }
    );

    const finalres = await res.json();
    console.log(finalres);
    if (finalres?.message === "Ratings Added Successfully") {
      toast.success("Ratings Added Successfully", {
        position: "bottom-right",
      });
    }
  }

  async function addReview() {
    if (review.length > 0) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/addproductreview`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            productid: selectedProduct?.id,
            userid: user?.userId,
            message: review,
          }),
        }
      );
      const finalRes = await res.json();
      if (finalRes?.message === "Review added succesfully") {
        toast.success("Review added succesfully", {
          position: "bottom-right",
        });
      }
    } else {
      toast.error("review not found");
    }
  }

  async function getReview() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/getproductreview`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          productid: queryproductid,
        }),
      }
    );
    const finalRes = await res.json();
    setreviewList(finalRes?.list);
  }

  useEffect(() => {
    SelectedProduct();
  }, []);

  useEffect(() => {
    SelectedProduct();
  }, [addrating]);

  useEffect(() => {
    if (pagereload) {
      getReview();
      setreload(false);
    }
  }, [pagereload]);

  useEffect(() => {
    if (selectedProduct) {
      setselectedImage(selectedProduct?.images?.image[0]);
      SortSimilarProducts();
      getReview();
    }
  }, [selectedProduct]);




useEffect(() => {
  const token = localStorage.getItem("token");
  const fullPath =
    typeof window !== "undefined" ? window.location.pathname : pathname;
  const path = localStorage.getItem("path") || fullPath;

  // Save path only if not authenticated
  if (!user || !token) {
      console.log("main page");
    router.push("/auth/login");
    return;
  }

  // Prevent redirect loops
  if (path.includes("/auth")) {
    router.push("/user/home");
    return;
  }

  // If it's admin path, verify role
  if (path.includes("/admin")) {
    if (user?.userType === "admin") {
      router.push(path);
    } else {
      router.push("/user/home");
    }
    return;
  }

 
  if(path.includes(`user/products/${queryproductid}`) && path === `user/products/${queryproductid}`){
     console.log("Redirecting to:", path);
    router.push(path);
  }
  else {
     console.log("Redirecting to:", path,"/",queryproductid) ;
    router.push(path + "/" + queryproductid);
  }
}, [user]);



  if (selectedImage !== "" && selectedProduct?.id) {
    return (
      <Box
        height={["100vh"]}
        width={["100%"]}
        bgColor={"#EDEDED"}
        className="flexed"
        fontFamily={"poppins"}
        color={"#000"}
        overflowY={["scroll"]}
        letterSpacing={0.5}
      >
        <Toaster />
        {/*Navbar */}
        <NavbarComponent />
        <Box
          height={["100%"]}
          width={["100%"]}
          className="flexed"
          flexDirection={["column"]}
          justifyContent={["flex-start"]}
        >
          {/*Breadcrumb*/}
          <Box
            height={["12%"]}
            width={["94%"]}
            className="flexed"
            justifyContent={["flex-end"]}
            alignItems={["flex-start"]}
            flexDirection={["column"]}
            flex={"0 0 auto"}
            padding={["10px 0px"]}
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
                    color={["#000"]}
                    _hover={{ color: "#323232" }}
                    fontFamily={["poppins"]}
                    letterSpacing={0.5}
                    fontSize={["10px", "14px"]}
                  >
                    Products
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Link
                    href={`/user/products/${selectedProduct?.id}`}
                    color={["brown"]}
                    _hover={{ color: "#323232" }}
                    fontFamily={["poppins"]}
                    letterSpacing={0.5}
                    fontSize={["10px", "14px"]}
                  >
                    Product details
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>
          </Box>
          {/*Product images and about*/}
          <Box
            height={["95%", "75%"]}
            width={["100%"]}
            flex={"0 0 auto"}
            className="flexed"
            flexDirection={["column", "row"]}
          >
            {/*Product images */}
            <Box
              width={["100%", "40%"]}
              height={["40%", "100%"]}
              className="flexed"
              flexDirection={["column", "row"]}
            >
              <Box
                width={["20%"]}
                height={["95%"]}
                className="flexed"
                justifyContent={["center", "flex-start"]}
                flexDirection={["row", "column"]}
                gap={[5]}
              >
                {selectedProduct?.images?.image.map((items: any) => (
                  <Image
                    src={items}
                    width={["60%", "80%"]}
                    borderRadius={[10]}
                    onClick={() => setselectedImage(items)}
                  />
                ))}
              </Box>
              <Box
                width={["80%"]}
                height={["100%"]}
                className="flexed"
                flexDirection={["column"]}
                justifyContent={["flex-start"]}
                padding={"10px 20px"}
              >
                <Image
                  src={selectedImage}
                  alt="loading"
                  borderRadius={10}
                  width={["90%", "100%"]}
                />
              </Box>
            </Box>
            {/*Product details*/}
            <Box
              height={["100%"]}
              width={["100%", "60%"]}
              className="flexed"
              flexDirection={["column"]}
              justifyContent={["flex-end"]}
            >
              <Box
                height={["95%"]}
                width={["80%"]}
                className="flexed"
                flexDirection={["column"]}
                justifyContent={"flex-start"}
                gap={[2, 4]}
              >
                <Text
                  width={["100%"]}
                  fontSize={["16px", "20px"]}
                  fontFamily={"rubik"}
                  color={"gray.400"}
                  //   fontStyle={"italic"}
                >
                  {selectedProduct?.category}
                </Text>
                <Text
                  width={["100%"]}
                  fontSize={["20px", "42px"]}
                  fontFamily={"rubik"}
                >
                  {selectedProduct?.name}
                </Text>
                <Text
                  width={["100%"]}
                  fontSize={["18px", "26px"]}
                  fontWeight={500}
                  fontFamily={"rubik"}
                >
                  Description
                </Text>
                <Text
                  width={["100%"]}
                  fontSize={["12px", "18px"]}
                  fontFamily={"poppins"}
                  color={"rgb(104, 104, 104)"}
                  fontStyle={"italic"}
                >
                  {selectedProduct?.description}
                </Text>
                <Text
                  width={["100%"]}
                  fontSize={["12px", "16px"]}
                  fontFamily={"poppins"}
                  color={"red"}
                  className="flexed"
                  justifyContent={["left"]}
                  gap={[2]}
                >
                  <Text
                    color={"#000"}
                    fontWeight={500}
                    fontSize={["16px", "20px"]}
                  >
                    Stock
                  </Text>{" "}
                  {selectedProduct?.qty} left only! hurry
                </Text>
                <Text
                  width={["100%"]}
                  fontSize={["30px"]}
                  fontWeight={500}
                  fontFamily={"rubik"}
                  color={"teal"}
                  className="flexed"
                  justifyContent={["left"]}
                >
                  {[...Array(selectedProduct?.rating)].map((_, i) => (
                    <Star />
                  ))}
                </Text>
                <Text
                  width={["100%"]}
                  fontSize={["24px", "42px"]}
                  fontWeight={500}
                  fontFamily={"rubik"}
                  color={"teal"}
                >
                  ${selectedProduct?.price}
                </Text>
                <Box
                  height={["15%"]}
                  flex={"0 0 auto"}
                  width={["100%"]}
                  className="flexed"
                  justifyContent={["space-between"]}
                  alignItems={["center", "flex-end"]}
                  gap={[5]}
                >
                  <Button
                    width={["50%"]}
                    height={["50%"]}
                    fontSize={["16px", "20px"]}
                    backgroundColor={"brown"}
                    color={"#fff"}
                    onClick={() => {
                      AddToCartHandler(selectedProduct);
                    }}
                  >
                    Add To Cart
                  </Button>
                  <Button
                    width={["50%"]}
                    height={["50%"]}
                    fontSize={["16px", "20px"]}
                    backgroundColor={"#fff"}
                    color={"brown"}
                    onClick={() => {
                      AddToCartHandler(selectedProduct);
                      router.push("/user/cart");
                    }}
                  >
                    Buy Now
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
          {/*similar Products */}
          <Box
            height={["40%", "50%"]}
            width={["100%"]}
            flex={"0 0 auto"}
            // bgColor={"red"}
            className="flexed"
            flexDirection={["column"]}
            position={"relative"}
          >
            <Text fontSize={["22px", "32px"]} width={["80%", "92%"]}>
              Browse Similar Products
            </Text>
            <Box
              height={["80%"]}
              width={["95%"]}
              className="flexed"
              overflowX={["scroll"]}
              justifyContent={["flex-start"]}
              scrollbar={"hidden"}
              ref={scrollRef}
            >
              <Button
                position={"absolute"}
                left={0}
                zIndex={10}
                onClick={() =>
                  scrollRef.current?.scrollBy({
                    left: -200,
                    behavior: "smooth",
                  })
                }
              >
                <ChevronLeft />
              </Button>
              {similarProduct?.map((items: any, index) => (
                <Box
                  hueRotate={"100%"}
                  //   height={["10%"]}
                  width={["80%", "40%"]}
                  className="flexed"
                  key={index}
                  flex={["0 0 60%", "0 0 15%"]}
                >
                  <ProductCards
                    Product={items}
                    addtocartHandler={AddToCartHandler}
                  />
                </Box>
              ))}
              <Button
                position={"absolute"}
                right={0}
                zIndex={10}
                onClick={() =>
                  scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" })
                }
              >
                <ChevronRight />
              </Button>
            </Box>
          </Box>
          {/*Rating Box*/}
          <Box
            height={["10%"]}
            width={["92%"]}
            className="flexed"
            flexDirection={["column"]}
            flex={"0 0 auto"}
            // bgColor={"yellow"}
            gap={[5]}
          >
            <Text width={["90%", "100%"]} fontSize={["16px", "24px"]}>
              Give Rating ({selectedProduct?.rating})
            </Text>
            <Box
              height={["70%"]}
              width={["95%", "100%"]}
              className="flexed"
              justifyContent={["left"]}
            >
              {[...Array(5)].map((_, i) => (
                <Button
                  backgroundColor={"#EDEDED"}
                  color={i < selectedProduct?.rating ? "teal" : "black"}
                  onClick={() => {
                    addrating(selectedProduct?.id, i + 1);
                  }}
                >
                  <Star />
                </Button>
              ))}
            </Box>
          </Box>
          {/*User Review Box*/}
          <Box
            height={["60%"]}
            width={["92%"]}
            className="flexed"
            flex={"0 0 auto"}
            flexDirection={["column"]}
          >
            <Text width={["90%", "100%"]} fontSize={["16px", "28px"]}>
              Reviews
            </Text>
            <Box
              height={["10%"]}
              width={["90%", "100%"]}
              className="flexed"
              justifyContent={["left"]}
              gap={[4]}
            >
              <Input
                placeholder="Write your review here"
                fontSize={["14px", "18px"]}
                onChange={(e) => setreview(e.target.value)}
              />
              <Button
                width={["20%", "10%"]}
                fontSize={["16px", "20px"]}
                backgroundColor={"brown"}
                color={"#fff"}
                onClick={() => {
                  addReview();
                  setreload(true);
                }}
              >
                Send
              </Button>
            </Box>
            <Box
              height={["70%"]}
              width={["90%", "100%"]}
              //   bgColor={"teal"}
              overflowY={"scroll"}
              className="flexed"
              flexDirection={["column"]}
              justifyContent={["flex-start"]}
              alignItems={["flex-start"]}
              gap={[4]}
            >
              {reviewList.length>0? reviewList?.map((items: any) => (
                <Box height={["15%"]} width={["auto"]} bgColor={"#fff"} className="flexed" justifyContent={["center"]} flexDirection={["column"]} alignItems={"flex-start"} padding={"10px 20px"} borderRadius={10}>
                  <Text fontSize={["12px","14px"]} color={"gray.400"}>User {items?.userid}</Text>
                  <Text fontSize={["14px","18px"]}>{items?.message}</Text>
                </Box>
              )):<Box height={["100%"]} width={["100%"]} className="flexed" color={"gray.400"} fontSize={["18px","22px"]}>No Reviews Yet!</Box>}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  } else {
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
        </Box>;
  }
}

export default ProductDetailsPage;
