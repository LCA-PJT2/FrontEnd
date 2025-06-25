import React, { useState, useEffect } from "react";
import "../styles/style.css";
import BigButton from "../components/global/BigButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { postLogout } from "../api/authApi";

function InfoUpdate() {
  const navigate = useNavigate();

  // userInfo 상태 생성 (초기값은 빈 객체)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [nickname, setNickname] = useState(localStorage.getItem("nickname"));
  const [newProfileimage, setNewProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 컴포넌트 마운트 시 public/UserInfoData.json 파일 fetch
  // useEffect(() => {

  // fetch('/UserInfoData.json')
  //   .then(res => res.json())
  //   .then(data => setUserInfo(data))
  //   .catch(err => console.error('유저 정보 로드 실패:', err));
  // }, []);

  const formData = new FormData();
  formData.append("currentPassword", currentPassword);
  formData.append("newPassword", newPassword);
  formData.append("nickname", nickname);

  if (newProfileimage) {
    formData.append("profileimage", newProfileimage);
  }

  // 수정 완료 버튼 클릭 시 유저정보 post 후 유저 정보 페이지로 이동동
  const handleSubmit = async (e) => {
    const accessToken = localStorage.getItem("accessToken");
    e.preventDefault();

    try {
      const res = await axios.post("/api/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert("회원 정보가 수정되었습니다. 다시 로그인 해주세요.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("nickname");
      localStorage.removeItem("profileImgUrl");

      navigate("/");
      window.location.reload();
    } catch (error) {
      alert("회원 정보 수정에 실패했습니다.");
    }
  };

  const inputStyle =
    "w-full px-10 py-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary bg-white mb-16";

  const labelStyle = "w-full block mb-4";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewProfileImage(file);

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
    <div className="bg-white min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-100 py-50 px-20 rounded shadow flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">회원 정보 수정</h2>

        {/* <label className="w-full block mb-2 font-semibold" htmlFor="name">
          이름
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={nickname}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded bg-white"
        /> */}

        {/* <label className="w-full block mb-2 font-semibold" htmlFor="email">
          이메일
        </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={userInfo.email || ""}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded bg-white"
        /> */}

        <label className={labelStyle} htmlFor="currentPassword">
          현재 비밀번호
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className={inputStyle}
        />
        <label className={labelStyle} htmlFor="currentPassword">
          새 비밀번호
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className={inputStyle}
        />
        <label className={labelStyle} htmlFor="nickname">
          닉네임
        </label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          className={inputStyle}
        />
        <label className={labelStyle} htmlFor="newProfileimage">
          프로필 이미지
        </label>
        <input
          type="file"
          accept="image/*"
          id="newProfileimage"
          name="newProfileimage"
          onChange={(e) => handleImageChange(e)}
          className={inputStyle}
        />

        {previewUrl && <img src={previewUrl} alt="profileimg" className="w-70 h-70" />}

        <div className="text-center mt-40">
          <BigButton text="수정완료" fill />
        </div>
      </form>
    </div>
  );
}

export default InfoUpdate;
