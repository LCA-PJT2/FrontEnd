import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Category from '../components/global/Category';
import '../App.css';
import { postQuestion } from "../api/QuestionPostAPI";
import BigButton from '../components/global/BigButton';

function QuestionPostPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('전체');
  const [question_id, setQuestionID] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);


    const postData = {
      title,
      category,
      question_id, 
      content,
    };

      postQuestion(postData).then((data)=>{
        const postId = data.data.id;
        
        alert("질문이 등록되었습니다.");
        navigate(`/comm/${postId}`);
        setIsSubmitting(false);
      });

    }
    

const inputStyle =
  "w-full px-10 py-10 border-gray-300 border-1 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary";

  const isValid = title.trim() && content.trim() && question_id;

  return (
    <section className="mx-auto max-w-5xl pt-14 pb-24 px-6">
      <div className="grid grid-cols-[120px_1fr] gap-y-8 gap-x-8">
        {/* 제목 */}
        <label className="self-center text-base font-medium">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className={inputStyle}
        />

        {/* 카테고리 */}
        <label className="self-center text-base font-medium">카테고리</label>
        <Category
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* 문제번호 */}
        <label className="self-center text-base font-medium">문제번호</label>
        <input
          type="text"
          value={question_id}
          onChange={(e) => setQuestionID(e.target.value)}
          placeholder="문제번호"
          className={inputStyle}
        />
      </div>

      {/* 에디터 */}
      <div className="mt-10">
        <CKEditor
          editor={ClassicEditor}
          onChange={(event, editor) => setContent(editor.getData())}
        />
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-end mt-8">
        <BigButton
          text={isSubmitting ? "등록 중..." : "제출"}
          fill
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
        />
      </div>
    </section>
  );
}

export default QuestionPostPage;
