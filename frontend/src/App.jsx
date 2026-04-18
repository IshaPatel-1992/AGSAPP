import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ui/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MyMemberships from "./components/MyMemberships";

import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import GalleryPage from "./pages/GalleryPage";
import Contact from "./pages/Contact";
import MembershipInfo from "./pages/MembershipInfo";
import MembershipDashboard from "./pages/MembershipDashboard";
import MembershipForm from "./pages/MembershipForm";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import OurTeam from "./components/OurTeam";
import AuthCallback from "./pages/AuthCallback";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallerypage" element={<GalleryPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/membershipinfo" element={<MembershipInfo />} />
        <Route path="/membershipdashboard" element={<MembershipDashboard />} />
        <Route path="/membershipform" element={<MembershipForm />} />
        <Route path="/mymemberships" element={<MyMemberships />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ourteam" element={<OurTeam />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
      </Routes>

      <Footer />
    </Router>
  );
}