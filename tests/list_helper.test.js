const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

// DUMMY
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const blogs = [
  {
    _id: '5a422aa71b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f5',
    title: 'The Secret Tesla Motors Master Plan, (just between you and me)',
    author: 'Elon Musk',
    url: 'https://www.tesla.com/es_es/secret-master-plan',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f6',
    title: 'Master Plan, Part Deux',
    author: 'Elon Musk',
    url: 'https://www.tesla.com/es_es/master-plan-part-deux',
    likes: 12,
    __v: 0
  }
]

// TESTS

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    // 7 + 5 + 12 + 5 + 12 = 41
    assert.strictEqual(result, 41)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('finds the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    const expected = {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    }
    assert.deepStrictEqual(result, expected)
  })
})

describe('favorite blog', () => {
  test('finds the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    const expected = {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    }
    assert.deepStrictEqual(result, expected)
  })
})

describe('most blogs', () => {
  test('returns the author with the most blogs and the count', () => {
    const result = listHelper.mostBlogs(blogs)
    const expected = {
      author: 'Edsger W. Dijkstra',
      blogs: 2
    }
    assert.deepStrictEqual(result, expected)
  })
})

describe('most likes', () => {
  test('returns the author with the most total likes', () => {
    const result = listHelper.mostLikes(blogs)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17 // 5 + 12 = 17
    }
    assert.deepStrictEqual(result, expected)
  })
})