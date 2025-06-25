import axios from "axios";

/**
 * @param {number} page
 * @param {string} questionId
 * @returns {Promise<{ content: any[], totalPages: number }>}
 */
export const fetchAnswers = async (page = 1, questionId) => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await axios.get("/api/api/answer/v1", {
    params: {
      page,
      size: 10,
      csquestion_id: questionId,
      sort: "csanswer_created_at,asc",
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return {
    content: res.data.result.content,
    totalPages: res.data.result.totalPages,
  };
};