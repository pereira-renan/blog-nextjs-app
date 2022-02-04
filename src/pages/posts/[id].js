import Head from "next/head"
import Layout from "../../components/layout"
import PostCard from "../../components/PostCard"

export default function Post({ post }) {
  return (
    <Layout>
      <Head>
        <title>Home</title>
      </Head>

      <main>
        <div>
          <ul>
            <PostCard post={post} />
          </ul>
        </div>
      </main>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  let id = ctx.params.id
  // get the current environment
  let dev = process.env.NODE_ENV !== "production"
  let { DEV_URL, PROD_URL } = process.env

  // request posts from api
  let response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/posts/${id}`)
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
