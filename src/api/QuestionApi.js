import axios from "axios";

export async function fetchQuestions(category, searchTerm) {
    try {
        // 카테고리가 "전체"인 경우 쿼리스트링 없이 요청
        const query = category === "전체" ? "" : `?category=${encodeURIComponent(category)}`;
        const response = await fetch(`/api/api/post/v1/posts${query}`);

        const json = await response.json();

        if (!json.data || !Array.isArray(json.data.posts)) {
            return [];
        }

        let posts = json.data.posts.map(post => ({
            number: post.id,
            title: post.title,
            category: post.category,
            author: post.username || "알 수 없음",
            comments: post.comment_count || 0,
            date: post.created_at ? post.created_at.slice(0, 10) : "",
        }));

        return posts;
    } catch (error) {
        console.error("질문 데이터를 가져오는데 실패했습니다:", error);
        return [];
    }
}
