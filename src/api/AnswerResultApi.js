import axios from "axios";

//특정 답변 조회
export const getAnswer = async (answerId) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const res = await axios.get(`/api/answer/v1/${answerId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(res.data);
    return res;
  } catch (e) {
    console.log(e);
  }

};

// AI 피드백 요청
export const requestFeedback = async (answerId) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await axios.post(
      `/api/answers/v1/ai/${answerId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
      }
    );
    console.log("requestFeedback 응답:", res.data);
    return res;
  } catch (e) {
    console.error("requestFeedback 에러:", e);
    throw e;
  }
};


// 답변 수정 요청
export const editAnswer = async (answerId, content) => {
  const accessToken = localStorage.getItem("accessToken");
  console.log(content);
  try {
    const res = await axios.post(
      `/api/answer/v1/update/${answerId}`,
      { csanswer_content: content },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

  } catch (e) {
    console.log(e);
  }
};

//답변 삭제 요청
export const deleteAnswer = async (answerId) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await axios.post(
      `/api/answer/v1/delete/${answerId}`,{},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
};

const AnswerResultapi = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default AnswerResultapi;
