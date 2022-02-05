import { useState } from "react"
import styles from "../styles/Home.module.css"
import { useRouter } from "next/router"

export default function AddComment() {
  const [author, setAuthor] = useState("")
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [send, setSending] = useState(false)
  const router = useRouter()

  const handlePost = async (e) => {
    e.preventDefault()
    setSending(true)

    // reset error and message
    setError("")
    setMessage("")

    // fields check
    if (!author || !comment)
      return setError("All fields are required"), setSending(false)

    // post structure
    let commentData = {
      author,
      comment,
      createdAt: new Date().toISOString(),
    }

    let postId = parseInt(router.query.postId)
    // Delete Comment
    let response = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(commentData),
    })

    // get the data
    let data = await response.json()

    if (data.success) {
      return router.reload()
    } else {
      setSending(false)
      // set the error
      return setError(data.message)
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handlePost} className={styles.form}>
        {error ? (
          <div className={styles.formItem}>
            <h3 className={styles.error}>{error}</h3>
          </div>
        ) : null}
        {message ? (
          <div className={styles.formItem}>
            <h3 className={styles.message}>{message}</h3>
          </div>
        ) : null}
        <div className={styles.formItem}>
          <label>author</label>
          <input
            type="text"
            name="author"
            onChange={(e) => setAuthor(e.target.value)}
            value={author}
            placeholder="author"
          />
        </div>
        <div className={styles.formItem}>
          <label>comment</label>
          <textarea
            name="comment"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder="Comment comment"
          />
        </div>
        {send ? (
          <button type="input">Sending</button>
        ) : (
          <button type="input">Send</button>
        )}
      </form>
    </div>
  )
}
