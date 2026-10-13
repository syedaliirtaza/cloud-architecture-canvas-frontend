export type AWSIconType =
  | "EC2Icon"
  | "APIGateway"
  | "AppRunner"
  | "AppFlow"
  | "ApplicationAutoScaling"
  | "AppSync"
  | "Aurora"
  | "Batch"
  | "Chime"
  | "CloudSearch"
  | "CodeGuru"
  | "ComputeOptimizer"
  | "Connect"
  | "DataPipeline"
  | "DatabaseMigrationService"
  | "DataZone"
  | "DeepComposer"
  | "DevOpsGuru"
  | "DocumentDB"
  | "DynamoDB"
  | "EC2AutoScaling"
  | "EC2ImageBuilder"
  | "ECSAnywhere"
  | "EFS"
  | "EKSAnywhere"
  | "EKSCloud"
  | "EKSDistro"
  | "ElasticBeanstalk"
  | "ElasticBlockStore"
  | "ElasticContainerRegistry"
  | "ElasticContainerService"
  | "ElasticFabricAdapter"
  | "ElasticKubernetesService"
  | "ElastiCache"
  | "EventBridge"
  | "Fargate"
  | "Glue"
  | "Keyspaces"
  | "KinesisDataAnalytics"
  | "KinesisDataStreams"
  | "KinesisFirehose"
  | "KinesisVideoStreams"
  | "Kinesis"
  | "LakeFormation"
  | "Lambda"
  | "MemoryDBForRedis"
  | "MQ"
  | "Neptune"
  | "OpenSearchService"
  | "QuickSight"
  | "RDSonVMware"
  | "RDS"
  | "RedHatOpenShiftServiceOnAWS"
  | "Redshift"
  | "SageMakerStudioLab"
  | "SageMaker"
  | "SimpleQueueService"
  | "SimpleStorageService"
  | "Snowball"
  | "StepFunctions"
  | "StorageGateway"
  | "TensorFlowOnAWS"
  | "Timestream"
  | "TorchServe"
  | "WorkDocs"
  | "WorkMail";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export interface Workspace {
  id: number;
  workspaceName: string;
  workspaceDescription: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}

export type CollaboratorRole = "OWNER" | "COLLABORATOR";

export interface Collaborator extends User {
  role?: CollaboratorRole;
}

export type CanvasAction = {
  actionType: "ADD" | "UPDATE" | "DELETE";
  element: CanvasElement;
  userId?: string;
  workspaceId?: number;
};

export type UserCursor = {
  userId: string;
  username: string;
  x: number;
  y: number;
  color: string;
  workspaceId: number;
};

export type ShapeType =
  | "rectangle"
  | "circle"
  | "line"
  | "arrow"
  | "freedraw"
  | "text"
  | "awsIcon"
  | "elbowArrow"
  | "dashedRectangle"
  | "diagramContainer";

export interface BaseElement {
  id: string;
  type: ShapeType;
}

export interface RectangleElement extends BaseElement {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  stroke: string;
  fill: string;
  strokeWidth: number;
  text: string;
  data?: { containerId?: string; [key: string]: any };
}

export interface CircleElement extends BaseElement {
  type: "circle";
  x: number;
  y: number;
  radius: number;
  stroke: string;
  fill: string;
  strokeWidth: number;
  text: string;
  data?: { containerId?: string; [key: string]: any };
}

export interface LineElement extends BaseElement {
  type: "line" | "arrow";
  x: number;
  y: number;
  points: number[];
  stroke: string;
  strokeWidth: number;
  text: string;
  data?: { containerId?: string; [key: string]: any };
}

export interface FreeDrawElement extends BaseElement {
  type: "freedraw";
  x: number;
  y: number;
  points: number[];
  stroke: string;
  strokeWidth: number;
  text: string;
  data?: { containerId?: string; [key: string]: any };
}

export interface TextElement extends BaseElement {
  type: "text";
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  data?: { containerId?: string; [key: string]: any };
}

export type CursorsMap = Record<string, { x: number; y: number }>;

export interface AWSIconElement extends BaseElement {
  type: "awsIcon";
  iconType: AWSIconType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  data?: { containerId?: string; [key: string]: any };
}

export interface ElbowArrowElement extends BaseElement {
  type: "elbowArrow";
  points: number[];
  stroke: string;
  strokeWidth: number;
  x: number;
  y: number;
  text: string;
  data?: { containerId?: string; [key: string]: any };
}

export interface DashedRectangleElement extends BaseElement {
  type: "dashedRectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  stroke: string;
  strokeWidth: number;
  fill?: string;
  text?: string;
  data?: { containerId?: string; [key: string]: any };
}

export interface DiagramContainerElement extends BaseElement {
  type: "diagramContainer";
  x: number;
  y: number;
  width: number;
  height: number;
  stroke: string;
  strokeWidth: number;
  fill?: string;
  text: string;
  data: {
    dsl: string;
    title: string;
    [key: string]: any;
  };
}
export interface CanvasElementCommon extends BaseElement {
  data?: { [key: string]: any };
}
export type CanvasElement =
  | RectangleElement
  | CircleElement
  | LineElement
  | FreeDrawElement
  | TextElement
  | DashedRectangleElement
  | ElbowArrowElement
  | AWSIconElement
  | DiagramContainerElement;
