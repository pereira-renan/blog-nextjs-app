import { useState } from "react"
import { useRouter } from "next/router"

export default function PostCard({ post }) {
  const [publishing, setPublishing] = useState(false)
  const [unpublishing, setUnpublishing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  // Publish post
  const publishPost = async (postId) => {
    // change publishing state
    setPublishing(true)

    try {
      // Update post
      await fetch(`/api/posts/${postId}`, {
        method: "PUT",
      })

      // reset the publishing state
      setPublishing(false)

      // reload the page
      return router.push(router.asPath)
    } catch (error) {
      // Stop publishing state
      return setPublishing(false)
    }
  }

  const unpublishPost = async (postId) => {
    // change publishing state
    setUnpublishing(true)

    try {
      // Update post
      await fetch(`/api/posts/${postId}`, {
        method: "PUT",
      })

      // reset the publishing state
      setUnpublishing(false)

      // reload the page
      return router.push(router.asPath)
    } catch (error) {
      // Stop publishing state
      return setUnpublishing(false)
    }
  }

  // Delete post
  const deletePost = async () => {
    //change deleting state
    if (!deleting) {
      setDeleting(true)
    } else {
      setDeleting(false)
    }
  }

  // Delete post
  const confirmDeletePost = async (postId) => {
    //change deleting state
    setDeleting(true)

    try {
      // Delete post
      await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      })

      // reset the deleting state
      setDeleting(false)

      // reload the page
      return router.push(router.asPath)
    } catch (error) {
      // stop deleting state
      return setDeleting(false)
    }
  }

  return (
    <>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p>{post.id}</p>

      <p>{String(post.published)}</p>
      <small>{new Date(post.createdAt).toLocaleDateString()}</small>
      <br />
      <button type="button" onClick={() => router.push(`/posts/${post.id}`)}>
        View Post
      </button>
      {!post.published ? (
        <button type="button" onClick={() => publishPost(post.id)}>
          {publishing ? "Publishing" : "Publish"}
        </button>
      ) : (
        <button type="button" onClick={() => unpublishPost(post.id)}>
          {unpublishing ? "Unpublishing" : "Unpublish"}
        </button>
      )}
      {deleting ? (
        <>
          Delete this post?
          <button type="button" onClick={() => confirmDeletePost(post["id"])}>
            Yes
          </button>
          <button type="button" onClick={() => deletePost()}>
            No
          </button>
        </>
      ) : (
        <button type="button" onClick={() => deletePost()}>
          Delete
        </button>
      )}
      <button
        type="button"
        onClick={() => router.push(`/posts/${post.id}/comments`)}
      >
        View Comments
      </button>
    </>
  )
}
