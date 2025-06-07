import axios from 'axios';

const INSTAGRAM_API_URL = 'https://graph.instagram.com/me';

export const fetchInstagramPosts = async (accessToken) => {
  try {
    // まず、ユーザーのメディアIDを取得
    const mediaResponse = await axios.get(`${INSTAGRAM_API_URL}/media`, {
      params: {
        access_token: accessToken,
        fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp'
      }
    });

    // 最新の3件の投稿を返す
    return mediaResponse.data.data.slice(0, 3).map(post => ({
      id: post.id,
      image: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
      link: post.permalink,
      title: post.caption ? post.caption.split('\n')[0] : '投稿',
      date: new Date(post.timestamp).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));
  } catch (error) {
    console.error('Instagram APIエラー:', error);
    return [];
  }
}; 