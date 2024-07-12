import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const SheWellModule = buildModule("SheWellModule", (m) => {
  const sheWell = m.contract("SheWell")

  return { sheWell }
})

export default SheWellModule
