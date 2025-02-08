import { Child } from "./";
import { ReceiverDataFactory } from "../data";

const receiverData = ReceiverDataFactory.create();
const child = new Child(receiverData);

child.activate();