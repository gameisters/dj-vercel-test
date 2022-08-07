import React from "react";
import Meta from "./../components/Meta";
import SignupSection from "../components/SignupSection";

function SignupPage(props) {
  return (
    <>
      <Meta title="Signup" />
      <SignupSection
        bg="white"
        textColor="dark"
        size="md"
        bgImage=""
        bgImageOpacity={1}
        title="Signup"
        subtitle="Choose your division."
      />
    </>
  );
}

export default SignupPage;
