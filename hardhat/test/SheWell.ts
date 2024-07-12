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
  })
})
