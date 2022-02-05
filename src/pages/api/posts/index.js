// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "../../../lib/mongodb"

async function connectDb() {
  let db = await (await clientPromise).db("sample_posts")
  return db
}

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case "GET": {
      return getPosts(req, res)
    }

    case "POST": {
      return addPost(req, res)
    }
  }

  async function checkPostId() {
    try {
      let db = await connectDb()
      let data = await db.collection("metadata").findOne({})
      let newId = data.lastPostId + 1
      await db
        .collection("metadata")
        .updateOne({}, { $set: { lastPostId: newId } })
      return newId
    } catch (error) {
      let db = await connectDb()
      await db.collection("metadata").insertOne({ lastPostId: 0 })
      return 0
    }
  }

  // Getting all posts.
  async function getPosts(req, res) {
    try {
      let db = await connectDb()
      let posts = await db
        .collection("posts")
        .find({})
        .sort({ id: -1 })
        .toArray()

      return res.status(200).json({
        message: JSON.parse(JSON.stringify(posts)),
        success: true,
      })
    } catch (error) {
      return res.json({
        message: new Error(error).message,
        success: false,
      })
    }
  }

  // Adding a new post
  async function addPost(req, res) {
    try {
      //check if the request body is already an object, if not, parses into one
      if (req.body && typeof req.body === "object") {
        var body = req.body
      } else {
        var body = JSON.parse(req.body)
      }
      let db = await connectDb()

      //get latest postId, creates a new one, stores on metadata and forwards to addPost
      let newId = await checkPostId()
      body["comments"] = []
      body["id"] = newId
      await db.collection("posts").insertOne(body)
      console.log(body)
      return res.status(201).json({
        message: `Post ${newId} created successfully`,
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
