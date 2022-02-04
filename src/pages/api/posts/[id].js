// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "../../../lib/mongodb"

async function connectDb() {
  let db = await (await clientPromise).db("sample_posts")
  return db
}

export default async function handler(req, res) {
  const { id } = req.query

  try {
    let db = await connectDb()
    let post = await db.collection("posts").findOne({ id: parseInt(id) })
    if (!post) {
      return res.send({
        message: "Post not found",
        success: false,
      })
    }
    return res.send({
      message: post,
      success: true,
    })
  } catch (error) {
    return res.send({
      message: new Error(error).message,
      success: false,
    })
  }
}
