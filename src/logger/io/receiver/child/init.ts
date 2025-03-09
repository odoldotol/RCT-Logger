import { ChildSlave as SerialChildSlave } from "./slave";
import { ReceiverDataFactory } from "../data";
import { Heartbeat } from "../../../app/heartbeat";
import { Config } from "../../../../config/init";
import { HeartbeatName } from "../../../../config";

const receiverData = ReceiverDataFactory.create();
const heartbeat = new Heartbeat(
  Config.heartbeatConfigService.getHeartbeat(HeartbeatName.CHILD),
  null,
  SerialChildSlave.errorHandler,
);

const serialChild = new SerialChildSlave(
  receiverData,
  heartbeat,
);

serialChild.activate();