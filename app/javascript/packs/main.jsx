// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
} from "@clerk/clerk-react";

const APIRequestButton = () => {
  const user = useUser();
  const [response, setResponse] = React.useState(null);

  const makeRequest = async () => {
    const jwt = await user.getToken("hasura");
    const response = await fetch(`/api/clerk_user?jwt=${jwt}`);
    if (response.status == 200) {
      const session = await response.json();
      setResponse(JSON.stringify(session));
    } else {
      setResponse(`Server failed with ${response.status}`);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={makeRequest}>Make request</button>
      {response && (
        <div style={{ width: 400, margin: "1rem auto" }}>
          Response: {response}
        </div>
      )}
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const frontendApi = document.head.querySelector("meta[name='CLERK_FRONTEND_API']")?.content
  if (!frontendApi) {
    return alert("CLERK_FRONTEND_API is missing")
  }
  ReactDOM.render(
    <ClerkProvider frontendApi={frontendApi}>
      <SignedIn>
        <APIRequestButton />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>,
    document.body.appendChild(document.createElement("div"))
  );
});
