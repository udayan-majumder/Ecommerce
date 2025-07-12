"use client";

import { useAuth } from "../../../../hooks/userAuth";
import { redirect } from "next/navigation";
import { NavbarComponent } from "@/components/Navbar/page";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Products from "../../../../store/Productstore";
import { Box, Image, Text, Link, Button } from "@chakra-ui/react";
import { motion, useInView ,AnimatePresence} from "framer-motion";
import { ShoppingCart,Heart,CircleChevronRight} from "lucide-react";


function Homepage() {
  const { user, setUser } = useAuth();
  const pathname = usePathname();
  const {
    addtoCart,
    UserCartList,
    ProductCategory,
    ProductList,
    TopSellingList,
    setTopSellingList,
  } = Products();
  const [currentCategory, setcurrentCatgory] = useState<string>("Furniture");
  const  [categoryDetails,setcategoryDetails] = useState<Array<string>>([])
  const  [isMobile,setisMobile] = useState<boolean>(false)
  const imagediv = useRef(null);
  const imagedivContent = useRef(null); //for the first page main layout
  const imagedivContent2 = useRef(null); //for 2nd page 1st product div
  const imagedivContent3 = useRef(null); //for 2nd page 2nd product div
  const imagedivContent4 = useRef(null); //for 2nd page 3rd product div
  const imagedivContent5 = useRef(null); //for 2nd page 4th product div
  const imagedivContent6 = useRef(null); //for 2nd page 5th product div
  const secondOverflowContainer = useRef(null);
  const inView1 = useInView(imagediv, { amount: 0.2, once: false });
  const inView2 = useInView(secondOverflowContainer, {
    amount: 0.6,
    once: false,
  });
  const inView5 = useInView(imagedivContent, { amount: 0.8, once: false }); //for the first page main layout
  const inView6 = useInView(imagedivContent2, { amount: 0.2, once: false });

  if (!user) {
    localStorage.setItem("path", pathname);
    return redirect("/");
  }

  

  async function TopSelling() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/topselling`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    const finalRes = await res.json();
    setTopSellingList(finalRes?.list);
  }

  // function AboutCategory(){
  // const filterItem = ProductCategory?.map((items:any,index:any)=>{
  //   return [{"category":items?.category,description:}]
  // })
  // }

  // useEffect(() => {
  //   CatgoryWiseProduct();
  // }, [currentCategory]);

  // useEffect(() => {
  //  SortTopSelling()
  // }, [TopSellingList]);

  useEffect(() => {
    // CatgoryWiseProduct();
    TopSelling();
    window.innerWidth <= 768 ? setisMobile(true) : setisMobile(false)
  }, []);

  useEffect(() => {
    window.innerWidth <= 768 ? setisMobile(true) : setisMobile(false);
  }, [window.innerWidth]);

  return (
    <Box
      style={{
        height: "100vh",
        width: "100%",
        // backgroundColor: "rgba(0, 0, 0, 0.16)",
      }}
      className="flexed"
      flexDirection={["column"]}
      justifyContent={["flex-end"]}
    >
      <NavbarComponent />
      <Box
        height={["94%"]}
        width={["100%"]}
        className="flexed"
        flexDirection={["column"]}
        justifyContent={["flex-start"]}
        overflowY={"scroll"}
        overflowX={"hidden"}
        scrollbar={"hidden"}
        position={"relative"}
      >
        <Box
          height={["100%"]}
          width={["100%"]}
          className="flexed"
          flex={"0 0 auto"}
        >
          <motion.div
            ref={imagediv}
            style={{
              height: "100%",
              width: "100%",
              position: "relative",
              zIndex: 0,
            }}
            initial={{ opacity: 0, x: 200 }}
            animate={inView1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -300 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Box
              height={["100%"]}
              width={["100%"]}
              position={["absolute"]}
              top={0}
              left={0}
              zIndex={10}
              className="flexed"
              justifyContent={["flex-end"]}
              flexDirection={["column"]}
              // bgColor={"	#7C5844"}
              bg={
                "linear-gradient(135deg,#3D2B1F 0%,#5A3B2B 5%,#CBBBA0 90%,#E6DCD1 100%)"
              }
            >
              <motion.div
                ref={imagedivContent}
                initial={{ opacity: 0, y: -100 }}
                animate={
                  inView5 ? { opacity: 1, y: 0 } : { opacity: 0, y: -100 }
                }
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="flexed"
                style={{
                  height: "50%",
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: 2,
                }}
              >
                <Text
                  fontSize={["60px", "230px"]}
                  fontFamily={"syncopate"}
                  letterSpacing={0.5}
                  filter={"blur(0.4px)"}
                  fontWeight={700}
                >
                  Shoppy
                </Text>
              </motion.div>
              <motion.div
                ref={imagedivContent}
                initial={{ opacity: 0, y: -100 }}
                animate={
                  inView5 ? { opacity: 1, y: 0 } : { opacity: 0, y: -100 }
                }
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="flexed"
                style={{
                  height: "50%",
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Box
                  height={["60%"]}
                  width={["95%"]}
                  // bgColor={"teal"}
                  className="flexed"
                  display={["none", "flex"]}
                  justifyContent={["space-between"]}
                >
                  <Box
                    width={["30%", "15%"]}
                    padding={["10px 10px"]}
                    className="flexed"
                    flexDirection={["column"]}
                    alignItems={["flex-start"]}
                    gap={[6]}
                  >
                    <Text
                      width={["100%"]}
                      fontFamily={"poppins"}
                      fontSize={["8px", "14px"]}
                    >
                      Shoppy is a modern e-commerce platform that makes online
                      shopping seamless, stylish, and user-friendly.
                    </Text>
                    <Link
                      fontFamily={"monospace"}
                      bgColor={"#fff"}
                      padding={"10px 25px"}
                      color={"#000"}
                      borderRadius={30}
                      href={"/user/products"}
                      transition={"all 1s ease-in-out"}
                      _hover={{
                        transition: "all 1s ease-in-out",
                        backgroundColor: "rgb(199, 199, 199)",
                      }}
                      textDecoration={"none"}
                    >
                      Products
                    </Link>
                  </Box>
                  <Box
                    className="flexed"
                    height={["60%"]}
                    width={["15%"]}
                    alignItems={["flex-end"]}
                    gap={[4]}
                  >
                    <Link
                      bgColor={"#fff"}
                      padding={"10px 20px"}
                      color={"#000"}
                      border={"1px solid #fff"}
                    >
                      <ShoppingCart fill="#fff" />
                    </Link>
                    <Link
                      bgColor={"transparent"}
                      padding={"10px 20px"}
                      color={"#fff"}
                      border={"1px solid #fff"}
                    >
                      <Heart fill="#fff" />
                    </Link>
                  </Box>
                </Box>
              </motion.div>
            </Box>
            <Box
              height={["100%"]}
              width={["100%"]}
              position={["absolute"]}
              top={0}
              left={0}
              zIndex={10}
              pointerEvents={"none"}
            >
              <motion.div
                ref={imagedivContent}
                initial={{ opacity: 0, y: 200 }}
                animate={
                  inView5 ? { opacity: 1, y: 40 } : { opacity: 1, y: 150 }
                }
                transition={{ duration: 1, ease: "easeInOut" }}
                className="flexed"
                style={{
                  height: "100%",
                  width: "100%",
                  flexDirection: "column",
                  gap: 2,
                  justifyContent: "flex-end",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={"/model_bg.png"}
                  height={["85%", "100%"]}
                  // width={["30%"]}
                  style={{
                    filter: "drop-shadow(4px 8px 40px rgba(0, 0, 0, 0.6))",
                  }}
                />
              </motion.div>
            </Box>
          </motion.div>
        </Box>
        <Box
          height={["100%"]}
          width={["100%"]}
          className="flexed"
          flex={"0 0 auto"}
          position={"relative"}
          color={"#000"}
          fontSize={["100px"]}
          overflow={"visible"}
        >
          <motion.div
            ref={secondOverflowContainer}
            style={{
              height: "100%",
              width: "100%",
              position: "relative",
              overflowY: "scroll",
              display: "flex",
              flex: "0 0 auto",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              scrollbarWidth: "none",
            }}
            initial={{ opacity: 0, y: 150 }}
            animate={inView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 350 }}
            // exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <Box
              height={["100%"]}
              width={["100%"]}
              position={["absolute"]}
              top={0}
              left={0}
              zIndex={10}
              overflow={"visible"}
              pointerEvents={"none"}
              className="flexed"
              flexDirection={["column", "row"]}
              bg={
                "linear-gradient(220deg,#3D2B1F 0%,#5A3B2B 5%,#CBBBA0 90%,#E6DCD1 100%)"
              }
            >
              <Box
                width={["100%", "70%"]}
                height={["50%", "100%"]}
                bgColor={"#121212"}
                className="flexed"
                flexDirection={"column"}
                alignItems={["flex-start"]}
                padding={["0px 20px"]}
                color={"#fff"}
                letterSpacing={1}
                gap={[5]}
              >
                <Text fontSize={["30px", "100px"]} fontFamily={"syncopate"}>
                  {currentCategory}
                </Text>
                <Box>
                  {ProductCategory.map((items: any) =>
                    items?.category === currentCategory ? (
                      <Text
                        fontSize={["10px", "15px"]}
                        fontFamily={"poppins"}
                        fontWeight={400}
                        width={["100%", "90%"]}
                        className="flexed"
                        padding={["0px 5px", "0px 30px"]}
                        color={"rgba(255, 255, 255, 0.84)"}
                      >
                        {items?.description}
                      </Text>
                    ) : (
                      <Box></Box>
                    )
                  )}
                </Box>
              </Box>
              <AnimatePresence mode="wait">
                {currentCategory === "Furniture" && (
                  <motion.div
                    key="slideFurniture"
                    ref={imagedivContent2}
                    initial={{ opacity: 0, x: 500 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flexed"
                    style={{
                      height: "90%",
                      width: isMobile ? "90%" : "40%",
                      // flexDirection: "column",
                      gap: 8,
                      position: "relative",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Image
                      src={"/furniture.png"}
                      height={["70%", "90%"]}
                      position={"absolute"}
                      left={[0, -100]}
                      minWidth={["100%", "120%"]}
                      style={{
                        filter: "drop-shadow(4px 8px 40px rgba(0, 0, 0, 0.6))",
                      }}
                    />
                    <Button
                      onClick={() => setcurrentCatgory("Electronics")}
                      pointerEvents={"auto"}
                      bg={"none"}
                      color={"#fff"}
                    >
                      <CircleChevronRight />
                    </Button>
                  </motion.div>
                )}

                {currentCategory === "Electronics" && (
                  <motion.div
                    key="slideElectronics"
                    ref={imagedivContent3}
                    initial={{ opacity: 0, x: 500 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flexed"
                    style={{
                      height: "90%",
                      width: isMobile ? "90%" : "40%",
                      gap: 8,
                      position: "relative",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Image
                      src={"/headphone.png"}
                      height={["70%", "100%"]}
                      position={"absolute"}
                      left={[0, -100]}
                      minWidth={["100%"]}
                      style={{
                        filter: "drop-shadow(4px 8px 40px rgba(0, 0, 0, 0.6))",
                      }}
                    />
                    <Button
                      onClick={() => setcurrentCatgory("Miscellaneous")}
                      pointerEvents={"auto"}
                      bg={"none"}
                      color={"#fff"}
                    >
                      <CircleChevronRight />
                    </Button>
                  </motion.div>
                )}

                {currentCategory === "Miscellaneous" && (
                  <motion.div
                    key="slideMiscellaneous"
                    ref={imagedivContent4}
                    initial={{ opacity: 0, x: 500 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flexed"
                    style={{
                      height: "90%",
                      width: isMobile ? "90%" : "40%",
                      gap: 2,
                      position: "relative",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Image
                      src={"/miscellaneous.png"}
                      height={["70%", "90%"]}
                      position={"absolute"}
                      left={[-10, -100]}
                      minWidth={["120%"]}
                      style={{
                        filter: "drop-shadow(4px 8px 40px rgba(0, 0, 0, 0.6))",
                      }}
                    />
                    <Button
                      onClick={() => setcurrentCatgory("Shoes")}
                      pointerEvents={"auto"}
                      bg={"none"}
                      color={"#fff"}
                    >
                      <CircleChevronRight />
                    </Button>
                  </motion.div>
                )}

                {currentCategory === "Shoes" && (
                  <motion.div
                    key="slideShoes"
                    ref={imagedivContent5}
                    initial={{ opacity: 0, x: 500 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flexed"
                    style={{
                      height: "90%",
                      width: isMobile ? "90%" : "40%",
                      gap: 2,
                      position: "relative",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Image
                      src={"/nike.png"}
                      height={["50%", "80%"]}
                      position={"absolute"}
                      left={[0, -100]}
                      minWidth={["100%", "120%"]}
                      style={{
                        filter: "drop-shadow(4px 8px 40px rgba(0, 0, 0, 0.6))",
                      }}
                    />
                    <Button
                      onClick={() => setcurrentCatgory("Clothes")}
                      pointerEvents={"auto"}
                      bg={"none"}
                      color={"#fff"}
                    >
                      <CircleChevronRight />
                    </Button>
                  </motion.div>
                )}

                {currentCategory === "Clothes" && (
                  <motion.div
                    key="slideClothes"
                    ref={imagedivContent6}
                    initial={{ opacity: 0, x: 500 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flexed"
                    style={{
                      height: "100%",
                      width: isMobile ? "90%" : "40%",
                      gap: 2,
                      position: "relative",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Image
                      src={"/model_bg.png"}
                      height={["90%", "100%"]}
                      position={"absolute"}
                      left={[0, -100]}
                      minWidth={["100%"]}
                      style={{
                        filter: "drop-shadow(4px 8px 40px rgba(0, 0, 0, 0.6))",
                      }}
                    />
                    <Button
                      onClick={() => setcurrentCatgory("Furniture")}
                      pointerEvents={"auto"}
                      bg={"none"}
                      color={"#fff"}
                    >
                      <CircleChevronRight />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}

export default Homepage;
