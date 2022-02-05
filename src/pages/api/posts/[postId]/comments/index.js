// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "../../../../../lib/mongodb"

async function connectDb() {
  let db = await (await clientPromise).db("sample_posts")
  return db
}

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case "GET": {
      return getComment(req, res)
    }

    case "POST": {
      return addComment(req, res)
    }
  }

  async function checkCommentId() {
    try {
      let db = await connectDb()
      let data = await db.collection("metadata").findOne({})
      console.log(data)
      let newCommentId = data.lastCommentId + 1
      await db
        .collection("metadata")
        .updateOne({}, { $set: { lastCommentId: newCommentId } })
      console.log("here")
      return newCommentId
    } catch (error) {
      let db = await connectDb()
      await db
        .collection("metadata")
        .insertOne({ lastPostId: 0, lastCommentId: 0 })
      return 0
    }
  }

  async function getComment(req, res) {
    try {
      let postId = parseInt(req.query.postId)

      let db = await connectDb()
      let post = await db.collection("posts").findOne({ id: postId })
      return res.json({
        message: post.comments,
        success: true,
      })
    } catch (error) {
      return res.json({
        message: new Error(error).message,
        success: false,
      })
    }
  }

  // Updating a post
  async function addComment(req, res) {
    try {
      let postId = parseInt(req.query.postId)
      if (req.body && typeof req.body === "object") {
        var body = req.body
      } else {
        var body = JSON.parse(req.body)
      }
      let newCommentId = await checkCommentId()
      body["commentId"] = newCommentId
      console.log(body)

      let db = await connectDb()
      await db
        .collection("posts")
        .updateOne({ id: postId }, { $addToSet: { comments: body } })
      return res.json({
        message: "Comment added successfully",
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
