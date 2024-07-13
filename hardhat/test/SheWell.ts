import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { assert } from "chai"
import { ethers } from "hardhat"

describe("SheWell", function () {
  async function deploySheWell() {
    const [owner, account1, account2] = await ethers.getSigners()

    const SheWell = await ethers.getContractFactory("SheWell")

    const sheWell = await SheWell.deploy()

    return { sheWell, owner, account1, account2 }
  }

  describe("Basic Test", () => {
    it("Add User", async () => {
      const { sheWell } = await loadFixture(deploySheWell)
      const name = "Dancing Queen"
      const content = "test content"

      await sheWell.registerUser(name, content)

      const userInfo = await sheWell.getMyUserInfo()

      assert(userInfo.name, name)
    })

    it("Add Symptom", async () => {
      const { sheWell } = await loadFixture(deploySheWell)
      const name = "Acalorada"
      const emoji = "🩸"

      await sheWell.addSymptom(name, emoji)
      const symptoms = await sheWell.getSymptoms()

      assert.equal(symptoms[0].name, name)
    })

    it("Add Sugestion", async () => {
      const { sheWell } = await loadFixture(deploySheWell)
      const start = 1
      const end = 3
      const content = "Acalorada"

      await sheWell.addSuggestion(start, end, content)
      const suggestions = await sheWell.getSuggestions()

      assert.equal(suggestions[0].content, content)
    })

    it("Add MCT Item", async () => {
      const { sheWell } = await loadFixture(deploySheWell)

      const title = "🍓😧"
      const content = "contenido CID"
      const eventDate = new Date().getTime()
      await sheWell.addMCTItem(title, eventDate, content)
      const lastMCTID = await sheWell.getLastMCTID()

      const myMCTList = await sheWell.getMCTList()

      assert.equal(myMCTList[0].id, lastMCTID)
    })

    it("Modify MCT Item", async () => {
      const { sheWell } = await loadFixture(deploySheWell)

      let title = "🍓😧"
      const content = "contenido CID"
      const eventDate = new Date().getTime()
      await sheWell.addMCTItem(title, eventDate, content)

      let myMCTList = await sheWell.getMCTList()

      title = "😧"
      await sheWell.modifyMCTItem(0, title, content)

      myMCTList = await sheWell.getMCTList()

      assert.equal(myMCTList.length, 1)
    })
  })
})
