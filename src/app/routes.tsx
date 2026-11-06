import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, lazy: async () => ({ Component: (await import("@/pages/Home")).Home }) },
      { path: "shop", lazy: async () => ({ Component: (await import("@/pages/Shop")).Shop }) },
      {
        path: "product/:slug",
        lazy: async () => ({ Component: (await import("@/pages/ProductDetail")).ProductDetail }),
      },
      { path: "cart", lazy: async () => ({ Component: (await import("@/pages/Commerce")).Cart }) },
      {
        path: "checkout",
        lazy: async () => ({ Component: (await import("@/pages/Commerce")).Checkout }),
      },
      {
        path: "order/:id",
        lazy: async () => ({ Component: (await import("@/pages/Commerce")).Confirmation }),
      },
      { path: "track", lazy: async () => ({ Component: (await import("@/pages/Info")).Track }) },
      {
        path: "gold-trading",
        lazy: async () => ({ Component: (await import("@/pages/Info")).GoldTrading }),
      },
      { path: "about", lazy: async () => ({ Component: (await import("@/pages/Info")).About }) },
      {
        path: "locations",
        lazy: async () => ({ Component: (await import("@/pages/Info")).Locations }),
      },
      {
        path: "contact",
        lazy: async () => ({ Component: (await import("@/pages/Info")).Contact }),
      },
      { path: "faq", lazy: async () => ({ Component: (await import("@/pages/Info")).FAQ }) },
      {
        path: "shipping-returns",
        lazy: async () => {
          const { Policy } = await import("@/pages/Info");
          return { Component: () => <Policy type="shipping" /> };
        },
      },
      {
        path: "privacy",
        lazy: async () => {
          const { Policy } = await import("@/pages/Info");
          return { Component: () => <Policy type="privacy" /> };
        },
      },
      {
        path: "terms",
        lazy: async () => {
          const { Policy } = await import("@/pages/Info");
          return { Component: () => <Policy type="terms" /> };
        },
      },
      {
        path: "account",
        lazy: async () => ({ Component: (await import("@/pages/AccountAdmin")).Account }),
      },
      {
        path: "admin",
        lazy: async () => ({ Component: (await import("@/pages/AccountAdmin")).Admin }),
      },
      { path: "*", lazy: async () => ({ Component: (await import("@/pages/NotFound")).NotFound }) },
    ],
  },
]);
