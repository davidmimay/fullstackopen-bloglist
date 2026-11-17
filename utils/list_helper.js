const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0]) 
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  // Count how many blogs
  const authorCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts
  }, {})

  // Author with most blogs
  let topAuthor = null
  let maxCount = 0

  for (const [author, count] of Object.entries(authorCounts)) {
    if (count > maxCount) {
      maxCount = count
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    blogs: maxCount
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}