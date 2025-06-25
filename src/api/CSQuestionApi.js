import axios from "axios";
export const fetchQuestions = async (page = 1, category = "") => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await axios.get("/api/api/question/v1", {
    params: {
      page: page,
      category: category || undefined,
    },
    ...(accessToken && {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  });

  return res.data.result;
};

export const fetchTodayQuestion = async () => {
  const res = await axios.get("/api/api/question/v1/today");
  return res.data.result;
};

export const fetchQuestionById = async (questionId) => {
  const res = await axios.get(`/api/questions/v1/${questionId}`);

  return res.data.result;
};
