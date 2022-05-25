import { Comment, CommentBody, Tweet } from '../typings'
import TimeAgo from 'react-timeago'
import {
  ChatAlt2Icon,
  EmojiHappyIcon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from '@heroicons/react/outline'
import { fetchComments } from '../utils/fetchComments'
import { FormEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface Props {
  tweet: Tweet
}
const Tweet = ({ tweet }: Props) => {
  const [commentBoxVisible, setCommentBoxVisible] = useState(false)
  const [input, setInput] = useState('')
  const styles = {
    iconStyling: 'flex cursor-pointer items-center space-x-3 text-gray-400',
  }
  const [comments, setComments] = useState<Comment[]>([])
  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id)
    setComments(comments)
  }

  useEffect(() => {
    refreshComments()
  }, [])

  const { data: session } = useSession()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    postComment()
    setInput('')
  }
  const postComment = async () => {
    const commentBody: CommentBody = {
      comment: input,
      tweetId: tweet._id,
      username: session?.user?.name || 'Unknown',
      profileImage:
        session?.user?.image ||
        'https://icon-library.com/images/8-512_32367.png',
    }

    const result = await fetch(`/api/addComment`, {
      method: 'POST',
      body: JSON.stringify(commentBody),
    })
    const json = await result.json()
    refreshComments()
    toast("Comment Posted'", {
      icon: <EmojiHappyIcon className="text-twitter" />,
    })
    return json
  }

  return (
    <div className="flex flex-col space-x-3 border-y border-gray-100 p-5">
      <div className="flex space-x-3">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={tweet.profileImage}
          alt=""
        />
        <div>
          <div className="flex items-center space-x-1">
            <p className="mr-1 font-bold">{tweet.username}</p>
            <p className="hidden text-sm text-gray-500 sm:inline">
              @{tweet.username.replace(/\s+/g, '').toLowerCase()} .
            </p>
            <TimeAgo
              date={tweet._createdAt}
              className="text-small text-gray-500"
            />
          </div>
          <p className="pt-1">{tweet.text}</p>
          {tweet.image && (
            <img
              src={tweet.image}
              alt=""
              className="m-5 ml-0 mb-1 max-h-60 rounded-lg object-cover shadow-sm"
            />
          )}
        </div>
      </div>
      <div className="mt-5 flex justify-between">
        <div
          className={styles.iconStyling}
          onClick={() => session && setCommentBoxVisible(!commentBoxVisible)}
        >
          <ChatAlt2Icon className="h-5 w-5" />
          <p>{comments.length}</p>
        </div>
        <div className={styles.iconStyling}>
          <SwitchHorizontalIcon className="h-5 w-5" />{' '}
        </div>
        <div className={styles.iconStyling}>
          <HeartIcon className="h-5 w-5" />
        </div>
        <div className={styles.iconStyling}>
          <UploadIcon className="h-5 w-5" />
        </div>
      </div>
      {/* Comment Box Logic */}
      {commentBoxVisible && (
        <form onSubmit={handleSubmit} className="mt-3 flex space-x-3">
          <input
            type="text"
            placeholder="Write a comment"
            className="flex-1 rounded-lg bg-gray-100 p-2 outline-none"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <button
            className="text-twitter  disabled:text-gray-200"
            disabled={!input}
            type="submit"
          >
            Post
          </button>
        </form>
      )}
      <div>
        {comments?.length > 0 && (
          <div className="my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5 scrollbar-hide">
            {comments.map((comment) => (
              <div key={comment._id} className="relative flex space-x-2">
                <hr className="absolute left-5 top-10 h-8 border-x border-twitter/30" />
                <img
                  src={comment.profileImage}
                  alt=""
                  className="mt-2 h-7 w-7 rounded-full object-cover"
                />
                <div className="">
                  <div className="flex items-center space-x-1">
                    <p className="mr-1 font-bold">{comment.username}</p>
                    <p className="hidden text-sm text-gray-500 md:inline">
                      @{comment.username.replace(/\s+/g, '').toLowerCase()} .
                    </p>
                    <TimeAgo
                      className="text-sm text-gray-500"
                      date={comment._createdAt}
                    />
                  </div>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Tweet
