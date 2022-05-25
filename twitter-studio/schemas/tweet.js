export default {
  name: 'tweet',
  title: 'Tweet',
  type: 'document',
  fields: [
    {
      name: 'text',
      title: 'Tweet Text',
      type: 'string',
    },
    {
      name: 'blockTweet',
      title: 'Block Tweet',
      type: 'boolean',
      description: 'Admin Control: Block this tweet from appearing in the feed',
    },
    {
      name: 'username',
      title: 'Username',
      type: 'string',
    },
    {
      name: 'profileImage',
      title: 'Profile Image',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Tweet Image',
      type: 'string',
    },
  ],
}
