import clientPromise from "../../lib/mongodb"

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case "GET": {
      return getLivePosts(req, res)
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

async function getLivePosts(req, res) {
  try {
    let db = await (await clientPromise).db("sample_posts").collection("posts")
    let posts = await db.find({ published: false }).sort({ id: -1 }).toArray()
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
