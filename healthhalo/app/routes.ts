import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
  route("profile_details","routes/profilePage.tsx"),
  route("dashboard","routes/dashboardHomePage.tsx"),
  route("chatbot","routes/chatbotPage.tsx"),
  route("wallet","routes/walletPage.tsx"),
  route("payment/success","routes/success.tsx"),
  route("circles","routes/circlePage.tsx"),
  route("/circles/:circleId","routes/circleDetailPage.tsx"),
] satisfies RouteConfig;
