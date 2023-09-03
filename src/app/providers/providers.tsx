"use client";
import React from "react";
import Provider from "./ApolloProvider";

type ProviderType = {
  children: React.ReactNode;
};

const Providers = ({ children }: ProviderType) => {
  return (
    <Provider>
      {children}
    </Provider>
  );
};

export default Providers;
