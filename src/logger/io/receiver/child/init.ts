import { Child } from "./";
import { ReceiverDataFactory } from "../data";
import { Heartbeat } from "../../../app/heartbeat";
import { Config } from "../../../../config/init";
import { HeartbeatName } from "../../../../config";

const receiverData = ReceiverDataFactory.create();
const heartbeat = new Heartbeat(
  Config.heartbeatConfigService.getHeartbeat(HeartbeatName.CHILD),
  null,
  Child.errorHandler,
);

const child = new Child(
  receiverData,
  heartbeat,
);

child.activate();