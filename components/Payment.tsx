import { View, Text, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import { useStripe } from "@stripe/stripe-react-native";
import { PaymentProps } from "@/types/type";
import { fetchAPI } from "@/lib/fetch";

const Payment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [success, setSuccess] = useState(false);

  const confirmHandler = async (paymentMethod, _, intentCreationCallback) => {
    try {
      const response = await fetchAPI("/api/stripe/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName || email.split("@")[0],
          email: email,
          amount: amount,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const { client_secret, error } = await response.json();

      if (client_secret) {
        intentCreationCallback({ clientSecret: client_secret });
      } else {
        intentCreationCallback({ error });
      }
    } catch (error) {
      console.error("Error in confirmHandler:", error);
      intentCreationCallback({ error });
    }
  };

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      intentConfiguration: {
        mode: {
          amount: 1099,
          currencyCode: "USD",
        },
        confirmHandler: confirmHandler,
      },
    });
    if (error) {
      Alert.alert("Error initializing payment sheet", error.message);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <CustomButton
      title="Confirm Ride"
      className="my-10"
      onPress={openPaymentSheet}
    />
  );
};

export default Payment;
