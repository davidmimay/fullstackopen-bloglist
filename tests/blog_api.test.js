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

describe('super test', () => {

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
})
// Close Mongoose conection
after(async () => {
  await mongoose.connection.close()
})