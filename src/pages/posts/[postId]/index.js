import Head from "next/head"
import Layout from "../../../components/layout"
import PostCard from "../../../components/PostCard"
import CommentCard from "../../../components/CommentCard"
import CommentForm from "../../../components/CommentForm"
import { useState } from "react"

export default function FullPost({ post }) {
  const [adding, setAddComment] = useState(false)

  const AddComment = async () => {
    //change deleting state
    if (!adding) {
      setAddComment(true)
    } else {
      setAddComment(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Home</title>
      </Head>

      <main>
        <div>
          <PostCard post={post} />
          {adding ? (
            <>
              <CommentForm />
            </>
          ) : (
            <button type="button" onClick={() => AddComment()}>
              Add Comment
            </button>
          )}
          <h3>Comments Section</h3>
          {post.comments.length === 0 ? (
            <p>No one has commented yet</p>
          ) : (
            <>
              {post.comments.map((comment, i) => (
                <CommentCard comment={comment} key={i} />
              ))}
            </>
          )}
        </div>
      </main>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  let postId = ctx.params.postId

  // get the current environment
  let dev = process.env.NODE_ENV !== "production"
  let { DEV_URL, PROD_URL } = process.env

  // request posts from api
  let response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/posts/${postId}`)
  // extract the data
  let data = await response.json()

  if (!data.success) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    }
  }

  return {
    props: {
      post: data["message"],
    },
  }
}
