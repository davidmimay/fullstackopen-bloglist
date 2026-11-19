const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

// Dummy
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5
  }
]

// Clean DB before each test
beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('existing blog', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2) // Blogs created: 2
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    // Verify first blog id defined
    assert.strictEqual(typeof response.body[0].id, 'string')
    // Veryfy _id do not exist
    assert.strictEqual(response.body[0]._id, undefined)
  })
})

describe('new blog', () => {

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Async/await in Node.js testing',
      author: 'Full Stack Open Student',
      url: 'https://fullstackopen.com/',
      likes: 4
    }
    // Count blogs
    const blogsAtStart = await api.get('/api/blogs')

    // Post new blog
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Get blogs
    const blogsAtEnd = await api.get('/api/blogs')
    
    // Verify + 1
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length + 1)

    // Verify title in response
    const titles = blogsAtEnd.body.map(b => b.title)
    assert.strictEqual(titles.includes('Async/await in Node.js testing'), true)
  })

  test('blog without likes property defaults to 0 likes', async () => {
    const newBlogWithoutLikes = {
      title: 'Blog without likes property',
      author: 'Test Author',
      url: 'https://example.com/no-likes'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Verify 0 likes
    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title or url is not added and returns 400', async () => {
  const newBlogWithoutTitle = {
    author: 'Test Author',
    url: 'https://example.com/no-title',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400)

  const blogsAtEnd = await api.get('/api/blogs')  
  assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length)
  })

})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const responseAtStart = await api.get('/api/blogs')
    const blogsAtStart = responseAtStart.body
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const responseAtEnd = await api.get('/api/blogs')
    const blogsAtEnd = responseAtEnd.body

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.strictEqual(titles.includes(blogToDelete.title), false)
  })
})

describe('updating a blog', () => {
  test('succeeds with status code 200 and updates likes if id is valid', async () => {
    const responseAtStart = await api.get('/api/blogs')
    const blogToUpdate = responseAtStart.body[0]

    const updatedData = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 10
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
    assert.strictEqual(response.body.title, blogToUpdate.title)
  })
})

// Close Mongoose conection
after(async () => {
  await mongoose.connection.close()
})