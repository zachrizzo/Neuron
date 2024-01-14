import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserSubscriptionStatus,
  selectUser,
  setUserHearts,
  setSubscriptionPackages,
  selectSubscriptionPackages,
} from "../redux/slices/userSlice";
import { updateUser } from "../firebase/users/user";
import { auth } from "../firebase/firebase";
import { createProduct } from "../firebase/packages/packages";

// Use your RevenueCat API keys
const APIKeys = {
  apple: "appl_iyBkEdAoPsGeprcTBTbEaZCqAIZ",
  google: "",
};

const RevenueCatContext = createContext(null);

// Export context for easy usage
export const useRevenueCat = () => {
  return useContext(RevenueCatContext);
};

// Provide RevenueCat functions to our app
export const RevenueCatProvider = ({ children }) => {
  // const [user, setUser] = useState({ cookies: 0, items: [], pro: false });
  const [packages, setPackages] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const subscriptionStatus = user.subscriptionStatus;
  const hearts = user.hearts;
  const cortexxCoins = user.cortexxCoins;
  const subscriptionPackages = useSelector(selectSubscriptionPackages);

  useEffect(() => {
    const init = async () => {
      // if (Platform.OS === 'android') {
      //   await Purchases.configure({ apiKey: APIKeys.google });
      // } else {
      await Purchases.configure({ apiKey: APIKeys.apple });

      setIsReady(true);

      // Use more logging during debug if want!
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);

      // Listen for customer updates
      Purchases.addCustomerInfoUpdateListener(async (info) => {
        updateCustomerInformation(info);
        console.log("info", info);
      });

      // Load all offerings and the user object with entitlements
      await loadOfferings();
    };
    init();
  }, []);

  // Load all offerings a user can (currently) purchase
  const loadOfferings = async () => {
    const offerings = await Purchases.getOfferings();
    if (offerings.current) {
      dispatch(
        setSubscriptionPackages(offerings.current.availablePackages || [])
      );

      // createProduct(offerings.current.availablePackages);

      console.log("offer", offerings.current.availablePackages);
    }
  };

  // Update user state based on previous purchases
  const updateCustomerInformation = async (customerInfo) => {
    if (customerInfo?.entitlements.active["Standard Tier"] !== undefined) {
      dispatch(
        setUserSubscriptionStatus({
          subscriptionStatus:
            customerInfo?.entitlements.active["Standard Tier"],
        })
      );
      updateUser(auth.currentUser.email, {
        subscriptionStatus: customerInfo?.entitlements.active["Standard Tier"],
      });
    }

    if (customerInfo?.entitlements.active["Gold Tier"] === undefined) {
      dispatch(
        setUserSubscriptionStatus({
          subscriptionStatus: customerInfo?.entitlements.active["Gold Tier"],
        })
      );
      updateUser(auth.currentUser.email, {
        subscriptionStatus: customerInfo?.entitlements.active["Gold Tier"],
      });
    }
  };

  // Purchase a package
  const purchasePackage = async (pack) => {
    try {
      await Purchases.purchasePackage(pack);

      // Directly add our consumable product
      if (pack.product.identifier === "hearts_c_0") {
        dispatch(setUserHearts({ hearts: hearts + 5 }));
        updateUser(auth.currentUser.email, { hearts: hearts + 5 });
      }
    } catch (e) {
      if (!e.userCancelled) {
        alert(e);
      }
    }
  };

  // // Restore previous purchases
  const restorePermissions = async () => {
    const customer = await Purchases.restorePurchases();
    return customer;
  };

  const value = {
    restorePermissions,
    user,
    subscriptionPackages,
    purchasePackage,
  };

  // Return empty fragment if provider is not ready (Purchase not yet initialised)
  if (!isReady) return <></>;

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};
