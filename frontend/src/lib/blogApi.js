import axios from 'axios'

const SERVICE_DOMAIN = import.meta.env.VITE_MICROCMS_SERVICE_DOMAIN
const API_KEY = import.meta.env.VITE_MICROCMS_API_KEY
const PER_PAGE = 8 // 1ページあたりの記事数

export const getBlogList = async (page = 1) => {
  try {
    const offset = (page - 1) * PER_PAGE
    const res = await axios.get(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/blog`, {
      headers: { 'X-MICROCMS-API-KEY': API_KEY },
      params: {
        offset,
        limit: PER_PAGE,
      }
    })
    return {
      contents: res.data.contents,
      totalCount: res.data.totalCount,
      offset: res.data.offset,
      limit: res.data.limit
    }
  } catch (error) {
    console.error('Failed to fetch blog list:', error)
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: PER_PAGE
    }
  }
}

export const getBlogBySlug = async (slug) => {
  try {
    const res = await axios.get(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/blog`, {
      headers: { 'X-MICROCMS-API-KEY': API_KEY },
      params: { filters: `slug[equals]${slug}` }
    })
    return res.data.contents[0]
  } catch (error) {
    console.error('Failed to fetch blog post:', error)
    return null
  }
} 