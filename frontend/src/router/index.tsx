import { createBrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import Login from "@/presentation/app/login/login";
import Register from "@/presentation/app/register/register";
import Menu from "@/presentation/app/menu/menu";
import ProtectedRoute from "@/presentation/components/ProtectedRoute";
import AppLayout from "@/presentation/layout/layout";
import InvoiceHistory from "@/presentation/app/invoice-history/invoiceHistory";
import InvoiceViewer from "@/presentation/app/invoice-viewer/invoiceViewer";
import AnalysisDetails from "@/presentation/app/analysis-details/analysisDetails";

const router = createBrowserRouter([
  {
    path: AppRoutes.ROOT,
    element: <Login />,
  },
  {
    path: AppRoutes.LOGIN,
    element: <Login />,
  },
  {
    path: AppRoutes.REGISTER,
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: AppRoutes.MENU,
        element: <Menu />,
      },
      {
        path: AppRoutes.INVOICE_VIEWER,
        element: <InvoiceViewer />,
      },
      {
        path: AppRoutes.HISTORY,
        element: <InvoiceHistory />,
      },
      {
        path: AppRoutes.ANALYSIS_DETAILS,
        element: <AnalysisDetails />,
      },
    ],
  },
]);

export { router };
