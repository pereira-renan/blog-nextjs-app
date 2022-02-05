import { useState } from "react"
import { useRouter } from "next/router"

export default function CommentCard({ comment }) {
  const [deletingComment, setDeletingComment] = useState(false)
  const router = useRouter()

  // Delete post
  const deleteComment = async () => {
    //change deleting state
    if (!deletingComment) {
      setDeletingComment(true)
    } else {
      setDeletingComment(false)
    }
  }

  // Delete post
  const confirmDeleteComment = async (commentId) => {
    //change deleting state
    setDeletingComment(true)

    try {
      let postId = parseInt(router.query.postId)
      // Delete post
      await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
      })

      // reset the deleting state
      setDeletingComment(false)

      // reload the page
      return router.push(router.asPath)
    } catch (error) {
      // stop deleting state
      return setDeletingComment(false)
    }
  }

  return (
    <>
      <div>
        <div>{comment.comment}</div>
        <h5>Author: {comment.author}</h5>
        <h5>Date: {comment.createdAt}</h5>
      </div>

      {deletingComment ? (
        <>
          Delete this comment?
          <button
            type="button"
            onClick={() => confirmDeleteComment(comment["commentId"])}
          >
            Yes
          </button>
          <button type="button" onClick={() => deleteComment()}>
            No
          </button>
        </>
      ) : (
        <button type="button" onClick={() => deleteComment()}>
          Delete
        </button>
      )}
    </>
  )
}
