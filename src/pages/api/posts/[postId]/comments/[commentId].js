// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "../../../../../lib/mongodb"

async function connectDb() {
  let db = await (await clientPromise).db("sample_posts")
  return db
}

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case "DELETE": {
      return deleteComment(req, res)
    }
  }

  async function deleteComment(req, res) {
    try {
      let postId = parseInt(req.query.postId)
      let commentId = parseInt(req.query.commentId)

      let db = await connectDb()

      await db
        .collection("posts")
        .updateOne(
          { id: postId },
          { $pull: { comments: { commentId: commentId } } }
        )
      return res.json({
        message: "Comment deleted successfully",
        success: true,
      })
    } catch (error) {
      return res.json({
        message: new Error(error).message,
        success: false,
      })
    }
  }
}
