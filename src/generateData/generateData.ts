import { db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { omit } from "lodash";

import { keyLetters } from "./keyLetters";
import { coefficients } from "./coefficients";
import { increases } from "./increases";

async function createKeyLetters() {
  for (const keyLetter of keyLetters) {
    await setDoc(doc(db, "keyLetters", keyLetter._id), omit(keyLetter, "_id"));
  }
}

async function createCoefficients() {
  for (const coefficient of coefficients) {
    await setDoc(
      doc(db, "coefficients", coefficient._id),
      omit(coefficient, "_id")
    );
  }
}

async function createIncreases() {
  for (const increase of increases) {
    await setDoc(doc(db, "increases", increase._id), omit(increase, "_id"));
  }
}

export function generateData() {
  return Promise.all([
    createKeyLetters(),
    createCoefficients(),
    createIncreases(),
  ]);
}
