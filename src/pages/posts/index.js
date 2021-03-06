import Head from "next/head"

import Layout from "../../components/layout"
import PostCard from "../../components/PostCard"

export default function Home({ posts }) {
  return (
    <Layout>
      <Head>
        <title>Home</title>
      </Head>
      <main>
        <div>
          {posts.length === 0 ? (
            <h2>No added posts</h2>
          ) : (
            <ul>
              <li>
                {posts.map((post, i) => (
                  <PostCard post={post} key={i} />
                ))}
              </li>
            </ul>
          )}
        </div>
      </main>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  // get the current environment
  let dev = process.env.NODE_ENV !== "production"
  let { DEV_URL, PROD_URL } = process.env

  // request posts from api
  let response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/posts`, {
    method: "GET",
  })
  // extract the data
  let data = await response.json()

  return {
    props: {
      posts: data["message"],
    },
  }
}
