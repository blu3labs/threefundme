import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { CompaignContributionReceived } from "../generated/schema"
import { CompaignContributionReceived as CompaignContributionReceivedEvent } from "../generated/CompaignFactoryManager/CompaignFactoryManager"
import { handleCompaignContributionReceived } from "../src/compaign-factory-manager"
import { createCompaignContributionReceivedEvent } from "./compaign-factory-manager-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let compaign = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let contributor = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newCompaignContributionReceivedEvent = createCompaignContributionReceivedEvent(
      compaign,
      contributor
    )
    handleCompaignContributionReceived(newCompaignContributionReceivedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CompaignContributionReceived created and stored", () => {
    assert.entityCount("CompaignContributionReceived", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CompaignContributionReceived",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "compaign",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CompaignContributionReceived",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "contributor",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
