"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/userAuth";
import Products from "../../../../store/Productstore";
import { redirect, usePathname } from "next/navigation";
import {
  Box,
  Text,
  Button,
  Image,
  Link,
  InputGroup,
  Input,
  RadioGroup,
} from "@chakra-ui/react";
import { NavbarComponent } from "@/components/Navbar/page";
import toast, { Toaster } from "react-hot-toast";
import Essential from "../../../../store/informationstore";
import Script from "next/script";
import Razorpay from "razorpay";
import {
  Trash2,
  Eraser,
  CirclePlus,
  CircleX,
  CircleCheck,
  PackageSearch,
  LogOut,
  CircleCheckBig,
} from "lucide-react";


function CartPage() {
  const { user } = useAuth();
  const {
    addtoCart,
    UserCartList,
    cartLoading,
    setcartLoading,
    TotalPrice,
    setTotalPrice,
  } = Products();
  const { PromocodesList, setPromocode, UserAddress, setAddress } = Essential();
  const path = usePathname();
  const [reload, setReload] = useState<boolean>(false);
  const [Shipping, setshipping] = useState<number>(5);
  const [CGST, setCGST] = useState<number>(2);
  const [SGST, setSGST] = useState<number>(2);
  const [platfromFee, setplatfromFee] = useState<number>(1);
  const [Discount, setDiscount] = useState<number>(0);
  const [appliedPromocode, setappliedPromocode] = useState<any>({
    code: "",
    valid: false,
  });
  const [takeInput, settakeInput] = useState<boolean>(false);
  const [tempAddress, settempAddress] = useState<string>("");
  const [currentAddress, setcurrentAddress] = useState<string>("");
  const date = new Date()

  useEffect(()=>{
   if (!user) {
    localStorage.setItem("path", path);
    return redirect("/");
  }
  },[])


  const SortCart = (data: object[]) => {
    let temp = 0 + Shipping + CGST + SGST + platfromFee;
    if (!(data.length > 0)) {
      return setTotalPrice(0);
    }
    if (appliedPromocode?.code?.length > 0) {
       for (let i = 0; i < PromocodesList.length; i++) {
         const items:any = PromocodesList[i];
         if (items?.name === appliedPromocode?.code) {
           temp = temp - items?.value;
           console.log(items?.value);
           setDiscount(items?.value);
           setappliedPromocode({
             code: items.name,
             valid: true,
           });
           break; 
         }
        setDiscount(0)
       }
      
    }
    data?.forEach((products: any) => {
      temp = temp + products?.productdetails?.price * products?.qty;
    });
    console.log(temp);
    setTotalPrice(temp);
  };

  const getUserCartDetails = async () => {
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
    console.log(finalRes?.list)
    addtoCart(finalRes?.list);
    SortCart(finalRes?.list);
    if (cartLoading) {
      setcartLoading(false);
    }
    if (reload) {
      setReload(false);
    }
  };

  const CartUpdate = async (data: any, updateType: boolean) => {
    if (updateType === true) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/addtocart`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.userId,
            productId: data?.productid,
            productDetails: data,
            qty: 1,
            addqty: true,
          }),
        }
      );
      setReload(true);
      const finalRes = await res.json();
    }
    if (updateType === false) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/addtocart`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.userId,
            productId: data?.productid,
            productDetails: data,
            qty: 1,
            removeqty: true,
          }),
        }
      );
      setReload(true);
      const finalRes = await res.json();
    }
  };

  const removeCartHandler = async (productId?: number) => {
    const loader = toast.loading("removing", {
      position: "bottom-right",
      style: {
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "poppins",
        letterSpacing: 0.5,
      },
    });
    if (productId) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/removeall`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.userId,
            productId: productId,
          }),
        }
      );
      const finalRes = await res.json();
  
      const getres = await fetch(
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
      const getfinalRes = await getres.json();
      console.log(getfinalRes?.list);
      addtoCart(getfinalRes?.list);
      toast.dismiss(loader);
      setReload(true);
      return toast.success("Item removed successfully", {
        position: "bottom-right",
      });
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/removeall`,
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
    toast.dismiss(loader);
    setReload(true);
    toast.success("All items removed successfully", {
      position: "bottom-right",
    });

    const getres = await fetch(
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
    const getfinalRes = await getres.json();
    console.log(getfinalRes?.list);
    addtoCart(getfinalRes?.list);
  };

  const addAddress = async () => {
    const loader = toast.loading("adding address", {
      position: "bottom-right",
      style: {
        backgroundColor: "#000",
        color: "#fff",
      },
    });
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/addaddress`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          Address: tempAddress,
        }),
      }
    );

    const finalRes = await res.json();
    toast.dismiss(loader);
    if (finalRes) {
      toast.success("Address added successfully", {
        position: "bottom-right",
      });
    }
    setReload(true);
  };

  const getAddress = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/getalladdress`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
        }),
      }
    );
    const finalRes = await res.json();
    console.log(finalRes);
    setAddress(finalRes.AddressList);
  };

  const getPromoCodesDetails = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/promocodes`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    const finalRes = await res.json();
    setPromocode(finalRes.promocodes);
  };

  const deleteAddress = async (addressId: number) => {
    const loader = toast.loading("deleting address", {
      position: "bottom-right",
      style: {
        backgroundColor: "#000",
        color: "#fff",
      },
    });
    console.log(addressId)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/deleteaddress`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          addressId: addressId,
        }),
      }
    );

    const finalRes = await res.json();
    toast.dismiss(loader);
    if (finalRes) {
      toast.success("Address deleted succesfully", {
        position: "bottom-right",
      });
    }
    setReload(true);
  };

  const CreateOrder = async () => {
    if(currentAddress){
    const adrs:any = UserAddress.filter((e:any)=>e.addressid === currentAddress)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/createorder`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          Amount: Math.round(TotalPrice * 100),
          Currency: "USD",
          UserId: user.userId,
          UsercartList: UserCartList,
          TotalPrice: TotalPrice,
          PaymentStatus: "Paid",
          Time: `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`,
          CurrentAddress: adrs[0]?.address,
          OrderStatus: "OrderPlaced",
        }),
      }
    );
     const order = await res.json();
     console.log(order);
     const options: any = {
       key: process.env.NEXT_PUBLIC_RAZORPAY_KEYID, // Replace with your Razorpay key_id
       amount: order?.createdOrder?.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
       currency: "USD",
       name: user?.userName,
       description: "Test Transaction",
       order_id: order?.createdOrder?.id, // This is the order_id created in the backend
       callback_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/user/verifypayment`
     };
  
     const rzp:any = new window.Razorpay(options);
     rzp.open();
    }else{
      toast.error("No address is selected",{
        position:"bottom-right"
      })
    }
    

   
  };

  useEffect(() => {
    getUserCartDetails();
    getPromoCodesDetails();
    getAddress();
  }, []);

  useEffect(() => {
    getUserCartDetails();
    getAddress();
  }, [reload]);

  if (cartLoading) {
    return <div>Laoding</div>;
  }
  if (!cartLoading) {
    return (
      <Box height={"100vh"} width={"100%"}>
        <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
        <NavbarComponent />
        <Toaster />
        <Box
          height={"100vh"}
          width={"100%"}
          className="flexed"
          flexDirection={["column"]}
          justifyContent={["start"]}
          color={"#000"}
          bgColor={"#F1F3F6"}
          fontFamily={"poppins"}
        >
          {/*TextBox */}
          <Box
            height={["10%", "15%"]}
            width={["85%", "90%"]}
            className="flexed"
            flexDirection={["column"]}
            justifyContent={"end"}
            letterSpacing={0.5}
            fontWeight={500}
            fontSize={["18px", "25px"]}
          >
            <Text width={["100%", "95%"]}>Checkout</Text>
          </Box>
          {/*Product Box */}
          <Box
            height={["85%"]}
            width={["95%"]}
            className="flexed"
            flexDirection={["column", "row"]}
            justifyContent={["flex-start", "center"]}
            overflowY={"scroll"}
            overflowX={"hidden"}
            scrollbar={"hidden"}
          >
            {/*Product info box */}
            <Box
              // bgColor={"teal"}
              width={["100%", "60%"]}
              height={["100%", "100%"]}
              flex={"0 0 auto"}
              className="flexed"
              flexDirection={["column"]}
            >
              <Box
                width={["100%", "95%"]}
                height={["60%", "35%"]}
                className="flexed"
                justifyContent={["space-around"]}
                flexDirection={["column", "row"]}
              >
                <Box
                  width={["90%", "45%"]}
                  height={["45%", "90%"]}
                  borderRadius={"10px"}
                  boxShadow={"0px 0px 2px 2px rgba(0,0,0,0.1)"}
                  className="flexed"
                  flexDirection={["column"]}
                  justifyContent={["start"]}
                  bgColor={"#fff"}
                  padding={"5px 5px"}
                >
                  <Box
                    height={["30%","20%"]}
                    width={["95%"]}
                    className="flexed"
                    justifyContent={["space-between"]}
                    borderBottom={"1px solid rgb(214, 213, 213)"}
                  >
                    <Text letterSpacing={0.5} fontWeight={500}>
                      Saved Address
                    </Text>
                    <Button
                      height={["80%"]}
                      width={["10%", "14%"]}
                      fontSize={["10px", "12px"]}
                      // bgColor={"brown"}
                      color={"brown"}
                      // _hover={{ bgColor: "#BA6263" }}
                      letterSpacing={0.5}
                      onClick={() =>
                        takeInput ? settakeInput(false) : settakeInput(true)
                      }
                    >
                      <CirclePlus />
                    </Button>
                  </Box>
                  <Box
                    height={["80%"]}
                    width={["100%"]}
                    className="flexed"
                    flexDirection={["column"]}
                    justifyContent={["start"]}
                    padding={"5px 0px"}
                    overflowY="scroll"
                    overflowX="hidden"
                  >
                    {takeInput ? (
                      <Box
                        height={["40%","30%"]}
                        width={["95%"]}
                        flex={"0 0 auto"}
                        padding={["5px 5px"]}
                        // bgColor={"teal"}
                        className="flexed"
                        gap={2}
                      >
                        <Input
                          placeholder="Enter your address"
                          height={"100%"}
                          onChange={(e) =>
                            settempAddress(
                              e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1)
                            )
                          }
                        />
                        <Button
                          border={"1px solid brown"}
                          color={"brown"}
                          height={"100%"}
                          onClick={() => {
                            settakeInput(false);
                          }}
                        >
                          <Trash2 />
                        </Button>
                        <Button
                          bgColor={"brown"}
                          color={"#fff"}
                          height={"100%"}
                          onClick={() => {
                            addAddress();
                            settakeInput(false);
                          }}
                        >
                          <CircleCheck />
                        </Button>
                      </Box>
                    ) : null}

                    <RadioGroup.Root
                      value={currentAddress}
                      onValueChange={(e: any) => {
                        setcurrentAddress(e.value);
                        console.log(e.value);
                      }}
                      height={["100%"]}
                      width={["100%"]}
                      padding={"10px 5px"}
                      flex={"0 0 auto"}
                      variant={"outline"}
                      colorPalette={"orange"}
                    >
                      {UserAddress.length > 0 ? (
                        UserAddress.map((data: any) => (
                          <Box
                            height={["40%","30%"]}
                            width={["100%"]}
                            flex={"0 0 auto"}
                            borderBottom={"1px solid rgb(210,210,210)"}
                            className="flexed"
                            justifyContent={["left"]}
                          >
                            <RadioGroup.Item
                              key={data.addressid}
                              value={data.addressid}
                              width={["100%"]}
                              className="multiline-ellipsis "
                              spaceX={3}
                            >
                              <RadioGroup.ItemHiddenInput />
                              <RadioGroup.ItemIndicator />
                              <RadioGroup.ItemText
                                letterSpacing={0.5}
                                fontWeight={400}
                              >
                                {data.address}
                              </RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <Button
                              // border={"1px solid red"}
                              color={["red"]}
                              width={["10%"]}
                              bgColor={"#fff"}
                              height={"80%"}
                              value={data.addressid}
                              onClick={(e: any) => {
                                deleteAddress(data?.addressid);
                              }}
                            >
                              <CircleX />
                            </Button>
                          </Box>
                        ))
                      ) : (
                        <Box
                          height={["100%"]}
                          width={["100%"]}
                          className="flexed"
                        >
                          No saved address
                        </Box>
                      )}
                    </RadioGroup.Root>
                  </Box>
                </Box>
                <Box
                  width={["90%", "45%"]}
                  height={["45%", "90%"]}
                  className="flexed"
                  flexDirection={["column"]}
                  justifyContent={["start"]}
                  borderRadius={"10px"}
                  boxShadow={"0px 0px 2px 2px rgba(0,0,0,0.1)"}
                  bgColor={"#fff"}
                >
                  <Box
                    height={["30%","20%"]}
                    width={["95%"]}
                    className="flexed"
                    justifyContent={["space-between"]}
                    borderBottom={"1px solid rgb(214, 213, 213)"}
                    // bgColor={"teal"}
                  >
                    <Text letterSpacing={0.5} fontWeight={500}>
                      Choose how to pay
                    </Text>
                  </Box>
                  <Box height={["80%"]} width={["90%"]} padding={"10px 0px"}>
                    <RadioGroup.Root
                      height={["40%","30%"]}
                      width={["100%"]}
                      className="flexed"
                      justifyContent={["left"]}
                      borderBottom={"1px solid rgb(192,192,192)"}
                      defaultValue={"Razorpay"}
                      variant={"outline"}
                      colorPalette={"orange"}
                    >
                      <RadioGroup.Item key={"Razorpay"} value={"Razorpay"}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>
                          <Image
                            src={"/razorpay.svg"}
                            height={["90%"]}
                            width={["30%"]}
                          />
                        </RadioGroup.ItemText>
                      </RadioGroup.Item>
                    </RadioGroup.Root>
                  </Box>
                </Box>
              </Box>
              <Box width={["100%"]} height={["40%", "65%"]} className="flexed">
                <Box
                  width={["90%"]}
                  height={["90%"]}
                  borderRadius={"10px"}
                  boxShadow={"0px 0px 2px 2px rgba(0,0,0,0.1)"}
                  className="flexed"
                  flexDirection={["column"]}
                  justifyContent={["start"]}
                  bgColor={"#fff"}
                >
                  {/*Heading carList */}
                  <Box
                    height={["20%","15%"]}
                    width={["95%"]}
                    className="flexed"
                    justifyContent={["space-between"]}
                    borderBottom={"1px solid rgb(220,220,220)"}
                  >
                    <Text
                      letterSpacing={0.5}
                      fontSize={["14px", "18px"]}
                      className="flexed"
                      gap={4}
                    >
                      Cart{" "}
                      <Text
                        fontSize={["12px", "14px"]}
                        color={"rgb(131, 131, 131)"}
                      >
                        {UserCartList.length} items
                      </Text>
                    </Text>
                    <Button
                      height={["70%", "60%"]}
                      color={"#fff"}
                      bgColor={"brown"}
                      _hover={{ bgColor: "#BA6263" }}
                      onClick={() => {
                        console.log(UserCartList);
                        removeCartHandler();
                      }}
                    >
                      <Eraser />
                    </Button>
                  </Box>
                  {/*Carlist Items mapping */}
                  <Box
                    height={["80%"]}
                    width={["100%"]}
                    overflowY={["scroll"]}
                    overflowX={["hidden"]}
                    className="flexed"
                    justifyContent={["flex-start"]}
                    flexDirection={["column"]}
                  >
                    {UserCartList.length > 0 ? (
                      UserCartList?.map((data: any) => (
                        <Box
                          key={data?.productid}
                          height={["45%","35%"]}
                          width={["95%"]}
                          borderBottom={"1px solid rgb(220,220,220)"}
                          flex={"0 0 auto"}
                          className="flexed"
                          justifyContent={["start"]}
                          gap={4}
                        >
                          <Image
                            src={data?.productdetails?.images?.image[0]}
                            height={["80%"]}
                            width={["20%", "15%"]}
                            borderRadius={"10px"}
                          />
                          <Box
                            height={["80%"]}
                            width={["20%", "40%"]}
                            className="flexed"
                            flexDirection={["column"]}
                            gap={[1, 3]}
                            justifyContent={["left"]}
                          >
                            <Text
                              width={["90%"]}
                              fontSize={["10px", "12px"]}
                              color={"gray.400"}
                              letterSpacing={0.5}
                              className="multiline-ellipsis"
                            >
                              {data?.productdetails?.category}
                            </Text>
                            <Text
                              width={["90%"]}
                              fontSize={["12px", "18px"]}
                              letterSpacing={0.5}
                              fontWeight={500}
                              className="multiline-ellipsis"
                            >
                              {data?.productdetails?.name}
                            </Text>
                            <Text
                              width={["90%"]}
                              fontSize={["12px", "16px"]}
                              letterSpacing={0.5}
                              fontWeight={400}
                              color={"teal"}
                              className="multiline-ellipsis"
                            >
                              {data?.productdetails?.price}$
                            </Text>
                          </Box>
                          <Box
                            height={["80%"]}
                            width={["25%","30%"]}
                            className="flexed"
                            flexDirection={["column"]}
                            justifyContent={["space-evenly"]}
                            // bgColor={"teal"}
                            gap={[3]}
                          >
                            <Box
                              width={["100%"]}
                              height={["20%"]}
                              className="flexed"
                              gap={4}
                              //  bgColor={"teal"}
                            >
                              <Button
                                color={"brown"}
                                boxShadow={"0px 0px 2px 2px rgba(0,0,0,0.1)"}
                                height={["100%"]}
                                width={["20%", "10%"]}
                                p="0"
                                minW={"unset"}
                                onClick={() => {
                                  CartUpdate(data, false);
                                  setReload(true);
                                }}
                              >
                                -
                              </Button>
                              {data?.qty}
                              <Button
                                color={"brown"}
                                boxShadow={"0px 0px 2px 2px rgba(0,0,0,0.1)"}
                                height={["100%"]}
                                width={["20%", "10%"]}
                                p="0"
                                minW={"unset"}
                                onClick={() => {
                                  CartUpdate(data, true);
                                  setReload(true);
                                }}
                              >
                                +
                              </Button>
                            </Box>
                          </Box>
                          <Text
                            height={["80%"]}
                            width={["8%"]}
                            className="flexed"
                            fontSize={["14px", "18px"]}
                            justifyContent={["left"]}
                          >
                            {data?.productdetails?.price * data?.qty}$
                          </Text>
                          <Button
                            border={"1px solid red"}
                            color={"red"}
                            p={0}
                            maxW={"unset"}
                            height={["50%","30%"]}
                            width={["8%", "5%"]}
                            fontSize={["12px", "14px"]}
                            _hover={{
                              bgColor: "red.500",
                              color: "#fff",
                              border: "none",
                            }}
                            letterSpacing={0.5}
                            onClick={() => {
                              removeCartHandler(data?.productid);
                            }}
                            className="flexed"
                          >
                            <Trash2 />
                          </Button>
                        </Box>
                      ))
                    ) : (
                      <Box
                        height={["100%"]}
                        width={["100%"]}
                        className="flexed"
                        flexDirection={["column"]}
                        gap={10}
                      >
                        <Text
                          fontSize={["18px", "28px"]}
                          color={"rgb(143, 143, 143)"}
                          fontStyle={"italic"}
                        >
                          No items in your cart!
                        </Text>
                        <Link
                          bgColor={"brown"}
                          color={"#fff"}
                          padding={"8px 15px"}
                          borderRadius={"6px"}
                          href="/user/products"
                          letterSpacing={1}
                        >
                          Browse Products <PackageSearch />
                        </Link>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
            {/*Checkout Box */}
            <Box
              width={["100%", "35%"]}
              height={["96%"]}
              flex={"0 0 auto"}
              // bgColor={"teal"}
              className="flexed"
              justifyContent={["center", "left"]}
              alignItems={["start"]}
              // flexDirection={["column"]}
              // bgColor={"teal"}
              letterSpacing={0.5}
            >
              <Box
                height={["85%","75%"]}
                width={["90%", "80%"]}
                borderRadius={"8px"}
                boxShadow={["0px 0px 2px 2px rgba(0,0,0,0.1)"]}
                bgColor={"#fff"}
                className="flexed"
                flexDirection={["column"]}
                justifyContent={"start"}
                padding={"10px 10px"}
              >
                <Box
                  height={["25%","30%"]}
                  width={["95%"]}
                  // bgColor={"teal"}
                  className="flexed"
                  flexDirection={["column"]}
                  justifyContent={["space-evenly"]}
                  borderBottom={"1px solid rgb(210,210,210)"}
                >
                  <Text width={["100%"]} fontSize={["16px","20px"]} fontWeight={500}>
                    Discount Code
                  </Text>
                  <Box
                    width={["100%"]}
                    className="flexed"
                    gap={4}
                    justifyContent={"right"}
                    position={"relative"}
                  >
                    <InputGroup>
                      <Input
                      // height={["100%"]}
                        placeholder="Enter your promocode"
                        onChange={(e) => {
                          setappliedPromocode({
                            code: e.target.value,
                            valid: false,
                          });
                        }}
                      />
                    </InputGroup>
                    <Button
                      bgColor={"brown"}
                      color={"#fff"}
                      _hover={{ bgColor: "#BA6263" }}
                      onClick={() => {
                        setReload(true);
                      }}
                      position={["absolute"]}
                      height={["32px"]}
                      width={["80px", "100px"]}
                      marginRight={1}
                      zIndex={2}
                      letterSpacing={0.5}
                      fontSize={["12px","14px"]}
                    >
                      Apply
                    </Button>
                  </Box>
                  <Text
                    width={["100%"]}
                    color={appliedPromocode?.valid ? "green" : "red"}
                    fontSize={["10px"]}
                  >
                    {appliedPromocode?.valid
                      ? "promocode is valid"
                      : "promocode is not valid"}
                  </Text>
                </Box>
                <Box
                  height={["50%"]}
                  width={["95%"]}
                  className="flexed"
                  flexDirection={["column"]}
                  justifyContent={["start"]}
                  gap={5}
                  padding={["10px 0px"]}
                  borderBottom={"1px solid rgb(210,210,210)"}

                  // bgColor={"teal"}
                >
                  <Text
                    width={["100%"]}
                    className="flexed"
                    justifyContent={["space-between"]}
                    color={"rgb(140,140,140)"}
                    letterSpacing={0.5}
                    fontSize={["14px", "16px"]}
                  >
                    SubTotal({UserCartList.length} Items)
                    <Text
                      color={"#000"}
                      fontSize={["16px", "18px"]}
                      fontWeight={500}
                    >
                      {TotalPrice > 0
                        ? (TotalPrice+Discount) - (Shipping + CGST + SGST + platfromFee)
                        : 0}{" "}
                      $
                    </Text>
                  </Text>
                  <Text
                    width={["100%"]}
                    className="flexed"
                    justifyContent={["space-between"]}
                    color={"rgb(140,140,140)"}
                    letterSpacing={0.5}
                    fontSize={["12px", "14px"]}
                  >
                    Shipping
                    <Text
                      color={"#000"}
                      fontSize={["14px", "16px"]}
                      fontWeight={500}
                    >
                      {Shipping} $
                    </Text>
                  </Text>
                  <Text
                    width={["100%"]}
                    className="flexed"
                    justifyContent={["space-between"]}
                    color={"rgb(140,140,140)"}
                    letterSpacing={0.5}
                    fontSize={["12px", "14px"]}
                  >
                    CGST
                    <Text
                      color={"#000"}
                      fontSize={["14px", "16px"]}
                      fontWeight={500}
                    >
                      {CGST} $
                    </Text>
                  </Text>
                  <Text
                    width={["100%"]}
                    className="flexed"
                    justifyContent={["space-between"]}
                    color={"rgb(140,140,140)"}
                    letterSpacing={0.5}
                    fontSize={["12px", "14px"]}
                  >
                    SGST
                    <Text
                      color={"#000"}
                      fontSize={["14px", "16px"]}
                      fontWeight={500}
                    >
                      {SGST} $
                    </Text>
                  </Text>
                  <Text
                    width={["100%"]}
                    className="flexed"
                    justifyContent={["space-between"]}
                    color={"rgb(140,140,140)"}
                    letterSpacing={0.5}
                    fontSize={["12px", "14px"]}
                  >
                    PlatfromFee
                    <Text
                      color={"#000"}
                      fontSize={["14px", "16px"]}
                      fontWeight={500}
                    >
                      {platfromFee} $
                    </Text>
                  </Text>
                  <Text
                    width={["100%"]}
                    className="flexed"
                    justifyContent={["space-between"]}
                    color={"rgb(140,140,140)"}
                    letterSpacing={0.5}
                    fontSize={["12px", "14px"]}
                  >
                    Discount
                    <Text
                      color={"#000"}
                      fontSize={["14px", "16px"]}
                      fontWeight={500}
                    >
                      -{Discount} $
                    </Text>
                  </Text>
                </Box>
                <Box
                  height={["20%"]}
                  width={["95%"]}
                  className="flexed"
                  flexDirection={["column"]}
                  justifyContent={["start"]}
                  padding={"10px 0px"}
                  gap={4}
                >
                  <Text
                    width={"100%"}
                    className="flexed"
                    justifyContent={["space-between"]}
                    fontSize={["18px", "22px"]}
                    fontWeight={500}
                  >
                    Total{" "}
                    <Text fontSize={["16px", "18px"]} fontWeight={400}>{TotalPrice} $</Text>
                  </Text>
                  <Button
                    bgColor={"brown"}
                    width={["100%"]}
                    color={"#fff"}
                    letterSpacing={0.5}
                    fontSize={["14px","16px"]}
                    onClick={() => {
                      if (UserCartList.length > 0) {
                        return CreateOrder();
                      }
                      toast.error("No items added in cart", {
                        position: "bottom-right",
                      });
                    }}
                  >
                    Place order <LogOut />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default CartPage;
