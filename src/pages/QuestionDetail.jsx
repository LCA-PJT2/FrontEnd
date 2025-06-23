import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  getQuestionDetail,
  getComments,
  postComment,
  updateQuestion,
  deleteQuestion,
  updateComment,
  deleteComment,
  likeComment, // 추가
} from "../api/QuestionDetailApi";
import "../styles/style.css";
import BigButton from "../components/global/BigButton";

const QuestionDetail = () => {
  const { number } = useParams();
  const navigate = useNavigate();
  const [questionInfo, setQuestionInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const fetchComments = async () => {
    try {
      const commentList = await getComments(number);
      const sortedComments = commentList.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setComments(sortedComments);
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const question = await getQuestionDetail(number);
        setQuestionInfo(question);
        setEditedContent(question.content);
        setEditedTitle(question.title);
        await fetchComments();
      } catch (error) {
        console.error(error);
        setQuestionInfo(null);
        setComments([]);
      }
    };

    if (number) {
      fetchData();
    }
  }, [number]);

  const handleCommentSubmit = async () => {
    const trimmed = input.trim();
    if (trimmed === "") {
      alert("댓글을 입력해주세요.");
      return;
    }

    const newComment = {
      content: trimmed,
      username: "익명",
    };

    try {
      await postComment(number, newComment);
      await fetchComments();
      setInput("");
    } catch (error) {
      console.error(error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommentSubmit();
    }
  };

  const handleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      updateQuestion(number, {
        title: editedTitle,
        question_id: questionInfo.question_id,
        content: editedContent,
        category: questionInfo.category,
      })
        .then(() => {
          setQuestionInfo({
            ...questionInfo,
            content: editedContent,
            title: editedTitle,
          });
          setIsEditing(false);
          alert("질문이 수정되었습니다.");
        })
        .catch((err) => {
          console.error(err);
          alert("수정에 실패했습니다.");
        });
    }
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteQuestion(number)
        .then(() => {
          alert("질문이 삭제되었습니다.");
          navigate("/comm");
        })
        .catch((err) => {
          console.error(err);
          alert("삭제에 실패했습니다.");
        });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      try {
        await deleteComment(commentId);
        await fetchComments();
      } catch (err) {
        console.error(err);
        alert("댓글 삭제 실패");
      }
    }
  };

  const startEditComment = (comment) => {
    setEditingCommentId(comment.comment_id);
    setEditingContent(comment.content);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const saveEditComment = async () => {
    try {
      await updateComment(editingCommentId, {
        content: editingContent,
      });
      await fetchComments();
      setEditingCommentId(null);
      setEditingContent("");
    } catch (err) {
      console.error(err);
      alert("댓글 수정 실패");
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const result = await likeComment(commentId); // ← { comment_id, is_liked }

      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.comment_id === result.comment_id) {
            return {
              ...comment,
              is_liked: result.is_liked,
              like_count: comment.like_count + (result.is_liked ? 1 : -1),
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error("댓글 좋아요 실패:", error);
      alert("좋아요에 실패했습니다.");
    }
  };

  return (
    <div className="bg-white px-120 flex flex-col justify-center items-center">
      {!questionInfo ? (
        <p className="text-center text-gray-500">질문 정보를 불러올 수 없습니다.</p>
      ) : (
        <>
          <table className="question-table border w-full text-sm mb-6">
            <tbody>
              <tr className="border-b">
                <td className="font-semibold text-start">제목</td>
                <td colSpan="3">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full rounded focus:outline-0"
                    />
                  ) : (
                    questionInfo.title
                  )}
                </td>
                <td className="font-semibold">작성자</td>
                <td>{questionInfo.username}</td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold">주제</td>
                <td>{questionInfo.category}</td>
                <td className="font-semibold">문제 번호</td>
                <td>{questionInfo.question_id}</td>
                <td className="font-semibold">작성일</td>
                <td>{questionInfo.created_at.slice(0, 10).replaceAll("-", "/")}</td>
              </tr>
            </tbody>
          </table>

          {isEditing ? (
            <div className="w-full">
              <CKEditor
                editor={ClassicEditor}
                data={editedContent}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setEditedContent(data);
                }}
              />
            </div>
          ) : (
            <div className="w-full p-12 border-gray-300 border-1 rounded-xl min-h-200">
              <div dangerouslySetInnerHTML={{ __html: questionInfo.content }} />
            </div>
          )}

          <div className="flex justify-end gap-8 w-full py-16">
            <BigButton text={isEditing ? "저장" : "수정"} onClick={handleEdit} fill />
            <BigButton text="삭제" onClick={handleDelete} />
          </div>
        </>
      )}

      <div className="w-full">
        <h3 className="text-lg mb-16">댓글</h3>

        <div className="comment-input flex my-16 w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="댓글을 입력하세요"
            className="border p-2 w-full rounded-l-md focus:outline-none"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-primary text-white rounded-r-md px-4"
          >
            작성
          </button>
        </div>

        <ul>
          {comments.map((comment) => (
            <li key={comment.comment_id} className="border-b-1 border-gray-300 p-8">
              <div className="flex justify-between items-center mb-2">
                <div className="flex gap-2 items-center">
                  <p className="text-primary font-semibold">{comment.username}</p>
                  <span className="text-xs text-gray-500">
                    · {comment.created_at.slice(0, 10).replaceAll("-", "/")}
                  </span>
                </div>
                <div className="flex gap-2 text-sm">
                  <button
                    onClick={() => startEditComment(comment)}
                    className="border border-blue-500 text-blue-500 rounded px-2 py-0.5 hover:bg-blue-50 cursor-pointer"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.comment_id)}
                    className="border border-red-500 text-red-500 rounded px-2 py-0.5 hover:bg-red-50 cursor-pointer"
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => handleLikeComment(comment.comment_id)}
                    className={`border rounded px-2 py-0.5 cursor-pointer transition-all ${
                      comment.is_liked
                        ? "border-green-600 text-green-600 bg-green-50"
                        : "border-green-500 text-green-500 hover:bg-green-50"
                    }`}
                  >
                    👍 {comment.like_count ?? 0}
                  </button>
                </div>
              </div>
              {editingCommentId === comment.comment_id ? (
                <div className="mt-2 flex flex-col gap-2">
                  <input
                    type="text"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="border rounded p-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEditComment}
                      className="text-blue-500 border border-blue-500 px-2 py-1 rounded hover:bg-blue-50"
                    >
                      저장
                    </button>
                    <button
                      onClick={cancelEditComment}
                      className="text-gray-500 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-black mt-2">{comment.content}</div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestionDetail;
