import axios from "axios";

export async function postQuestion({ title, category, question_id, content }) {
  const accessToken = localStorage.getItem("accessToken");
  const res = await axios.post(
    "/api/api/post/v1/create",
    { title, category, question_id, content },
    {
      headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
}