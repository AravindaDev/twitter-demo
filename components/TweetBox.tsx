import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { Dispatch, MouseEvent, SetStateAction, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Tweet, TweetBody } from '../typings'
import { fetchTweets } from '../utils/fetchTweets'

interface Props {
  setTweets: Dispatch<SetStateAction<Tweet[]>>
}

const TweetBox = ({ setTweets }: Props) => {
  const [input, setInput] = useState('')
  const { data: session } = useSession()
  const [image, setImage] = useState('')
  const [imageURLBoxIsOpen, setImageURLBoxIsOpen] = useState<boolean>(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const addImageToTweet = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault()
    if (!imageInputRef.current?.value) return
    setImage(imageInputRef.current.value)
    imageInputRef.current.value = ''
    setImageURLBoxIsOpen(false)
    // console.log(image)
  }
  console.log(session)
  const handleSubmit = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault()
    postTweet()
    setInput('')
    setImage('')
    setImageURLBoxIsOpen(false)
  }

  const postTweet = async () => {
    const tweetBody: TweetBody = {
      text: input,
      username: session?.user?.name || 'Unknown',
      profileImage:
        session?.user?.image ||
        'https://icon-library.com/images/8-512_32367.png',
      image: image,
    }

    const result = await fetch(`/api/addTweet`, {
      method: 'POST',
      body: JSON.stringify(tweetBody),
    })
    const json = await result.json()
    const newTweets = await fetchTweets()
    setTweets(newTweets)
    toast("Tweet Posted'", {
      icon: <EmojiHappyIcon className="text-twitter" />,
    })
    return json
  }

  return (
    <div className="flex space-x-2 p-5">
      <img
        src={session?.user?.image || 'https://picsum.photos/200'}
        alt=""
        className="mt-4 h-14 w-14 rounded-full object-cover"
      />
      <div className="flex flex-1 items-center pl-2">
        <form className="flex flex-1 flex-col">
          <input
            type="text"
            placeholder="What's Happening?"
            className="h-24 w-full text-xl outline-none placeholder:text-xl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center ">
            <div className="flex flex-1 space-x-2 text-twitter">
              {/* Icons */}
              <PhotographIcon
                onClick={() => setImageURLBoxIsOpen(!imageURLBoxIsOpen)}
                className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150"
              />
              <SearchCircleIcon className="h-5 w-5 " />
              <EmojiHappyIcon className="h-5 w-5 " />
              <CalendarIcon className="h-5 w-5 " />
              <LocationMarkerIcon className="h-5 w-5 " />
            </div>
            <button
              onClick={handleSubmit}
              className="rounded-full bg-twitter px-5 py-2 font-bold text-white disabled:opacity-40"
              disabled={!input || !session}
            >
              Tweet
            </button>
          </div>
          {imageURLBoxIsOpen && (
            <form className="mt-5 flex rounded-lg bg-twitter/80 py-2 px-4">
              <input
                type="text"
                ref={imageInputRef}
                placeholder="Enter Image URL..."
                className="flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white"
              />
              <button
                className="font-bold text-white"
                type="submit"
                onClick={addImageToTweet}
              >
                Add Image
              </button>
            </form>
          )}
          {image && (
            <img
              src={image}
              className="mt-10 h-40 w-full rounded-xl object-contain shadow-lg"
              alt=""
            />
          )}
        </form>
      </div>
    </div>
  )
}

export default TweetBox
