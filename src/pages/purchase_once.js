import React, { useEffect, useState } from "react";
import Meta from "./../components/Meta";
import PageLoader from "./../components/PageLoader";
import FormAlert from "./../components/FormAlert";
import { useAuth, requireAuth } from "./../util/auth";
import { useRouter } from "./../util/router";
import { redirectToCheckout } from "./../util/stripe_once";
import { useGetPrice } from "../util/db";

function PurchaseOncePage(props) {
  const router = useRouter();
  // const auth = useAuth();
  const [formAlert, setFormAlert] = useState();
  
  const price = useGetPrice(router.query.plan)
  
  useEffect(() => {
    // if (auth.user.planIsActive) {
      // If user already has an active plan
      // then take them to Stripe billing
    //   router.push("/settings/billing");
    // } else {
      // Otherwise go to checkout
      // redirectToCheckout(router.query.plan).catch((error) => {
        redirectToCheckout(price).catch((error) => {
        setFormAlert({
          type: "error",
          message: error.message,
        });
      });
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Meta title="Purchase" />
      <PageLoader>
        {formAlert && (
          <FormAlert
            type={formAlert.type}
            message={formAlert.message}
            style={{ maxWidth: "500px" }}
          />
        )}
      </PageLoader>
    </>
  );
}

export default requireAuth(PurchaseOncePage);
