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

    it("Add My Symptoms", async () => {
      const { sheWell } = await loadFixture(deploySheWell)
      const startDate = new Date().getTime()
      const endDate = new Date().getTime()

      const symptomsUser = [
        {
          id: 1,
          level: 2,
        },
        {
          id: 2,
          level: 4,
        },
      ]

      const intercourse = {
        useCondom: false,
        hasOrgasm: true,
        count: 2,
      }

      await sheWell.addMySymptom(
        startDate,
        endDate,
        false,
        false,
        3,
        intercourse,
        "",
        symptomsUser,
      )

      const myMCTList = await sheWell.getMCTList()

      assert.equal(myMCTList.length, 1)

      const myMCTSymp = await sheWell.getMyMCTSymptomsId(myMCTList[0].id)

      assert.equal(myMCTSymp[1].level, BigInt("4"))
      assert.equal(myMCTSymp[1].id, BigInt("2"))
    })
  })
})
