// model.ts
export type Post = {
    id: string
    title: string
    content: string
    author: string
    date: string
}

const dummyPosts: Post[] = [
    {
        id: '1',
        title: 'First Post',
        content: 'This is the content of the first post.',
        author: 'Author 1',
        date: '2024-06-22'
    },
    {
        id: '2',
        title: 'Second Post',
        content: 'This is the content of the second post.',
        author: 'Author 2',
        date: '2024-06-21'
    },
    // Add more dummy posts as needed
]

export const getPosts = ({ limit, offset }: { limit?: string, offset?: string }) => {
    const l = limit ? parseInt(limit, 10) : dummyPosts.length
    const o = offset ? parseInt(offset, 10) : 0
    return dummyPosts.slice(o, o + l)
}

export const getPost = ({ id }: { id: string }) => {
    return dummyPosts.find(post => post.id === id)
}

export const createPost = ({ post }: { post: Post }) => {
    dummyPosts.push(post)
    return true
}
