import React, { useState, useEffect } from "react";
import { Box, Text, Image, Button } from "@chakra-ui/react";
import { uploadProofOfPayment, completeOrder } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useUploadContext } from "../../context/UploadContext";
import { CheckIcon } from "@chakra-ui/icons";

const OrderCard = ({ order }) => {
  const { token } = useAuth();
  const { uploadSuccess, setSuccess, resetSuccess } = useUploadContext();

  const [proofOfPaymentFile, setProofOfPaymentFile] = useState(null);
  const [isProofUploaded, setIsProofUploaded] = useState(false);

  useEffect(() => {
    const proofUploaded = localStorage.getItem(
      `proofUploaded_${order.order_id}`
    );
    if (proofUploaded) {
      setIsProofUploaded(true);
    }

    resetSuccess();
  }, [order.order_id, resetSuccess]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProofOfPaymentFile(file);
    resetSuccess();
  };

  const handleUploadProofOfPayment = async () => {
    try {
      if (!proofOfPaymentFile) {
        console.error("Please select a proof of payment file.");
        return;
      }

      const response = await uploadProofOfPayment(
        order.order_id,
        proofOfPaymentFile,
        token
      );

      if (response.status >= 200 && response.status < 300) {
        setSuccess();
        localStorage.setItem(`proofUploaded_${order.order_id}`, "true");
        setIsProofUploaded(true);
      } else {
        console.error("Proof of payment upload failed.");
      }
    } catch (error) {
      console.error("Error uploading proof of payment:", error);
    }
  };

  const handleCompleteOrder = async () => {
    try {
      const response = await completeOrder(order.order_id, token);

      if (response && response.error) {
        console.error("Error completing order:", response.error);
      } else {
        alert("Order completed successfully!");

        window.location.reload();
      }
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  return (
    <Box border="1px solid #ccc" p="4" m="4 0">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="4"
      >
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            Order #{order.order_id}
          </Text>
          <Text>Delivery Time: {order.delivery_time}</Text>
          <Text>Order Status: {order.order_status}</Text>
        </Box>
        <Box>
          <Text>Total Price: Rp{order.total_price}</Text>
        </Box>
      </Box>

      <Box maxH="200px" overflowY="auto">
        {order.order_items.map((item) => (
          <Box
            key={item.order_item_id}
            display="flex"
            alignItems="center"
            mb="2"
          >
            <Image
              src={`http://localhost:3000/images/${item.product.image}`}
              // src={item.product.image}
              alt={item.product.name}
              boxSize="80px"
              objectFit="cover"
              mr="4"
            />
            <Box>
              <Text fontSize="md" fontWeight="bold">
                {item.product.name}
              </Text>
              <Text>Quantity: {item.quantity}</Text>
            </Box>
          </Box>
        ))}
      </Box>

      <Box mt="4">
        {order.order_status !== "Finished" &&
          order.order_status !== "Finish" && (
            <>
              <input type="file" onChange={handleFileChange} />

              <Button
                colorScheme="teal"
                variant="outline"
                size="sm"
                onClick={handleUploadProofOfPayment}
                disabled={isProofUploaded}
              >
                Upload Proof of Payment
              </Button>

              {isProofUploaded && (
                <Box color="green" mt="2" display="flex" alignItems="center">
                  <CheckIcon mr="2" /> Proof of payment uploaded successfully!
                </Box>
              )}

              {uploadSuccess && !isProofUploaded && (
                <Text color="green" mt="2">
                  Proof of payment uploaded successfully! ✅
                </Text>
              )}
            </>
          )}

        {order.order_status === "processing" && (
          <Button
            mt="2"
            colorScheme="teal"
            variant="outline"
            size="sm"
            onClick={handleCompleteOrder}
          >
            Complete Order
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default OrderCard;
