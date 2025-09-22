import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./AboutUs.css";
import "./home.css";
import "./NavBar.css";
import "./components/qs.css";
import { NavBar } from "./components/NavBar";
import { AboutUs } from "./components/AboutUs";
import { HomePage } from "./components/home";
import QuestionPaper from "./components/qs";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginForm from "./components/loginform";
import Login from "./components/login";
import "./loginform.css";
function App() {
  return (
    <div className="App">
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/qs" element={<QuestionPaper />} />
        <Route path="/loginform" element={<LoginForm />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
