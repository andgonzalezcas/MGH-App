import { initializeApp } from 'firebase/app'
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  setDoc,
} from 'firebase/firestore/lite'
import { Metaverse } from './enums'

// Firebase Init
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: 'mgh-app-d6122.firebaseapp.com',
  projectId: 'mgh-app-d6122',
  storageBucket: 'mgh-app-d6122.appspot.com',
  messagingSenderId: '335800469615',
  appId: '1:335800469615:web:a90434b4ff8ff6e9c2259a',
  measurementId: 'G-SYMJ1J305Q',
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Getting User Instance
export async function getUserInfo(walletAddress: string) {
  const userRef = doc(db, 'users', walletAddress)
  const user = await getDoc(userRef)
  return user.data()
}

// Creating a User
export async function createUser(walletAddress: string) {
  const users = collection(db, 'users')
  await setDoc(doc(users, walletAddress), {
    'sandbox-watchlist': [],
    'decentraland-watchlist': [],
  })
}

// Add Land to User's WatchList
export async function addLandToWatchList(
  landId: string,
  walletAddress: string,
  metaverse: Metaverse
) {
  const user = doc(db, 'users', walletAddress)
  if (metaverse == 'sandbox') {
    await updateDoc(user, {
      'sandbox-watchlist': arrayUnion(landId),
    })
  } else if (metaverse == 'decentraland') {
    await updateDoc(user, {
      'decentraland-watchlist': arrayUnion(landId),
    })
  }
  const updatedData = await getUserInfo(walletAddress)
  return updatedData
}

// Remove Land from User's WatchList
export async function removeLandFromWatchList(
  landId: string,
  walletAddress: string,
  metaverse: Metaverse
) {
  const user = doc(db, 'users', walletAddress)
  if (metaverse == 'sandbox') {
    await updateDoc(user, {
      'sandbox-watchlist': arrayRemove(landId),
    })
  } else if (metaverse == 'decentraland') {
    await updateDoc(user, {
      'decentraland-watchlist': arrayRemove(landId),
    })
  }
  const updatedData = await getUserInfo(walletAddress)
  return updatedData
}

/* Commentaries and valuation scores  */

//get valuation scores
export async function getValuationScores(landId: string) {
  let landRef, score
  try {
    landRef = doc(db, 'lands', landId)
    score = await getDoc(landRef)
    return score.data()
  } catch (error) {
    const createdScore = await createValuationScore(landId)
    return createdScore
  }
}

// Creating a valuation score
export async function createValuationScore(landId: string) {
  const land = collection(db, 'lands')
  await setDoc(doc(land, landId), {
    'liked-count': 0,
    'disliked-count': 0,
    commentaries: [],
  })
}

// Add commentary about valuation from user

export async function addCommentaryToLand(
  landId: number,
  walletAddress: string,
  commentary: string,
  likeStatus: boolean
) {
  const landRef = doc(db, 'lands', '' + landId)
  const land = await getDoc(landRef)
  const landData = land.data()
  const likedCount = landData ? landData['liked-count'] : 0
  const dislikedCount = landData ? landData['disliked-count'] : 0

  if (likeStatus) {
    await updateDoc(landRef, {
      'liked-count': likedCount + 1,
      'disliked-count': dislikedCount,
      commentaries: arrayUnion(commentary),
    })
  } else {
    await updateDoc(landRef, {
      'liked-count': likedCount,
      'disliked-count': dislikedCount + 1,
      commentaries: arrayUnion(commentary),
    })
  }

  const updatedData = await getValuationScores(walletAddress)
  return updatedData
}