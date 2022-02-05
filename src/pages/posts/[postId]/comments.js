import Head from "next/head"
import Layout from "../../../components/layout"
import CommentCard from "../../../components/CommentCard"
import CommentForm from "../../../components/CommentForm"
import { useState } from "react"

export default function CommentsOnly({ comments, postId }) {
  return (
    <Layout>
      <Head>
        <title>Comments Section</title>
      </Head>

      <main>
        <div>
          <h1>Reading comments from post {postId}</h1>
          {comments.length === 0 ? (
            <p>No one has commented yet</p>
          ) : (
            <>
              {comments.map((comment, i) => (
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
  let response = await fetch(
    `${dev ? DEV_URL : PROD_URL}/api/posts/${postId}/comments`
  )
  // extract the data
  let data = await response.json()

  console.log(data)

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
      comments: data["message"],
      postId: postId,
    },
  }
}
