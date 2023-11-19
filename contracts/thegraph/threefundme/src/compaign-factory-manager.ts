import {
  CompaignContributionReceived as CompaignContributionReceivedEvent,
  CompaignCreated as CompaignCreatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/CompaignFactoryManager/CompaignFactoryManager"
import {
  CompaignContributionReceived,
  CompaignCreated,
  OwnershipTransferred
} from "../generated/schema"

export function handleCompaignContributionReceived(
  event: CompaignContributionReceivedEvent
): void {
  let entity = new CompaignContributionReceived(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.compaign = event.params.compaign
  entity.contributor = event.params.contributor

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCompaignCreated(event: CompaignCreatedEvent): void {
  let entity = new CompaignCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.compaign = event.params.compaign
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
