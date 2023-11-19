import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  CompaignContributionReceived,
  CompaignCreated,
  OwnershipTransferred
} from "../generated/CompaignFactoryManager/CompaignFactoryManager"

export function createCompaignContributionReceivedEvent(
  compaign: Address,
  contributor: Address
): CompaignContributionReceived {
  let compaignContributionReceivedEvent = changetype<
    CompaignContributionReceived
  >(newMockEvent())

  compaignContributionReceivedEvent.parameters = new Array()

  compaignContributionReceivedEvent.parameters.push(
    new ethereum.EventParam("compaign", ethereum.Value.fromAddress(compaign))
  )
  compaignContributionReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "contributor",
      ethereum.Value.fromAddress(contributor)
    )
  )

  return compaignContributionReceivedEvent
}

export function createCompaignCreatedEvent(
  compaign: Address,
  owner: Address
): CompaignCreated {
  let compaignCreatedEvent = changetype<CompaignCreated>(newMockEvent())

  compaignCreatedEvent.parameters = new Array()

  compaignCreatedEvent.parameters.push(
    new ethereum.EventParam("compaign", ethereum.Value.fromAddress(compaign))
  )
  compaignCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return compaignCreatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
