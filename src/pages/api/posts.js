// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "../../lib/mongodb"
import { ObjectId } from "bson"

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

    case "PUT": {
      return updatePost(req, res)
    }

    case "DELETE": {
      return deletePost(req, res)
    }
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
    let { db } = await connectToDatabase()
    await db.collection("metadata").insertOne({ lastPostId: 0 })
    return 0
  }
}

// Getting all posts.
async function getPosts(req, res) {
  try {
    let db = await connectDb()
    let posts = await db.collection("posts").find({}).sort({ id: -1 }).toArray()

    return res.json({
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
    let db = await connectDb()

    //get latest postId, creates a new one, stores on metadata and forwards to addPost
    let newId = await checkPostId()

    var body = JSON.parse(req.body)
    body["id"] = newId
    await db.collection("posts").insertOne(body)
    console.log(body)
    return res.json({
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

// Updating a post
async function updatePost(req, res) {
  try {
    let db = await connectDb()
    let publishStatus = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(req.body) })
    if (!publishStatus.published) {
      await db.collection("posts").updateOne(
        {
          _id: new ObjectId(req.body),
        },
        { $set: { published: true } }
      )
    } else {
      await db.collection("posts").updateOne(
        {
          _id: new ObjectId(req.body),
        },
        { $set: { published: false } }
      )
    }

    return res.json({
      message: "Post updated successfully",
      success: true,
    })
  } catch (error) {
    return res.json({
      message: new Error(error).message,
      success: false,
    })
  }
}

// deleting a post
async function deletePost(req, res) {
  try {
    let db = await connectDb()

    await db.collection("posts").deleteOne({
      _id: new ObjectId(req.body),
    })

    return res.json({
      message: "Post deleted successfully",
      success: true,
    })
  } catch (error) {
    return res.json({
      message: new Error(error).message,
      success: false,
    })
  }
}
