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
} from "@clerk/clerk-react";

const APIRequestButton = () => {
  const [error, setError] = React.useState(null);
  const [response, setResponse] = React.useState(null);
  const makeRequest = async () => {
    const response = await fetch("/api/clerk_session");
    if (response.status == 200) {
      const session = await response.json();
      setResponse(session);
    } else {
      setError(`Server failed with ${response.status}`);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={makeRequest}>Make request</button>
      {response && <div style={{ width: 400 }}>Response: {response}</div>}
      {error && <div style={{ width: 400 }}>Error: {error}</div>}
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <ClerkProvider frontendApi="clerk.7ica9.qk1o9.lcl.dev">
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
