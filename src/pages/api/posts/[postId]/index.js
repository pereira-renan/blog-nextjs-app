// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "../../../../lib/mongodb"

async function connectDb() {
  let db = await (await clientPromise).db("sample_posts")
  return db
}

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case "GET": {
      return getPost(req, res)
    }

    case "PUT": {
      return updatePost(req, res)
    }

    case "DELETE": {
      return deletePost(req, res)
    }
  }
}

async function getPost(req, res) {
  try {
    let postId = parseInt(req.query.postId)

    let db = await connectDb()
    let post = await db.collection("posts").findOne({ id: postId })
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

// Updating a post
async function updatePost(req, res) {
  try {
    let postId = parseInt(req.query.postId)

    let db = await connectDb()
    let publishStatus = await db.collection("posts").findOne({ id: postId })

    console.log(publishStatus)
    if (!publishStatus.published) {
      await db.collection("posts").updateOne(
        {
          id: postId,
        },
        { $set: { published: true } }
      )
    } else {
      await db.collection("posts").updateOne(
        {
          id: postId,
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
    let postId = parseInt(req.query.postId)

    let db = await connectDb()

    await db.collection("posts").deleteOne({
      id: postId,
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
