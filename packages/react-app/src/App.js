import React, { useState } from "react"
import { readRarityData, embarkAdventure, levelUp, convertBigNumber } from "./hooks/utils"

import { Body, Button, Header, Container } from "./components"
import useWeb3Modal from "./hooks/useWeb3Modal"

import { addresses, abis } from "@project/contracts"
import ClassTable from "./components/ClassTable"
import CreateCharacter from "./components/CreateCharacter"
import UpdateAttributes from "./components/UpdateAttributes"

import { Contract } from "@ethersproject/contracts"

import { Web3Provider } from "@ethersproject/providers"

async function getGoldBalance(id, signer) {
  const rarityGoldContract = new Contract(addresses.rarityGold, abis.rarityGold, signer)
  const goldBalance = await rarityGoldContract.balanceOf(id)
  return convertBigNumber(goldBalance)
}

async function getClaimableGold(id, signer) {
  const rarityGoldContract = new Contract(addresses.rarityGold, abis.rarityGold, signer)
  const claimableAmount = await rarityGoldContract.claimable(id)
  return convertBigNumber(claimableAmount)
}

async function claimGold(id, signer) {
  const rarityGoldContract = new Contract(addresses.rarityGold, abis.rarityGold, signer)
  const tx = await rarityGoldContract.claim(id)
}

async function characterCreated(id, signer) {
  const rarityAttributesContract = new Contract(addresses.rarityAttributes, abis.rarityAttributes, signer)
  const data = await rarityAttributesContract.character_created(id)
  return data
}

async function getAbilityScores(id, signer) {
  const rarityAttributesContract = new Contract(addresses.rarityAttributes, abis.rarityAttributes, signer)
  const data = await rarityAttributesContract.ability_scores(id)
  console.log(data)
}

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal()
        } else {
          logoutOfWeb3Modal()
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  )
}

function App() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal()
  const [signer, setSigner] = useState({})

  const [created, setCreated] = useState(false)
  const [id, setID] = useState(0)
  const [charClass, setCharClass] = useState("")
  const [level, setLevel] = useState("")
  const [xp, setXP] = useState("")
  const [xpRequired, setXPRequired] = useState("")
  const [goldBalance, setGoldBalance] = useState("")
  const [claimableGold, setClaimableGold] = useState("")

  React.useEffect(() => {
    const defaultProvider = new Web3Provider(window.ethereum)
    const signer = defaultProvider.getSigner()
    setSigner(signer)
  }, [])

  return (
    <Container>
      <Body>
        <Header>
          <h2 style={{ textTransform: "uppercase" }}>Rarity Adventure</h2>
          <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
        </Header>
        {signer && <ClassTable signer={signer} />}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <label for="summoner">Enter Summoner ID to see stats: </label>
          <input id="summoner" type="text" name="text" />
        </div>
        <div>
          <button
            value="Send"
            style={{
              width: "60px",
              height: "20px",
              color: "black",
            }}
            onClick={async () => {
              const id = document.getElementById("summoner").value
              setID(id)
              const charCreated = await characterCreated(id, signer)
              setCreated(charCreated)
              const data = await readRarityData(id, signer)
              const claimable = await getClaimableGold(id, signer)
              const balance = await getGoldBalance(id, signer)
              setGoldBalance(balance)
              setClaimableGold(claimable)
              setCharClass(data["class"])
              setLevel(data["level"])
              setXP(data["xp"])
              setXPRequired(data["xpRequired"])
            }}
          >
            Submit{" "}
          </button>
        </div>
        {parseInt(xpRequired) == 0 ? <button onClick={() => levelUp(id, signer)}>Level Up</button> : <div />}
        <div>
          <div>
            <div>
              {id == 0 ? (
                <p>please enter summoner ID first</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p>Summoner ID: {id}</p>
                  <p>Class: {charClass}</p>
                  <p>Level: {level}</p>
                  <p>XP: {xp}</p>
                  <p>
                    XP required to level up (to level {parseInt(level) + 1}) : {xpRequired}
                  </p>
                  <button onClick={() => embarkAdventure(id, signer)}>Adventure</button>
                </div>
              )}
              {parseInt(xpRequired) == 0 && <button onClick={() => levelUp(id, signer)}>Level Up</button>}
            </div>
          </div>
        </div>
      </Body>
    </Container>
  )
}

export default App
