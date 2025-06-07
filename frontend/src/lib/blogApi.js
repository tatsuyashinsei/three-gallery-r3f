import axios from 'axios'

const SERVICE_DOMAIN = import.meta.env.VITE_MICROCMS_SERVICE_DOMAIN
const API_KEY = import.meta.env.VITE_MICROCMS_API_KEY

export const getBlogList = async () => {
  try {
    const res = await axios.get(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/blog`, {
      headers: { 'X-MICROCMS-API-KEY': API_KEY }
    })
    return res.data.contents
  } catch (error) {
    console.error('Failed to fetch blog list:', error)
    return []
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