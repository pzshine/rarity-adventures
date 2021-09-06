import React from "react"
import styled from "styled-components"
import { classes } from "../constants/classes.js"
import { summon } from "../hooks/utils"

const ClassContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  justify-content: center;
`

const ClassBox = styled.div`
  width: calc(12.5% - 30px);
  padding: 20px;
  margin: 15px;
  cursor: pointer;
  transition: 0.3s;
  text-align: center;
  &:hover,
  &:active,
  &:focus {
    opacity: 0.8;
  }
`

export default ({ signer }) => {
  return (
    <>
      <img src="images/GrandWizard.png" style={{ maxWidth: "250px", margin: "0 auto", display: "block" }} />
      <h2 style={{ textTransform: "uppercase", textAlign: "center" }}>
        Mint your class
        <br /> by choosing and clicking on right below.
      </h2>
      <ClassContainer>
        {classes.map(({ id, name }) => {
          return (
            <ClassBox
              key={id}
              onClick={async () => {
                await summon(id, signer)
              }}
            >
              <img src={`/images/${name}.png`} style={{ width: "100%", maxWidth: "150px" }} />
              <h5 style={{ color: "#fff" }}>{name}</h5>
            </ClassBox>
          )
        })}
      </ClassContainer>
    </>
  )
}
