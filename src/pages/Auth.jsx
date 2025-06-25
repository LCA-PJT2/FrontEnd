import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "signin";
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="max-w-500 margin-top 20px mt-100 mx-auto my-auto cmt-25 bg-white shadow-lg rounded-lg">
      {/* 탭 네비 */}
      <nav className="flex border-b">
        <button
          className={`flex-1 py-15 text-center font-semibold cursor-pointer ${
            activeTab === "signin"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("signin")}
        >
          Sign In
        </button>
        <button
          className={`flex-1 py-15 text-center font-semibold cursor-pointer ${
            activeTab === "signup"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("signup")}
        >
          Sign Up
        </button>
      </nav>

      <div className="p-50">
        {activeTab === "signin" ? <SignInForm /> : <SignUpForm />}
      </div>
    </div>
  );
}
const inputStyle =
  "w-full px-10 py-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/user/login", { email, password });
      const result = res.data.result;
      

      localStorage.setItem("accessToken", result.accesstoken);
      localStorage.setItem("email", result.email);
      localStorage.setItem("name", result.name);
      localStorage.setItem("nickname", result.nickname);
      localStorage.setItem("profileImgUrl", result.profileImgUrl);

      document.cookie = `refreshToken=${result.refreshtoken}; path=/; max-age=${7 * 24 * 60 * 60}; Secure; SameSite=Strict`;

      
      axios.defaults.headers.common["Authorization"] = `Bearer ${result.accesstoken}`;
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-20">
      <input
        type="text"
        placeholder="Username or email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className={inputStyle}
      />
      <button
        type="submit"
        className="w-full py-8 font-semibold rounded-md bg-primary text-white cursor-pointer"
      >
        Sign In
      </button>
    </form>
  );
}

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [profile_image, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const formData = new FormData();

    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("nickname", nickname);

    if (profile_image) {
      formData.append("profileImage", profile_image);
    }

    try {
      const res = await axios.post("/api/user/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    // 미리보기 생성
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Base64 URL 설정
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-20">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className={inputStyle}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className={inputStyle}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={inputStyle}
      />
      <input
        type="text"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        required
        className={inputStyle}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageChange(e)}
        className={inputStyle}
      />
      {previewUrl && <img src={previewUrl} alt="" className="w-70 h-70" />}
      <button
        type="submit"
        className="w-full py-8 font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
      >
        Sign Up
      </button>
    </form>
  );
}
