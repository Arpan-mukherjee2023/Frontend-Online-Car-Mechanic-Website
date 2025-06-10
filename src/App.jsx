import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  matchPath,
} from "react-router-dom";
import Home from "./Components/Home Page/Home";
import Services from "./Components/Service Page/Services";
import BookAppointment from "./Components/Appointment Page/BookAppointment";
import About from "./Components/About";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import UserDashboard from "./Components/UserDashboard";
import UserProvider from "./Context/UserProvider.jsx";
import Layout from "./Components/Layout";
import ProfilePage from "./Components/Dashboard Sections/ProfilePage.jsx";
import GaragePage from "./Components/Dashboard Sections/GaragePage.jsx";
import AppointmentPage from "./Components/Dashboard Sections/AppointmentPage.jsx";
import ProductPage from "./Components/Dashboard Sections/ProductPage.jsx";
import SettingsPage from "./Components/Dashboard Sections/SettingsPage.jsx";
import GarageDetails from "./Components/Dashboard Sections/GarageDetails.jsx";
import GarageReviewForm from "./Components/Dashboard Sections/GarageReviewForm.jsx";
import AddVehicleForm from "./Components/User Settings Page/AddVehicleForm.jsx";
import EditVehicles from "./Components/User Settings Page/EditVehicles.jsx";
import FavouriteMechanicsTable from "./Components/User Settings Page/FavouriteMechanicsTable.jsx";
import FavouriteGaragesTable from "./Components/User Settings Page/FavouriteGaragesTable.jsx";
import ServiceHistoryTable from "./Components/User Settings Page/ServicehistoryTable.jsx";
import AppointmentFrom from "./Components/Dashboard Sections/AppointmentForm.jsx";
import GarageDashboard from "./Components/GarageDashboard.jsx";
import GarageAppointment from "./Components/Garage Section/GarageAppointment.jsx";
import GarageProduct from "./Components/Garage Section/GarageProduct.jsx";
import GarageSettings from "./Components/Garage Section/GarageSettings.jsx";
import GarageOrder from "./Components/Garage Section/GarageOrder.jsx";
import ChatBotModal from "./Components/ChatbotModal.jsx";

function AppWrapper() {
  const location = useLocation();

  const noLayoutRoutes = [
    "/user/dashboard",
    "/user/myProfile",
    "/user/garage",
    "/user/appointment",
    "/user/settings",
    "/user/product",
    "/user/garage/:garage_id",
    "/user/garage/:garage_id/review",
    "/user/settings/vehicles/add",
    "/user/settings/vehicles/add",
    "/user/settings/favourites/mechanics",
    "/user/settings/favourites/garages",
    "user/settings/service-history/",
    "/user/book-appointments",
    "/garage/dashboard",
    "/garage/appointment",
    "/garage/product",
    "/garage/settings",
    "/garage/order",
  ];

  const shouldUseLayout = !noLayoutRoutes.some((route) =>
    matchPath({ path: route, end: false }, location.pathname)
  );

  return (
    <>
      <UserProvider>
        {shouldUseLayout ? (
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/appointment" element={<BookAppointment />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Layout>
        ) : (
          <>
            <Routes>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/myProfile" element={<ProfilePage />} />
              <Route path="/user/garage" element={<GaragePage />} />
              <Route path="/user/appointment" element={<AppointmentPage />} />
              <Route path="/user/product" element={<ProductPage />} />
              <Route path="/user/settings" element={<SettingsPage />} />
              <Route
                path="/user/garage/:garage_id"
                element={<GarageDetails />}
              />
              <Route
                path="/user/garage/:garage_id/review"
                element={<GarageReviewForm />}
              />
              <Route
                path="/user/settings/vehicles/add"
                element={<AddVehicleForm />}
              />
              <Route
                path="/user/settings/vehicles/edit"
                element={<EditVehicles />}
              />
              <Route
                path="/user/settings/favourites/mechanics"
                element={<FavouriteMechanicsTable />}
              />
              <Route
                path="/user/settings/favourites/garages"
                element={<FavouriteGaragesTable />}
              />
              <Route
                path="/user/settings/service-history"
                element={<ServiceHistoryTable />}
              />
              <Route
                path="/user/book-appointments"
                element={<AppointmentFrom />}
              />

              {/* GARAGE SECTION LINKS  */}
              <Route path="/garage/dashboard" element={<GarageDashboard />} />
              <Route
                path="/garage/appointment"
                element={<GarageAppointment />}
              />
              <Route path="/garage/product" element={<GarageProduct />} />
              <Route path="/garage/order" element={<GarageOrder />} />

              <Route path="/garage/settings" element={<GarageSettings />} />
            </Routes>
            <ChatBotModal />
          </>
        )}
      </UserProvider>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
