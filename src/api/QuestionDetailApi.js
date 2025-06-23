import axios from 'axios';

// 질문 상세 정보 가져오기
export const getQuestionDetail = async (postId) => {
  const res = await axios.get(`/api/api/post/v1/${postId}`);
  console.log("객체 확인: ", res)
  return res.data.data;
};

// 질문 수정
export const updateQuestion = async (postId, data) => {    
  const res = await axios.post(`/api/api/post/v1/update/${postId}`, data, {
   headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  });
      console.log(data,localStorage.getItem("accessToken"));
  return res.data.data;
};

// 질문 삭제
export const deleteQuestion = async (postId) => {
  const res = await axios.post(`/api/api/post/v1/delete/${postId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  });
  return res.data.data;
};

// 댓글 목록 가져오기
export const getComments = async (postId) => {
  const res = await axios.get(`/api/api/comment/v1/${postId}`);
  console.log('getComments response:', res.data.data);
  return res.data.data?.comments || [];
};

// 댓글 작성
export const postComment = async (postId, comment) => {
  const res = await axios.post(`/api/api/comment/v1/create/${postId}`, comment, {
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
});
  return res.data.data;
};

// 댓글 수정
export const updateComment = async (commentId, updatedData) => {
  const res = await axios.post(`/api/api/comment/v1/update/${commentId}`, updatedData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  console.log("댓글 수정 응답:", res.data.data);
  return res.data.data;
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  const res = await axios.post(`/api/api/comment/v1/delete/${commentId}`, null, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return res.data.data;
};

// 댓글 좋아요
export const likeComment = async (commentId) => {
  const res = await axios.post(`/api/api/like/v1/${commentId}/like`, null, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  console.log("댓글 좋아요 응답:", res.data.data); // { comment_id, is_liked }
  return res.data.data;
};
