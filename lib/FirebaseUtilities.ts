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
import { Score } from '../components/Valuation/LandLikeBox'
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
    'axie-infinity-watchlist': [],
  })
}
// Add Missing Watchlist in case there's an update/new metaverse and user had already been created
export async function addMissingWatchlist(
  walletAddress: string,
  watchlist: string
) {
  const users = collection(db, 'users')

  await updateDoc(doc(users, walletAddress), {
    [watchlist]: [],
  })
}

// Add Land to User's WatchList
export async function addLandToWatchList(
  landId: string,
  walletAddress: string,
  metaverse: Metaverse
) {
  const user = doc(db, 'users', walletAddress)
  await updateDoc(user, {
    [metaverse + '-watchlist']: arrayUnion(landId),
  })

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
  await updateDoc(user, {
    [metaverse + '-watchlist']: arrayRemove(landId),
  })

  const updatedData = await getUserInfo(walletAddress)
  return updatedData
}

/* Valuation scores  */

//get valuation scores
export async function getValuationScores(landId: string, metaverse: Metaverse) {
  try {
    const land = doc(db, 'lands-' + metaverse, landId)
    const score = (await getDoc(land)).data()
    if (!score) return await createValuationScore(landId, metaverse)
    return score
  } catch (error) {
    console.log(error)
  }
}

// Creating a valuation score
export async function createValuationScore(
  landId: string,
  metaverse: Metaverse
) {
  const land = collection(db, 'lands-' + metaverse)
  await setDoc(doc(land, landId), {
    likes: [],
    dislikes: [],
  })
}

export async function setFirebaseLands(lands: any[], metaverse: Metaverse) {
  const heatmap = doc(db, 'heatmaps', metaverse)
  await updateDoc(heatmap, {
    values: arrayUnion(lands),
  })
}

export async function getFirebaseLands(metaverse: Metaverse) {
  const heatmap = doc(db, 'heatmaps', metaverse)
  const heatmapData = (await getDoc(heatmap)).data()
  if (!heatmapData) return
  return heatmapData.values
}

// Like Land Valuation
export async function likeLand(
  landId: string,
  address: string,
  metaverse: Metaverse
) {
  const land = doc(db, 'lands-' + metaverse, landId)
  const landData = (await getDoc(land)).data() as Score | undefined
  // If user already liked then take that like away
  if (landData?.likes.includes(address))
    return await updateDoc(land, {
      likes: arrayRemove(address),
    })

  await updateDoc(land, {
    likes: arrayUnion(address),
  })
  await updateDoc(land, {
    dislikes: arrayRemove(address),
  })
}

// Dislike Land Valuation
export async function dislikeLand(
  landId: string,
  address: string,
  metaverse: Metaverse
) {
  const land = doc(db, 'lands-' + metaverse, landId)
  const landData = (await getDoc(land)).data() as Score | undefined
  // If user already disliked then take that dislike away
  if (landData?.dislikes.includes(address))
    return await updateDoc(land, {
      dislikes: arrayRemove(address),
    })

  await updateDoc(land, {
    dislikes: arrayUnion(address),
  })
  await updateDoc(land, {
    likes: arrayRemove(address),
  })
}

// Retrieve valuation daily data
export async function getValuationDailyData(metaverse: Metaverse) {
  const valuesDoc = doc(db, 'valuationGraphs', metaverse)
  const values = (await getDoc(valuesDoc)).data()?.values
  return values
}
