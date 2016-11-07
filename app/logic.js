let twitter = require.main.require('./app/config/twitter')
// let Tweets = require.main.require('./app/models/tweets')
let Stories = require.main.require('./app/models/stories')
let MarkovGen = require('markov-generator')
// let fs = require('fs')

let arr = ['The Tomb', 'Dagon', 'A Reminiscence of Dr. Samuel Johnson', 'Polaris', 'Beyond the Wall of Sleep', 'Memory', 'Old Bugs', 'The Transition of Juan Romero', 'The White Ship', 'The Doom that Came to Sarnath', 'The Statement of Randolph Carter', 'The Street', 'The Terrible Old Man', 'The Cats of Ulthar', 'The Tree', 'Celephaïs', 'From Beyond', 'The Temple', 'Nyarlathotep', 'The Picture in the House', 'Facts Concerning the Late Arthur Jermyn and His Family', 'The Nameless City', 'The Quest of Iranon', 'The Moon-Bog', 'Ex Oblivione', 'The Other Gods', 'The Outsider', 'The Music of Erich Zann', 'Sweet Ermengarde', 'Hypnos', 'What the Moon Brings', 'Azathoth', 'Herbert West–Reanimator', 'The Hound', 'The Lurking Fear', 'The Rats in the Walls', 'The Unnamable', 'The Festival', 'The Shunned House', 'The Horror at Red Hook', 'He', 'In the Vault', 'Cool Air', 'The Call of Cthulhu', "Pickman's Model", 'The Strange High House in the Mist', 'The Silver Key', 'The Dream-Quest of Unknown Kadath', 'The Case of Charles Dexter Ward', 'The Colour Out of Space', 'The Descendant', 'The Very Old Folk', 'History of the Necronomicon', 'The Dunwich Horror', 'Ibid', 'The Whisperer in Darkness', 'At the Mountains of Madness', 'The Shadow Over Innsmouth', 'The Dreams in the Witch House', 'The Thing on the Doorstep', 'The Book', 'The Evil Clergyman', 'The Shadow Out of Time', 'The Haunter of the Dark']

let saveArray = () => {
  arr.forEach((e) => {
    Stories.find({title: e}, (err, story) => {
      if (err) throw err
      if (!story.length) {
        let st = new Stories({
          title: e,
          content: ''
        })
        st.save((err, saved) => {
          if (err) throw err
          console.log('saved', saved)
        })
      } else {
        // console.log('story exists')
      }
    })
  })
}

let generateTweet = (callback) => {
  Stories.find({}, (err, stories) => {
    if (err) throw err
    if (stories.length) {
      let arr = []

      stories.forEach((e) => {
        arr.push(e.title)
      })

      let markov = new MarkovGen({
        input: arr,
        minLength: 4
      })

      let sentence = markov.makeChain()

      while (sentence.length > 140) {
        sentence = markov.makeChain()
      }

      Stories.find({title: sentence}, (err, story) => {
        if (err) throw err
        if (story.length) {
          sentence = markov.makeChain()
        }
      })

      if (callback) { callback(sentence) }
    }
  })
}

let postTweet = (callback) => {
  generateTweet((tweet) => {
    twitter.post('statuses/update', {status: tweet}, function (error, postedTweet, response) {
      if (error) throw error
      if (callback) {
        callback()
      } else {
        console.log(postedTweet)
      }
    })
  })
}

module.exports = {
  generate: generateTweet,
  post: postTweet,
  saveArray: saveArray
}
