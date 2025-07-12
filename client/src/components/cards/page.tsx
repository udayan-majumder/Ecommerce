


import { Box, Image ,Text,Button, Link as ChakraLink} from "@chakra-ui/react"
import { ShoppingCart, Heart} from "lucide-react";
import NextLink from "next/link"

interface ProductCardProps {
  Product: object[]; // make it more specific if possible (e.g., ProductType)
  addtocartHandler?: (product: any) => void;
}

export const ProductCards = ({Product,addtocartHandler}:ProductCardProps)=>{


return (
  <Box
    maxHeight={["80%"]}
    width={["80%"]}
    flex={"0 0 auto"}
    className="flexed product-cards"
    flexDirection={["column"]}
    color={"#000"}
    textDecoration={"none"}
    _hover={{
      transform: "scale(1.05)",
      transition: "transform 0.4s ease-in-out",
    }}
    transition="transform 0.4s ease-in-out"
    position={"relative"}
   
  >
    {Product?.qty < 1 ? (
      <Text
        height={"40%"}
        width={"40%"}
        zIndex={10}
        position={"absolute"}
        color={"#000"}
        fontSize={["8px", "14px"]}
      >
        Item out of stock
      </Text>
    ) : (
      <div></div>
    )}
    <ChakraLink as={NextLink} href={`/user/products/${Product?.id}`}>
      <Image
        src={Product?.images?.image[0]}
        borderRadius={"10px"}
        opacity={Product?.qty > 0 ? 1 : 0.4}
        height={"100%"}
      />
    </ChakraLink>

    {/*product details */}
    <Box
      width={"95%"}
      height={["60%", "40%"]}
      className="flexed"
      flexDirection={["column"]}
      justifyContent={"space-evenly"}
    >
      <Box
        width="100%"
        height="100%"
        className="flexed"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={["row"]}
      >
        <Text
          flex={1}
          letterSpacing={0.5}
          color="gray.500"
          fontSize={["10px", "12px"]}
          textAlign={["left"]}
          className={
            Product?.category?.length > 7 ? "multiline-ellipsis" : "none"
          }
        >
          {Product?.category}
        </Text>

        <Box
          display="flex"
          gap={[0, 2]}
          height="auto"
          justifyContent={["center"]}
        >
          <Button
            height={["20px", "30px"]}
            width={["20px", "30px"]}
            bgColor={"rgba(0, 0, 0, 0)"}
            _hover={{ bgColor: "rgb(230,230,230)" }}
            onClick={() => addtocartHandler(Product)}
            p="0"
            minW={"unset"}
          >
            <ShoppingCart style={{ height: "14px", width: "14px" }} />
          </Button>
          <Button
            p="0"
            minW={"unset"}
            height={["20px", "30px"]}
            width={["20px", "30px"]}
            bgColor={"rgba(0, 0, 0, 0)"}
            _hover={{ bgColor: "rgb(230,230,230)" }}
          >
            <Heart style={{ height: "14px", width: "14px" }} />
          </Button>
        </Box>
      </Box>
      {/* Product Name Section */}
      <Box width="100%" py={1}>
        <Text
          fontSize={["12px", "15px"]}
          fontWeight={500}
          width="100%"
          textAlign={["left"]}
          //   noOfLines={2}
          className="multiline-ellipsis"
        >
          {Product?.name}
        </Text>
      </Box>

      {/* Price and Quantity Section */}
      <Box
        width="100%"
        className="flexed"
        justifyContent="space-between"
        alignItems="center"
        py={1}
      >
        <Text fontSize={["12px", "16px"]} fontWeight={500} color="teal">
          ${Product?.price}
        </Text>
        <Text fontSize={["10px", "14px"]} color="red.400" fontWeight={400}>
          {Product?.qty} left!
        </Text>
      </Box>
    </Box>
  </Box>
);
}